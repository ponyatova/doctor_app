"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  TbSend,
  TbPhone,
  TbAlertCircle,
  TbMail,
  TbClock,
  TbVideo,
  TbExternalLink,
} from "react-icons/tb";
import { FiCheckCircle } from "react-icons/fi";
import type { DoctorWithRelations, Problem } from "@/lib/types";
import Link from "next/link";

interface ContactFormProps {
  problem: Problem[];
  doctor: DoctorWithRelations;
}

export function ContactForm({ problem, doctor }: ContactFormProps) {
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [consentAgreed, setConsentAgreed] = useState(false);
  const email = doctor.contacts?.filter((item) => item.type === "email");

  const website =
    doctor.contacts?.filter((item) => item.type === "website") || null;
  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        setResult(null);

        const data = {
          name: formData.get("name") as string,
          phone: formData.get("phone") as string,
          service: formData.get("service") as string,
          date: formData.get("date") as string,
          message: formData.get("message") as string,
          online: !!formData.get("onlineConsultation"),
          source: "Форма записи на приём",
        };

        // Отправляем на почту через серверный роут
        const resp = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error(err?.error || "Email send failed");
        }

        setResult({
          success: true,
          message:
            "Заявка отправлена! Я свяжусь с вами в ближайшее время для подтверждения записи.",
        });

        setTimeout(() => {
          setResult(null);
          const form = document.getElementById(
            "contact-form",
          ) as HTMLFormElement;
          if (form) form.reset();
          setConsentAgreed(false);
        }, 5000);
      } catch (error) {
        setResult({
          success: false,
          message:
            "Произошла ошибка. Пожалуйста, попробуйте ещё раз или позвоните мне.",
        });
        console.error("Ошибка отправки:", error);
      }
    });
  };

  const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const fullDaysOfWeek = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье",
  ];

  // Форматируем время
  const formatTime = (time: string | null) => {
    if (!time) return "Выходной";
    return time.slice(0, 5); // "09:00:00" -> "09:00"
  };

  // Группируем по дням с одинаковым расписанием для компактного отображения
  const compactSchedule = doctor.schedule?.reduce(
    (acc, day) => {
      const lastGroup = acc[acc.length - 1];

      if (
        lastGroup &&
        lastGroup.start === day.start_time &&
        lastGroup.end === day.end_time
      ) {
        lastGroup.days.push(day.day_of_week);
      } else {
        acc.push({
          days: [day.day_of_week],
          start: day.start_time,
          end: day.end_time,
        });
      }
      return acc;
    },
    [] as { days: number[]; start: string | null; end: string | null }[],
  );

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-b from-white to-slate-50"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-light text-slate-800 mb-4">
            Запись на приём
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Выберите удобный способ связи или заполните форму, и я свяжусь с
            вами для уточнения деталей
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Левая колонка - контакты */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-medium text-slate-700 mb-6">
                Контактная информация
              </h3>

              <div className="space-y-4">
                {/* Телефон */}
                <Link
                  href={`tel:${doctor.phone}`}
                  className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                    <TbPhone className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Телефон</div>
                    <div className="text-lg font-medium text-slate-800">
                      {doctor.phone}
                    </div>
                  </div>
                </Link>

                {email && email[0] && (
                  <Link
                    href={`mailto:${email[0].value}`}
                    className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                      <TbMail className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Email</div>
                      <div className="text-lg font-medium text-slate-800">
                        {email[0].value}
                      </div>
                    </div>
                  </Link>
                )}
                {website && (
                  <Link
                    href={website[0].value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                      <TbExternalLink className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-lg font-medium text-slate-800">
                        Запись на очный прием
                      </div>
                    </div>
                  </Link>
                )}
                {/* Время работы */}
                {doctor.schedule && doctor.schedule.length > 0 && (
                  <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-100">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <TbClock className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-400 mb-2">
                        Время работы
                      </div>

                      {/* Компактное отображение */}
                      <div className="space-y-1">
                        {compactSchedule &&
                          compactSchedule.map((group, idx) => {
                            const dayRange =
                              group.days.length > 1
                                ? `${daysOfWeek[group.days[0]]}-${daysOfWeek[group.days[group.days.length - 1]]}`
                                : daysOfWeek[group.days[0]];

                            return (
                              <div
                                key={idx}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-slate-500">
                                  {dayRange}
                                </span>
                                <span className="text-slate-700 font-medium">
                                  {`${formatTime(group.start)} – ${formatTime(group.end)}`}
                                </span>
                              </div>
                            );
                          })}
                      </div>

                      <details className="mt-2">
                        <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">
                          Подробное расписание
                        </summary>
                        <div className="mt-2 space-y-1">
                          {doctor.schedule
                            .sort((a, b) => a.day_of_week - b.day_of_week)
                            .map((day) => (
                              <div
                                key={day.id}
                                className="flex justify-between text-xs"
                              >
                                <span className="text-slate-400">
                                  {fullDaysOfWeek[day.day_of_week]}
                                </span>
                                <span className="text-slate-600">
                                  {`${formatTime(day.start_time)} – ${formatTime(day.end_time)}`}
                                </span>
                              </div>
                            ))}
                        </div>
                      </details>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Дополнительная информация */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <h4 className="font-medium text-slate-800 mb-3">
                Обратите внимание
              </h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                При первичном приёме просьба иметь при себе результаты
                предыдущих обследований (если есть). Это поможет более точно
                оценить ситуацию и сократить время диагностики.
              </p>
            </div>
          </motion.div>

          {/* Правая колонка - форма */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              {result?.success ? (
                <div className="flex flex-col items-center text-center py-12">
                  <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                    <FiCheckCircle className="w-10 h-10 text-emerald-500" />
                  </div>

                  <h3 className="text-2xl font-light text-slate-800 mb-3">
                    Заявка отправлена
                  </h3>

                  <p className="text-slate-500 mb-6 max-w-sm">
                    {result.message}
                  </p>

                  <div className="w-16 h-1 bg-emerald-100 rounded-full" />
                </div>
              ) : (
                <form
                  id="contact-form"
                  action={handleSubmit}
                  className="space-y-5"
                >
                  {result && !result.success && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                      <TbAlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                      <p className="text-rose-600 text-sm">{result.message}</p>
                    </div>
                  )}

                  {/* Имя */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Ваше имя <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      disabled={isPending}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all disabled:opacity-50"
                      placeholder="Например, Анна"
                    />
                  </div>

                  {/* Телефон */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Телефон <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      disabled={isPending}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all disabled:opacity-50"
                      placeholder="+7 (927) 613-65-13"
                    />
                  </div>

                  {/* Услуга */}
                  <div>
                    <label
                      htmlFor="service"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Интересует направление
                    </label>
                    <select
                      id="service"
                      name="service"
                      disabled={isPending}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all disabled:opacity-50"
                    >
                      <option value="">Выберите направление</option>
                      {problem.map((problem) => (
                        <option key={problem.id} value={problem.title}>
                          {problem.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Дата */}
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Предпочтительная дата
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      disabled={isPending}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
                    />
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <input
                      type="checkbox"
                      id="onlineConsultation"
                      name="onlineConsultation"
                      disabled={isPending}
                      className="w-4 h-4 mt-1 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-200"
                    />
                    <label
                      htmlFor="onlineConsultation"
                      className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed cursor-pointer"
                    >
                      <TbVideo className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <span>
                        <span className="font-medium">Онлайн консультация</span>
                        <span className="text-slate-400 text-xs block mt-0.5">
                          Видеосвязь через Яндекс Телемост, или Zoom
                        </span>
                      </span>
                    </label>
                  </div>

                  {/* Комментарий */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Дополнительная информация
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      disabled={isPending}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all resize-none disabled:opacity-50"
                      placeholder="Опишите кратко ваш вопрос или пожелания..."
                    />
                  </div>

                  {/* Согласие */}
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      checked={consentAgreed}
                      onChange={(e) => setConsentAgreed(e.target.checked)}
                      disabled={isPending}
                      className="w-4 h-4 mt-1 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-200"
                      required
                    />
                    <label
                      htmlFor="consent"
                      className="text-sm text-slate-500 leading-relaxed"
                    >
                      Я даю{" "}
                      <strong>согласие на обработку персональных данных</strong>{" "}
                      в соответствии с{" "}
                      <Link
                        href="/privacy"
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Политикой в отношении обработки персональных данных
                      </Link>
                      , включая сбор, хранение и использование моих данных для
                      оказания консультации и обратной связи. Я подтверждаю, что
                      ознакомлен(а) с условиями{" "}
                      <Link
                        href="/offer"
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Договора-оферты
                      </Link>
                      .
                    </label>
                  </div>

                  {/* Кнопка отправки */}
                  <button
                    type="submit"
                    disabled={isPending || !consentAgreed}
                    className="w-full px-6 py-4 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-800"
                  >
                    <TbSend className="w-5 h-5" />
                    {isPending ? "Отправка..." : "Отправить заявку"}
                  </button>

                  <p className="text-xs text-center text-slate-400">
                    Поля, отмеченные *, обязательны для заполнения
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
