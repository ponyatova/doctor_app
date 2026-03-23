import { Service } from "@/lib/types";
import { RevealSection } from "./RevealSection";
import { LuTag, LuClock, LuFileText } from "react-icons/lu";

interface ServicesProps {
  services: Service[];
}

export function Services({ services }: ServicesProps) {
  if (!services || services.length === 0) return null;

  return (
    <RevealSection animation="fade-up">
      <section className="py-20 bg-gradient-to-b from-indigo-50 via-white to-slate-50">
        <div className="container mx-auto px-4">
          {/* Заголовок */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-slate-800 mb-4">
              Услуги и цены
            </h2>
            <p className="text-lg text-slate-500">
              Профессиональные медицинские услуги с прозрачным прайсом
            </p>
          </div>

          {/* Сетка */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div className="group perspective h-full " key={service.id}>
                <div
                  className="
    h-full flex flex-col
    relative bg-white rounded-2xl p-6 border border-indigo-50
    shadow-sm transition-all duration-300
    transform-gpu
    group-hover:scale-[1.03]
    group-hover:shadow-2xl
  "
                >
                  <div className="flex-1">
                    {/* Верх */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-600">
                        <LuFileText className="w-5 h-5" />
                      </div>

                      <div className="flex items-center gap-1 text-indigo-600 font-semibold text-lg">
                        <LuTag className="w-4 h-4" />
                        {service.price} ₽
                      </div>
                    </div>

                    {/* Заголовок */}
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      {service.title}
                    </h3>

                    {/* Описание */}
                    {service.description && (
                      <p className="text-sm text-slate-500">
                        {service.description}
                      </p>
                    )}
                  </div>

                  {/* Нижняя часть */}
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <LuClock className="w-4 h-4 text-indigo-400" />
                      <span>{service.duration_minutes} мин</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </RevealSection>
  );
}
