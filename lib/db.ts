import { cache } from "react";
import { createServerSupabaseClient } from "./supabase/server";
import type {
  User,
  Post,
  PostSection,
  Banner,
  Doctor,
  Problem,
  Review,
  TreatmentStage,
  DoctorWithRelations,
  DoctorContact,
  DoctorAddress,
  DoctorEducation,
  DoctorSchedule,
} from "./types";

export type PostWithSections = {
  post: Post;
  sections: PostSection[];
};

export const getPosts = cache(async (): Promise<Post[]> => {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      return [];
    }

    return (data as Post[]) || [];
  } catch (error) {
    console.error("Error in getPosts:", error);
    return [];
  }
});

export const getPostSlugs = cache(async (): Promise<string[]> => {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from("posts").select("slug");

    if (error) {
      console.error("Error fetching post slugs:", error);
      return [];
    }

    const rows = (data ?? []) as Array<{ slug: string }>;
    return rows.map((item) => item.slug);
  } catch (error) {
    console.error("Error in getPostSlugs:", error);
    return [];
  }
});

export const getDoctorById = cache(
  async (id: number): Promise<DoctorWithRelations | null> => {
    try {
      const supabase = await createServerSupabaseClient();

      // Получаем основную информацию о докторе
      const { data: doctorData, error: doctorError } = await supabase
        .from("doctors")
        .select("*")
        .eq("id", id)
        .single();

      if (doctorError || !doctorData) {
        console.error("Error fetching doctor by id:", doctorError);
        return null;
      }

      const doctor = doctorData as Doctor;

      // Получаем все связанные данные параллельно
      const [contactsResult, addressesResult, educationResult, scheduleResult] =
        await Promise.all([
          supabase.from("doctor_contacts").select("*").eq("doctor_id", id),
          supabase.from("doctor_addresses").select("*").eq("doctor_id", id),
          supabase
            .from("doctor_education")
            .select("*")
            .eq("doctor_id", id)
            .order("order_num", { ascending: true }),
          supabase
            .from("doctor_schedule")
            .select("*")
            .eq("doctor_id", id)
            .order("day_of_week", { ascending: true }),
        ]);

      return {
        ...doctor,
        contacts: (contactsResult.data as DoctorContact[]) || [],
        addresses: (addressesResult.data as DoctorAddress[]) || [],
        education: (educationResult.data as DoctorEducation[]) || [],
        schedule: (scheduleResult.data as DoctorSchedule[]) || [],
      };
    } catch (error) {
      console.error("Error in getDoctorById:", error);
      return null;
    }
  },
);

/**
 * Получение контактов доктора
 */
export const getDoctorContacts = cache(
  async (doctorId: number): Promise<DoctorContact[]> => {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("doctor_contacts")
        .select("*")
        .eq("doctor_id", doctorId);

      if (error) {
        console.error("Error fetching doctor contacts:", error);
        return [];
      }
      return (data as DoctorContact[]) || [];
    } catch (error) {
      console.error("Error in getDoctorContacts:", error);
      return [];
    }
  },
);

/**
 * Получение адресов доктора
 */
export const getDoctorAddresses = cache(
  async (doctorId: number): Promise<DoctorAddress[]> => {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("doctor_addresses")
        .select("*")
        .eq("doctor_id", doctorId);

      if (error) {
        console.error("Error fetching doctor addresses:", error);
        return [];
      }
      return (data as DoctorAddress[]) || [];
    } catch (error) {
      console.error("Error in getDoctorAddresses:", error);
      return [];
    }
  },
);

/**
 * Получение образования доктора
 */
export const getDoctorEducation = cache(
  async (doctorId: number): Promise<DoctorEducation[]> => {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("doctor_education")
        .select("*")
        .eq("doctor_id", doctorId)
        .order("order_num", { ascending: true });

      if (error) {
        console.error("Error fetching doctor education:", error);
        return [];
      }
      return (data as DoctorEducation[]) || [];
    } catch (error) {
      console.error("Error in getDoctorEducation:", error);
      return [];
    }
  },
);

/**
 * Получение расписания доктора
 */
