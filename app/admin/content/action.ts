"use server";
import { checkAdmin } from "@/lib/actions";
import { BUCKET } from "@/lib/constants";
import { getStoragePath } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function uploadImage(file: File) {
  const supabase = await checkAdmin();

  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

  return data.publicUrl;
}

export async function updateBanner(prevState: any, formData: FormData) {
  const supabase = await checkAdmin();

  const id = Number(formData.get("id"));
  const file = formData.get("file") as File | null;

  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;

  const { data: old } = await supabase
    .from("banners")
    .select("image_url")
    .eq("id", id)
    .single();

  let image_url = old?.image_url ?? null;

  // новая загрузка
  if (file && file.size > 0) {
    const newUrl = await uploadImage(file);

    // удалить старый ТОЛЬКО после успешной загрузки нового
    if (old?.image_url) {
      const oldPath = getStoragePath(old.image_url);
      if (oldPath) {
        await supabase.storage.from(BUCKET).remove([oldPath]);
      }
    }

    image_url = newUrl;
  }

  const { error } = await supabase
    .from("banners")
    .update({
      title,
      subtitle,
      image_url,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/content");
  return { success: true };
}

export async function deleteBanner(id: string) {
  const supabase = await checkAdmin();

  // получить image_url
  const { data } = await supabase
    .from("banners")
    .select("image_url")
    .eq("id", id)
    .single();

  if (data?.image_url) {
    const path = data.image_url.split(`storage/v1/object/public/${BUCKET}/`)[1];

    if (path) {
      await supabase.storage.from(BUCKET).remove([path]);
    }
  }

  const { error } = await supabase.from("banners").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/content");
  return { success: true };
}

export async function createBanner(prevState: any, formData: FormData) {
  const supabase = await checkAdmin();

  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const file = formData.get("file") as File;

  if (!title) return { error: "Введите заголовок" };
  if (!file || file.size === 0) return { error: "Загрузите изображение" };

  const fileName = `${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file);

  if (uploadError) return { error: uploadError.message };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

  const image_url = data.publicUrl;

  const { error } = await supabase.from("banners").insert({
    title,
    subtitle,
    image_url,
  });

  // если ошибка — чистим storage
  if (error) {
    await supabase.storage.from(BUCKET).remove([fileName]);
    return { error: error.message };
  } else {
    revalidatePath("/admin/content");
    return { success: true };
  }
}

export async function addProblem(prevState: any, formData: FormData) {
  const supabase = await checkAdmin();

  const title = formData.get("title") as string;
  const order_num = Number(formData.get("order_num")) || null;

  if (!title) return { error: "Введите название" };

  const { error } = await supabase.from("problems").insert({
    title,
    order_num,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/content?tab=problems");
  return { success: true };
}

export async function upsertProblems(prevState: any, formData: FormData) {
  const supabase = await checkAdmin();

  const map = new Map<number, any>();

  for (const [key, value] of formData.entries()) {
    const match = key.match(/problems\[(\d+)]\[(\w+)]/);
    if (!match) continue;

    const index = Number(match[1]);
    const field = match[2];

    if (!map.has(index)) map.set(index, {});
    map.get(index)![field] = value;
  }

  const problems = Array.from(map.values());

  for (const p of problems) {
    if (p.id) {
      const { error } = await supabase
        .from("problems")
        .update({
          title: p.title,
          order_num: p.order_num ? Number(p.order_num) : null,
        })
        .eq("id", p.id);

      if (error) return { error: error.message };
    }
  }
  revalidatePath("/admin/content?tab=problems");
  return { success: true };
}

export async function deleteProblem(id: string) {
  const supabase = await checkAdmin();

  const { error } = await supabase.from("problems").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/content?tab=problems");
  return { success: true };
}

export async function addStage(prevState: any, formData: FormData) {
  const supabase = await checkAdmin();

  const stage = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    color_gradient: formData.get("color_gradient") as string,
    threshold: Number(formData.get("threshold")),
    order_num: Number(formData.get("order_num")) || null,
  };

  if (!stage.title) return { error: "Введите название" };

  const { error } = await supabase.from("treatment_stages").insert(stage);

  if (error) return { error: error.message };
  revalidatePath("/admin/content?tab=stages");
  return { success: true };
}

export async function upsertStages(prevState: any, formData: FormData) {
  const supabase = await checkAdmin();

  const map = new Map<number, any>();

  for (const [key, value] of formData.entries()) {
    const match = key.match(/stages\[(\d+)]\[(\w+)]/);
    if (!match) continue;

    const index = Number(match[1]);
    const field = match[2];

    if (!map.has(index)) map.set(index, {});
    map.get(index)![field] = value;
  }

  const stages = Array.from(map.values());

  for (const s of stages) {
    if (s.id) {
      const { error } = await supabase
        .from("treatment_stages")
        .update({
          title: s.title,
          description: s.description,
          color_gradient: s.color_gradient,
          threshold: Number(s.threshold),
          order_num: s.order_num ? Number(s.order_num) : null,
        })
        .eq("id", s.id);

      if (error) return { error: error.message };
    }
  }
  revalidatePath("/admin/content?tab=stages");
  return { success: true };
}

export async function deleteStage(id: string) {
  const supabase = await checkAdmin();

  const { error } = await supabase
    .from("treatment_stages")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/content?tab=stages");
  return { success: true };
}
