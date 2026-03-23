import Link from "next/link";
import { LuMapPin, LuPhone, LuMail, LuClock, LuGlobe } from "react-icons/lu";
import type { DoctorWithRelations } from "@/lib/types";

interface FooterProps {
  doctor: DoctorWithRelations | null;
}

export function Footer({ doctor }: FooterProps) {
  // Получаем телефон из контактов или из основного поля doctor
  const phoneContact =
    doctor?.contacts?.find((c) => c.type === "phone") ||
    (doctor?.phone ? { type: "phone", value: doctor.phone } : null);

  const emailContact = doctor?.contacts?.find((c) => c.type === "email");

  // Форматируем телефон для ссылки
  const formatPhoneLink = (phone: string) => {
    return phone.replace(/[^0-9+]/g, "");
  };

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Навигация */}
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider text-white/60 mb-4">
              Навигация
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Главная
                </Link>
              </li>

              <li>
                <Link
                  href="/blog"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Блог
                </Link>
              </li>
              <li>
                <Link
                  href="/contacts"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider text-white/60 mb-4">
              Контакты
            </h3>
            <ul className="space-y-4 text-sm">
              {/* Телефон */}
              {phoneContact && (
                <li className="flex items-start gap-3">
                  <LuPhone className="w-5 h-5 text-white/40 flex-shrink-0 mt-0.5" />
                  <a
                    href={`tel:${formatPhoneLink(phoneContact.value)}`}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {phoneContact.value}
                  </a>
                </li>
              )}

              {/* Email */}
              {emailContact && (
                <li className="flex items-start gap-3">
                  <LuMail className="w-5 h-5 text-white/40 flex-shrink-0 mt-0.5" />
                  <a
                    href={`mailto:${emailContact.value}`}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {emailContact.value}
                  </a>
                </li>
              )}

              {/* Адрес */}
              {doctor?.addresses && doctor?.addresses[0] && (
                <li className="flex items-start gap-3">
                  <LuMapPin className="w-5 h-5 text-white/40 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white/70">
                      {doctor?.addresses[0].clinic}
                    </div>
                    <div className="text-xs text-white/40 mt-1">
                      {doctor?.addresses[0].address}
                    </div>
                    {doctor?.addresses[0].map_link && (
                      <a
                        href={doctor?.addresses[0].map_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 inline-block mt-2"
                      >
                        Открыть на карте
                      </a>
                    )}
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Нижняя часть с копирайтом */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/40">
              © {new Date().getFullYear()}{" "}
              {doctor?.name || "Понятова Ангелина Александровна"}. Все права
              защищены.
            </p>
            <div className="flex gap-6 text-xs">
              <Link
                href="/privacy"
                className="text-white/30 hover:text-white/50 transition-colors"
              >
                Политика конфиденциальности
              </Link>
              <Link
                href="https://www.mirniydev.ru"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-30 hover:text-purple-20 transition-colors flex items-center gap-2"
              >
                <LuGlobe className="w-4 h-4 text-purple-40" />
                <span>Разработка — MirniyDev</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
