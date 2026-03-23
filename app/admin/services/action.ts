"use server";
import { checkAdmin } from "@/lib/actions";
import { revalidatePath } from "next/cache";

export async function createService(prev: any, formData: FormData) {
  const supabase = await checkAdmin();

  const { error } = await supabase.from("services").insert({
    title: formData.get("title"),
    description: formData.get("description"),
    price: Number(formData.get("price")),
    duration_minutes: Number(formData.get("duration_minutes")),
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/services");
  return { success: true };
}

export async function updateServices(prev: any, formData: FormData) {
  const supabase = await checkAdmin();

  const map = new Map<number, any>();

  for (const [key, value] of formData.entries()) {
    const match = key.match(/services\[(\d+)]\[(\w+)]/);
    if (!match) continue;

    const index = Number(match[1]);
    const field = match[2];

    if (!map.has(index)) map.set(index, {});
    map.get(index)![field] = value;
  }

  for (const s of map.values()) {
    if (!s.id) continue;

    const { error } = await supabase
      .from("services")
      .update({
        title: s.title,
        description: s.description,
        price: Number(s.price),
        duration_minutes: Number(s.duration_minutes),
        updated_at: new Date().toISOString(),
      })
      .eq("id", s.id);

    if (error) return { error: error.message };
  }

  revalidatePath("/admin/services");
  return { success: true };
}

export async function deleteService(id: string) {
  const supabase = await checkAdmin();

  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/services");
  return { success: true };
}
