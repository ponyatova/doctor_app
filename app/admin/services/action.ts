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

  const { error } = await supabase
    .from("services")
    .update({
      title: formData.get("title") || "",
      description: formData.get("description") || "",
      price: Number(formData.get("price")) || 0,
      duration_minutes: Number(formData.get("duration_minutes")) || 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", formData.get("id"));

  if (error) return { error: error.message };

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
