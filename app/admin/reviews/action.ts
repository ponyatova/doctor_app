"use server";
import { checkAdmin } from "@/lib/actions";
import { revalidatePath } from "next/cache";

export async function createReviews(prev: any, formData: FormData) {
  const supabase = await checkAdmin();

  const { error } = await supabase.from("reviews").insert({
    name: formData.get("name"),
    text: formData.get("text"),
    rating: Number(formData.get("rating")),
    is_active: formData.get("is_active") === "on",
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/reviews");
  return { success: true };
}

export async function updateReviews(prev: any, formData: FormData) {
  const supabase = await checkAdmin();

  const { error } = await supabase
    .from("reviews")
    .update({
      name: formData.get("name") || "",
      text: formData.get("text") || "",
      rating: Number(formData.get("rating")) || 0,
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", formData.get("id"));

  if (error) return { error: error.message };

  revalidatePath("/admin/reviews");
  return { success: true };
}

export async function deleteReview(id: string) {
  const supabase = await checkAdmin();

  const { error } = await supabase.from("reviews").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/reviews");
  return { success: true };
}
