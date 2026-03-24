"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {}, // ← ПУСТОЙ
        remove() {}, // ← ПУСТОЙ
      },
    },
  );
}

export async function checkAdmin() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Не авторизован");

  const { data: userData, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (error || !userData?.role || userData.role !== "admin") {
    throw new Error("Недостаточно прав");
  }

  return supabase;
}

export async function getDashboardStats() {
  const supabase = await createServerSupabaseClient();

  const [
    { count: bannersCount },
    { count: doctorsCount },
    { count: activeDoctorsCount },
    { count: problemsCount },
    { count: reviewsCount },
    { count: postsCount },
    { count: treatmentStagesCount },
    { data: recentReviews },
    { data: recentDoctors },
  ] = await Promise.all([
    supabase.from("banners").select("*", { count: "exact", head: true }),
    supabase.from("doctors").select("*", { count: "exact", head: true }),
    supabase
      .from("doctors")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("problems").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase
      .from("treatment_stages")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase.from("doctors").select("*").eq("is_active", true).limit(3),
  ]);

  return {
    bannersCount: bannersCount || 0,
    doctorsCount: doctorsCount || 0,
    activeDoctorsCount: activeDoctorsCount || 0,
    problemsCount: problemsCount || 0,
    reviewsCount: reviewsCount || 0,
    postsCount: postsCount || 0,
    treatmentStagesCount: treatmentStagesCount || 0,
    recentReviews: recentReviews || [],
    recentDoctors: recentDoctors || [],
  };
}

export async function getServices() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
}

export async function getServiceById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function getDoctorFull() {
  const supabase = await createServerSupabaseClient();

  // 1. Получаем врача (у тебя один врач — берем первый)
  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("*")
    .limit(1)
    .single();

  if (doctorError) throw new Error(doctorError.message);

  if (!doctor) {
    throw new Error("Врач не найден");
  }

  const doctorId = doctor.id;

  const [
    { data: contacts },
    { data: addresses },
    { data: schedule },
    { data: education },
  ] = await Promise.all([
    supabase.from("doctor_contacts").select("*").eq("doctor_id", doctorId),

    supabase.from("doctor_addresses").select("*").eq("doctor_id", doctorId),

    supabase
      .from("doctor_schedule")
      .select("*")
      .eq("doctor_id", doctorId)
      .order("day_of_week", { ascending: true }),

    supabase
      .from("doctor_education")
      .select("*")
      .eq("doctor_id", doctorId)
      .order("order_num", { ascending: true }),
  ]);

  return {
    doctor: doctor,
    contacts: contacts || [],
    addresses: addresses || [],
    schedule: schedule || [],
    education: education || [],
  };
}

export async function getDoctorContacts() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("doctor_contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data || [];
}

export async function getContent() {
  const supabase = await checkAdmin();

  const { data: banners, error: bannersError } = await supabase
    .from("banners")
    .select("*")
    .order("created_at", { ascending: false });

  if (bannersError) throw new Error(bannersError.message);

  const { data: problems, error: problemsError } = await supabase
    .from("problems")
    .select("*")
    .order("order_num", { ascending: true, nullsFirst: true });

  if (problemsError) throw new Error(problemsError.message);

  const { data: stages, error: stagesError } = await supabase
    .from("treatment_stages")
    .select("*")
    .order("order_num", { ascending: true, nullsFirst: true });

  if (stagesError) throw new Error(stagesError.message);

  return {
    banners: banners ?? [],
    problems: problems ?? [],
    stages: stages ?? [],
  };
}

export async function getPosts() {
  const supabase = await checkAdmin();

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (postsError) throw new Error(postsError.message);

  return {
    posts: posts ?? [],
  };
}

export async function getPostSections(post_id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("post_sections")
    .select("*")
    .eq("post_id", post_id)
    .order("order_num", { ascending: true });

  return data || [];
}

export async function getPostBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      sections:post_sections(*)
    `,
    )
    .eq("slug", slug)
    .single();

  if (error) return null;

  return {
    post: {
      ...data,
      sections: data.sections ?? [],
    },
  };
}
