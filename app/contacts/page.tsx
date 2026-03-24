import { ContactForm } from "@/components/ContactForm";
import { ClinicLocations } from "@/components/lending/ClinicLocations";
import { getDoctorById, getProblems } from "@/lib/db";
import { LuPhone, LuMail } from "react-icons/lu";
import { RevealSection } from "@/components/lending/RevealSection";

export default async function ContactsPage() {
  const [doctor, problems] = await Promise.all([
    getDoctorById(1).catch(() => null),
    getProblems().catch(() => []),
  ]);

  const phoneContact = doctor?.contacts?.find((c) => c.type === "phone");
  const emailContact = doctor?.contacts?.find((c) => c.type === "email");

  return (
    <main className="relative min-h-screen pt-[80px]">
      {/* Красивый заголовок секции */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-10">
        <div className="container mx-auto px-4">
          <RevealSection animation="fade-up">
            <div className="text-center max-w-3xl mx-auto">
              {/* Заголовок */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-800 mb-6">
                Свяжитесь со мной
              </h1>

              {/* Подзаголовок */}
              <p className="text-lg md:text-xl text-slate-500 mb-8 leading-relaxed">
                Запишитесь на приём или задайте интересующий вопрос. Я отвечу в
                ближайшее время.
              </p>

              {/* Быстрые контакты */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                {phoneContact && (
                  <a
                    href={`tel:${phoneContact.value}`}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                      <LuPhone size={18} />
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-slate-400">Позвонить</div>
                      <div className="text-sm font-medium text-slate-700">
                        {phoneContact.value}
                      </div>
                    </div>
                  </a>
                )}

                {emailContact && (
                  <a
                    href={`mailto:${emailContact.value}`}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group"
                  >
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                      <LuMail size={18} />
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-slate-400">Написать</div>
                      <div className="text-sm font-medium text-slate-700">
                        {emailContact.value}
                      </div>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Форма записи */}
      {doctor && <ContactForm problem={problems} doctor={doctor} />}

      {/* Карта с адресами */}
      {doctor?.addresses && doctor.addresses.length > 0 && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <ClinicLocations locations={doctor.addresses} />
          </div>
        </section>
      )}

      {/* Дополнительная информация (опционально) */}
    </main>
  );
}
