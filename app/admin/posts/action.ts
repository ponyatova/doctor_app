"use server";
import { checkAdmin } from "@/lib/actions";
import { uploadImage } from "../content/action";
import { redirect } from "next/navigation";
import { BUCKET } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { getStoragePath } from "@/lib/utils";

export async function createPost(prev: any, formData: FormData) {
  const supabase = await checkAdmin();

  const file = formData.get("file") as File;

  let banner_image = null;

  if (file && file.size > 0) {
    banner_image = await uploadImage(file);
  }

  const { error } = await supabase.from("posts").insert({
    title: formData.get("title"),
    slug: formData.get("slug"),
    banner_image,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/posts");
  return { success: true };
}

export async function updatePosts(prev: any, formData: FormData) {
  const supabase = await checkAdmin();

  const { data: old } = await supabase
    .from("posts")
    .select("banner_image")
    .eq("id", formData.get("id"))
    .single();

  let banner_image = old?.banner_image ?? null;

  const file = formData.get("file") as File;

  // 🔹 если загрузили новый файл
  if (file && file.size > 0) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("image")
      .upload(fileName, file);

    if (uploadError) return { error: uploadError.message };

    const { data } = supabase.storage.from("image").getPublicUrl(fileName);

    const newUrl = data.publicUrl;
    if (old?.banner_image) {
      const path = old.banner_image.match(
        /\/object\/public\/[^/]+\/(.+)$/,
      )?.[1];

      if (path) {
        await supabase.storage.from("image").remove([path]);
      }
    }

    banner_image = newUrl;
  }

  const { error } = await supabase
    .from("posts")
    .update({
      title: formData.get("title") || "",
      slug: formData.get("slug") || "",
      banner_image,
    })
    .eq("id", formData.get("id"));

  if (error) return { error: error.message };

  revalidatePath("/admin/posts");
  return { success: true };
}

export async function deletePost(id: string) {
  const supabase = await checkAdmin();

  const { data } = await supabase
    .from("posts")
    .select("banner_image")
    .eq("id", id)
    .single();

  if (data?.banner_image) {
    const path = data.banner_image.match(/\/object\/public\/[^/]+\/(.+)$/)?.[1];

    if (path) {
      await supabase.storage.from("image").remove([path]);
    }
  }

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) return { error: error.message };

  redirect("/admin/content");
}
export async function createSection(prev: any, formData: FormData) {
  const supabase = await checkAdmin();

  const file = formData.get("file") as File;

  let image: string | null = null;

  if (file && file.size > 0) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file);

    if (error) return { error: error.message };

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

    image = data.publicUrl || "";
  }

  const { error } = await supabase.from("post_sections").insert({
    post_id: formData.get("post_id"),
    title: formData.get("title"),
    text: formData.get("text"),
    order_num: Number(formData.get("order_num")),
    image,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/posts");
  return { success: true };
}

export async function updateSections(prev: any, formData: FormData) {
  const supabase = await checkAdmin();

  const { data: old } = await supabase
    .from("post_sections")
    .select("image")
    .eq("id", formData.get("id"))
    .single();

  let image = old?.image ?? null;
  const file = formData.get("file") as File;

  // 🔹 новый файл
  if (file && file.size > 0) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file);

    if (uploadError) return { error: uploadError.message };

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

    const newUrl = data.publicUrl;

    if (old?.image) {
      const path = getStoragePath(old.image);
      if (path) {
        await supabase.storage.from(BUCKET).remove([path]);
      }
    }

    image = newUrl;
  }

  const { error } = await supabase
    .from("post_sections")
    .update({
      title: formData.get("title") || "",
      text: formData.get("text") || "",
      order_num: Number(formData.get("order_num")),
      image,
    })
    .eq("id", formData.get("id"));

  if (error) return { error: error.message };
  const path = `/admin/posts?tab=sections&post_id=${formData.get("id")}`;
  revalidatePath(path);
  return { success: true };
}

export async function deleteSection(id: string) {
  const supabase = await checkAdmin();

  const { data } = await supabase
    .from("post_sections")
    .select("image")
    .eq("id", id)
    .single();

  if (data?.image) {
    const path = getStoragePath(data.image);
    if (path) {
      await supabase.storage.from(BUCKET).remove([path]);
    }
  }

  await supabase.from("post_sections").delete().eq("id", id);

  revalidatePath("/admin/posts");
}
