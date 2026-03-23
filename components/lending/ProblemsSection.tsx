import { RevealSection } from "./RevealSection";
import type { Problem } from "@/lib/types";

interface ProblemsSectionProps {
  problems: Problem[];
}

export function ProblemsSection({ problems }: ProblemsSectionProps) {
  if (problems.length === 0) return null;

  // Цвета для карточек
  const colors = [
    'from-blue-50 to-indigo-50 border-blue-200',
    'from-emerald-50 to-teal-50 border-emerald-200',
    'from-amber-50 to-orange-50 border-amber-200',
    'from-rose-50 to-pink-50 border-rose-200',
    'from-purple-50 to-violet-50 border-purple-200',
    'from-cyan-50 to-sky-50 border-cyan-200',
  ];

  return (
    <RevealSection animation="slide-right">
      <section className="bg-white">
        <div className="container mx-auto px-4">
          {/* Заголовок */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-slate-800 mb-4">
              С какими проблемами я работаю
            </h2>
            <p className="text-slate-500">
              Современные методы диагностики и лечения для каждого пациента
            </p>
          </div>

          {/* Сетка с карточками */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {problems.map((problem, index) => (
              <div
                key={problem.id}
                className="group relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Карточка */}
                <div className={`
                  relative p-6 rounded-2xl border bg-gradient-to-br ${colors[index % colors.length]}
                  hover:shadow-lg hover:-translate-y-1 transition-all duration-300
                `}>
                  {/* Контент */}
                  <div className="relative z-10">
                    {/* Заголовок */}
                    <h3 className="text-lg font-medium text-slate-800 mb-2 group-hover:text-slate-900">
                      {problem.title}
                    </h3>

                    {/* Дополнительная информация */}
                    <p className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors">
                      Индивидуальный план лечения
                    </p>
                  </div>

                  {/* Декоративный элемент */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>

          {/* Призыв к действию */}
          <div className="text-center mt-12">
            <p className="text-slate-400 text-sm">
              Не нашли свою проблему? • Каждый случай уникален — свяжитесь для консультации
            </p>
          </div>
        </div>
      </section>
    </RevealSection>
  );
}