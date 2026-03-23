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

  const map = new Map<number, any>();

  for (const [key, value] of formData.entries()) {
    const match = key.match(/reviews\[(\d+)]\[(\w+)]/);
    if (!match) continue;

    const index = Number(match[1]);
    const field = match[2];

    if (!map.has(index)) map.set(index, {});
    map.get(index)![field] = value;
  }

  for (const r of map.values()) {
    if (!r.id) continue;

    const { error } = await supabase
      .from("reviews")
      .update({
        name: r.name,
        text: r.text,
        rating: Number(r.rating),
        is_active: r.is_active === "on",
      })
      .eq("id", r.id);

    if (error) return { error: error.message };
  }

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
