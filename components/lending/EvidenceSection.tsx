"use client";

import { RevealSection } from "./RevealSection";
import { LuClock, LuShield, LuHeartHandshake } from "react-icons/lu";
import type { DoctorWithRelations } from "@/lib/types";
import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface EvidenceSectionProps {
  doctor: DoctorWithRelations;
  reviewsCount: number;
}

export function EvidenceSection({
  doctor,
  reviewsCount,
}: EvidenceSectionProps) {
  const { elementRef, isVisible } = useScrollReveal({ threshold: 0.2 });
  const [reviews, setReviews] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const revTarget = reviewsCount || 0;

    let start = 0;
    const duration = 1500;
    const stepTime = 20;
    const steps = Math.ceil(duration / stepTime);
    const revIncrement = revTarget / steps;

    const interval = setInterval(() => {
      start++;
      setReviews(Math.floor(Math.min(revTarget, start * revIncrement)));
      if (start >= steps) clearInterval(interval);
    }, stepTime);

    return () => clearInterval(interval);
  }, [isVisible, doctor.experience, reviewsCount]);

  const items = [
    {
      icon: <LuClock size={36} />,
      value: `${doctor.experience}`,
      label: "практики",
      color: "from-sky-50 to-indigo-50",
      borderColor: "border-sky-200",
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600",
      subtitle: "С вниманием к пациентам",
    },
    {
      icon: <LuHeartHandshake size={36} />,
      value: `${reviews}`,
      label: "положительных отзывов пациентов",
      color: "from-emerald-50 to-teal-50",
      borderColor: "border-emerald-200",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      subtitle: "Доверие и забота",
    },
    {
      icon: <LuShield size={36} />,
      value: `${doctor.education?.length || 0}+`,
      label: "курсов повышения квалификации",
      color: "from-violet-50 to-purple-50",
      borderColor: "border-violet-200",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      subtitle: "Постоянное развитие",
    },
  ];

  return (
    <section
      ref={elementRef}
      className="py-20 bg-gradient-to-b from-white to-slate-50"
    >
      <div className="container mx-auto px-4">
        <RevealSection animation="fade-up">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-4 text-slate-800">
            Опыт, которому доверяют
          </h2>
          <p className="text-lg text-center text-slate-500 max-w-2xl mx-auto mb-16">
            За годы практики сложились принципы работы, которые я соблюдаю в
            каждом приёме
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-1 gap-6 max-w-5xl mx-auto">
          {items.map((item, index) => (
            <RevealSection key={index} animation="fade-up" delay={index * 100}>
              <div
                className={`h-full bg-white rounded-2xl p-8 border ${item.borderColor} shadow-sm hover:shadow-md transition-all duration-300 group`}
              >
                <div className="flex flex-col items-center text-center h-full">
                  {/* Иконка */}
                  <div
                    className={`w-20 h-20 ${item.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300`}
                  >
                    <div className={item.iconColor}>{item.icon}</div>
                  </div>

                  {/* Число */}
                  <div className="text-5xl font-light text-slate-800 mb-2">
                    {item.value}
                  </div>

                  {/* Основной лейбл */}
                  <div className="text-xl font-medium text-slate-700 mb-3">
                    {item.label}
                  </div>

                  {/* Разделитель */}
                  <div
                    className={`w-12 h-0.5 bg-gradient-to-r ${item.color} rounded-full mb-3`}
                  />

                  {/* Подзаголовок */}
                  <div className="text-sm text-slate-400">{item.subtitle}</div>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>

        {/* Дополнительная информация */}
        <RevealSection animation="fade-up" delay={300}>
          <div className="mt-16 text-center max-w-2xl mx-auto">
            <p className="text-slate-500 text-sm leading-relaxed">
              Регулярное повышение квалификации, участие в профессиональных
              конференциях и изучение международного опыта позволяют применять
              наиболее эффективные и безопасные методы лечения.
            </p>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