export const getDoctorSchedule = cache(
  async (doctorId: number): Promise<DoctorSchedule[]> => {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("doctor_schedule")
        .select("*")
        .eq("doctor_id", doctorId)
        .order("day_of_week", { ascending: true });

      if (error) {
        console.error("Error fetching doctor schedule:", error);
        return [];
      }
      return (data as DoctorSchedule[]) || [];
    } catch (error) {
      console.error("Error in getDoctorSchedule:", error);
      return [];
    }
  },
);
/**
 * Получение всех баннеров
 */
export const getBanners = cache(async (): Promise<Banner[]> => {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching banners:", error);
      return [];
    }
    return (data as Banner[]) || [];
  } catch (error) {
    console.error("Error in getBanners:", error);
    return [];
  }
});

/**
 * Получение активных врачей
 */
export const getDoctors = cache(
  async (activeOnly: boolean = true): Promise<Doctor[]> => {
    try {
      const supabase = await createServerSupabaseClient();
      let query = supabase.from("doctors").select("*");

      if (activeOnly) {
        query = query.eq("is_active", true);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching doctors:", error);
        return [];
      }
      return (data as Doctor[]) || [];
    } catch (error) {
      console.error("Error in getDoctors:", error);
      return [];
    }
  },
);

/**
 * Получение всех проблем (с чем работаем)
 */
export const getProblems = cache(async (): Promise<Problem[]> => {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("problems")
      .select("*")
      .order("order_num", { ascending: true });

    if (error) {
      console.error("Error fetching problems:", error);
      return [];
    }
    return (data as Problem[]) || [];
  } catch (error) {
    console.error("Error in getProblems:", error);
    return [];
  }
});

/**
 * Получение активных отзывов
 */
export const getReviews = cache(
  async (activeOnly: boolean = true, limit?: number): Promise<Review[]> => {
    try {
      const supabase = await createServerSupabaseClient();
      let query = supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (activeOnly) {
        query = query.eq("is_active", true);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching reviews:", error);
        return [];
      }
      return (data as Review[]) || [];
    } catch (error) {
      console.error("Error in getReviews:", error);
      return [];
    }
  },
);
export const getReviewsAdmin = cache(async (): Promise<Review[]> => {
  try {
    const supabase = await createServerSupabaseClient();
    let query = supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
    return (data as Review[]) || [];
  } catch (error) {
    console.error("Error in getReviews:", error);
    return [];
  }
});

/**
 * Получение всех этапов лечения
 */
export const getTreatmentStages = cache(async (): Promise<TreatmentStage[]> => {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("treatment_stages")
      .select("*")
      .order("order_num", { ascending: true });

    if (error) {
      console.error("Error fetching treatment stages:", error);
      return [];
    }
    return (data as TreatmentStage[]) || [];
  } catch (error) {
    console.error("Error in getTreatmentStages:", error);
    return [];
  }
});

/**
 * Получение всех данных для главной страницы одним запросом (оптимизированная версия)
 */
export const getHomePageData = cache(async () => {
  try {
    const supabase = await createServerSupabaseClient();

    const [images, banners, doctors, problems, reviews, treatmentStages] =
      await Promise.all([
        supabase
          .from("services")
          .select("*")
          .eq("is_active", true)
          .order("order"),
        supabase.from("site_settings").select("*").single(),
        supabase.from("images").select("*").order("order"),
        supabase.from("banners").select("*").order("id"),
        supabase.from("doctors").select("*").eq("is_active", true),
        supabase.from("expertise_items").select("*").order("order_num"),
        supabase.from("problems").select("*").order("order_num"),
        supabase
          .from("reviews")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false }),
        supabase.from("treatment_stages").select("*").order("order_num"),
      ]);

    return {
      banners: banners.data || ([] as Banner[]),
      doctors: (doctors.data as Doctor[]) || [],
      problems: (problems.data as Problem[]) || [],
      reviews: (reviews.data as Review[]) || [],
      treatmentStages: (treatmentStages.data as TreatmentStage[]) || [],
    };
  } catch (error) {
    console.error("Error in getHomePageData:", error);
    return {
      banners: [],
      doctors: [],
      problems: [],
      reviews: [],
      treatmentStages: [],
    };
  }
});

// Админские функции
export async function checkAdminAccess(userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !data) return false;
  return (data as User).role === "admin";
}
