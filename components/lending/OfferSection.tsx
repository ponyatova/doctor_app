import { RevealSection } from "./RevealSection";
import { LuUser, LuCheck, LuStar } from "react-icons/lu";
import type { DoctorWithRelations } from "@/lib/types";

interface OfferSectionProps {
  doctor: DoctorWithRelations;
  reviewsCount: number;
}

export function OfferSection({ doctor, reviewsCount }: OfferSectionProps) {
  const items = [
    {
      icon: "User",
      title: `Опыт ${doctor.experience}`,
      desc: "Практика в ведущих клиниках",
    },
    {
      icon: "Check",
      title: "Документы проверены",
      desc: "Лицензированный специалист",
    },
    {
      icon: "Star",
      title: `${reviewsCount} отзывов`,
      desc: "Благodарные пациенты",
    },
  ];

  return (
    <RevealSection animation="slide-left">
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Квалифицированная помощь врача-невролога в Самаре
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Индивидуальный подход к каждому пациенту. Современные методы
              диагностики и лечения неврологических заболеваний.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {items.map((item, index) => (
                <RevealSection
                  key={index}
                  animation="scale"
                  delay={index * 100}
                >
                  <div className="p-6 bg-blue-50 rounded-lg hover:shadow-lg transition-shadow">
                    <div className="text-blue-600 mb-4 flex justify-center">
                      {item.icon === "User" && <LuUser size={24} />}
                      {item.icon === "Check" && <LuCheck size={24} />}
                      {item.icon === "Star" && <LuStar size={24} />}
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </div>
      </section>
    </RevealSection>
  );
}
