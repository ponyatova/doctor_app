import { HeroWithBanners } from "@/components/lending/HeroWithBanners";
import { OfferSection } from "@/components/lending/OfferSection";
import { ProblemsSection } from "@/components/lending/ProblemsSection";
import { EvidenceSection } from "@/components/lending/EvidenceSection";
import { ReviewsSection } from "@/components/lending/ReviewsSection";
import { ClinicLocations } from "@/components/lending/ClinicLocations";
import { BlogPreview } from "@/components/lending/BlogPreview";
import { DrivenSection } from "@/components/lending/DrivenSection";

import {
  getBanners,
  getDoctorById,
  getProblems,
  getReviews,
  getTreatmentStages,
} from "@/lib/db";

import { ContactForm } from "@/components/ContactForm";

import { EducationSection } from "@/components/lending/EducationSection";

import { getServices } from "@/lib/actions";
import { Services } from "@/components/lending/Services";

export async function generateMetadata() {
  const doctor = await getDoctorById(1).catch(() => null);

  return {
    title: doctor ? `${doctor.name}` : "Клиника — лечение и диагностика",

    description: doctor
      ? `Приём у ${doctor.name}. Запись онлайн.`
      : "Онлайн консультации. Диагностика и лечение.",
  };
}

export const revalidate = 30;

export default async function HomePage() {
  // Загружаем все данные параллельно
  const [banners, doctor, problems, reviews, treatmentStages, services] =
    await Promise.all([
      getBanners().catch(() => []),
      getDoctorById(1).catch(() => null),
      getProblems().catch(() => []),
      getReviews().catch(() => []),
      getTreatmentStages().catch(() => []),
      getServices().catch(() => []),
    ]);

  return (
    <main className="relative min-h-screen pt-[80px]">
      <HeroWithBanners banners={banners} />
      {doctor && <OfferSection doctor={doctor} reviewsCount={reviews.length} />}
      <ProblemsSection problems={problems} />

      {treatmentStages.length > 0 && (
        <DrivenSection
          title="Ваш путь к выздоровлению"
          stages={treatmentStages.map((stage) => ({
            threshold: Number(stage.threshold),
            title: stage.title,
            description: stage.description,
            color: stage.color_gradient,
          }))}
        />
      )}

      {doctor && (
        <EvidenceSection doctor={doctor} reviewsCount={reviews.length} />
      )}
      {services.length > 0 && <Services services={services} />}
      {doctor?.education && <EducationSection education={doctor?.education} />}
      <ReviewsSection reviews={reviews} />
      {doctor && <ContactForm problem={problems} doctor={doctor} />}
      {doctor?.addresses && <ClinicLocations locations={doctor?.addresses} />}
      <BlogPreview />
    </main>
  );
}
