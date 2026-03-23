import { Database } from "@/supabase/database.types";

export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
export type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];

export type PostSection = Database["public"]["Tables"]["post_sections"]["Row"];
export type PostSectionInsert =
  Database["public"]["Tables"]["post_sections"]["Insert"];
export type PostSectionUpdate =
  Database["public"]["Tables"]["post_sections"]["Update"];

export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

export type Banner = Database["public"]["Tables"]["banners"]["Row"];
export type BannerInsert = Database["public"]["Tables"]["banners"]["Insert"];
export type BannerUpdate = Database["public"]["Tables"]["banners"]["Update"];

export type Doctor = Database["public"]["Tables"]["doctors"]["Row"];
export type DoctorInsert = Database["public"]["Tables"]["doctors"]["Insert"];
export type DoctorUpdate = Database["public"]["Tables"]["doctors"]["Update"];

export type Problem = Database["public"]["Tables"]["problems"]["Row"];
export type ProblemInsert = Database["public"]["Tables"]["problems"]["Insert"];
export type ProblemUpdate = Database["public"]["Tables"]["problems"]["Update"];

export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];
export type ReviewUpdate = Database["public"]["Tables"]["reviews"]["Update"];

export type TreatmentStage =
  Database["public"]["Tables"]["treatment_stages"]["Row"];
export type TreatmentStageInsert =
  Database["public"]["Tables"]["treatment_stages"]["Insert"];
export type TreatmentStageUpdate =
  Database["public"]["Tables"]["treatment_stages"]["Update"];

export type DoctorContact =
  Database["public"]["Tables"]["doctor_contacts"]["Row"];
export type DoctorContactInsert =
  Database["public"]["Tables"]["doctor_contacts"]["Insert"];
export type DoctorContactUpdate =
  Database["public"]["Tables"]["doctor_contacts"]["Update"];

export type DoctorAddress =
  Database["public"]["Tables"]["doctor_addresses"]["Row"];
export type DoctorAddressInsert =
  Database["public"]["Tables"]["doctor_addresses"]["Insert"];
export type DoctorAddressUpdate =
  Database["public"]["Tables"]["doctor_addresses"]["Update"];

export type DoctorEducation =
  Database["public"]["Tables"]["doctor_education"]["Row"];
export type DoctorEducationInsert =
  Database["public"]["Tables"]["doctor_education"]["Insert"];
export type DoctorEducationUpdate =
  Database["public"]["Tables"]["doctor_education"]["Update"];

export type DoctorSchedule =
  Database["public"]["Tables"]["doctor_schedule"]["Row"];
export type DoctorScheduleInsert =
  Database["public"]["Tables"]["doctor_schedule"]["Insert"];
export type DoctorScheduleUpdate =
  Database["public"]["Tables"]["doctor_schedule"]["Update"];

export type Service = Database["public"]["Tables"]["services"]["Row"];
export type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];
export type ServiceUpdate = Database["public"]["Tables"]["services"]["Update"];
// Расширенный тип доктора со всеми связанными данными (для отображения на сайте)
export interface DoctorWithRelations extends Doctor {
  contacts?: DoctorContact[];
  addresses?: DoctorAddress[];
  education?: DoctorEducation[];
  schedule?: DoctorSchedule[];
}

// Составной тип для главной страницы
export interface HomePageData {
  banners: Banner[];
  doctors: Doctor[];
  problems: Problem[];
  reviews: Review[];
  treatmentStages: TreatmentStage[];
}

// Тип для шагов лечения (из компонента)
export interface TreatmentStep {
  step: string;
  title: string;
  desc: string;
}

// Тип для пропсов компонентов
export interface HeroWithBannersProps {
  banners: Banner[];
}

export interface ScrollDrivenSectionProps {
  title: string;
  stages: Array<{
    threshold: number;
    title: string;
    description: string;
    color: string;
  }>;
}

export interface ParallaxStorySectionProps {
  title: string;
  backgroundGradient: string;
}

export interface RevealSectionProps {
  children: React.ReactNode;
  animation?:
    | "fade-up"
    | "fade-down"
    | "fade-left"
    | "fade-right"
    | "scale"
    | "blur"
    | "slide-left"
    | "slide-right";
  delay?: number;
  className?: string;
}

// Тип для баннера с текущим индексом (для клиентского компонента)
export interface BannerWithIndex {
  currentBanner: number;
  setCurrentBanner: (index: number) => void;
}

export type UserRow = {
  id: string;
  role: "admin" | "user";
  email: string;
};

export type DoctorFull = {
  doctor: Doctor;
  contacts: DoctorContact[];
  addresses: DoctorAddress[];
  education: DoctorEducation[];
  schedule: DoctorSchedule[];
};

export type DoctorContactType = "phone" | "email" | "max" | "website";

export type TabConfig<T> = {
  key: string;
  label: string;
  component: (props: { entity: T }) => React.ReactNode;
};
