"use client";

import { DoctorContact } from "@/lib/types";
import { motion } from "framer-motion";
import Link from "next/link";
import { LuArrowBigLeft } from "react-icons/lu";
export default function PrivacyPageClient({
  contacts,
}: {
  contacts: DoctorContact[];
}) {
  return (
    <section className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-0" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <LuArrowBigLeft className="w-5 h-5" />
            На главную
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-6xl font-semibold mb-6 text-white tracking-tight">
            Политика конфиденциальности
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Понятова Ангелина Александровна, врач-невролог
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700 p-8 md:p-12 space-y-8"
        >
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                1. Общие положения
              </h2>
              <p>
                Настоящая Политика регулирует обработку данных сайта, доступного
                по адресу <strong>https://nails-avdeeva.vercel.app</strong>.
              </p>
              <p>
                Использование сайта означает согласие с условиями обработки
                персональных данных.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                2. Собираемые данные
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-base font-medium text-slate-200 mb-2">
                    Персональные данные
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Имя</li>
                    <li>Телефон</li>
                    <li>Услуга</li>
                    <li>Дата записи</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-medium text-slate-200 mb-2">
                    Технические данные
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Cookies</li>
                    <li>IP-адрес</li>
                    <li>Браузер</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                3. Цели обработки
              </h2>
              <ul className="space-y-2">
                <li>• Обработка заявок</li>
                <li>• Обратная связь</li>
                <li>• Аналитика (Яндекс.Метрика)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                4. Передача данных
              </h2>
              <p>
                Данные не передаются третьим лицам, за исключением сервисов
                аналитики и мессенджеров для обработки заявок.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                5. Хранение данных
              </h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Данные хранятся в защищённых каналах</li>
                <li>Удаляются по запросу пользователя</li>
                <li>Сайт не хранит базу данных</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                6. Контакты
              </h2>
              {contacts.map((contact, index) => (
                <div key={index} className="mb-4">
                  <h6 className="text-base font-medium text-slate-200 mb-1">
                    {contact.label}
                  </h6>
                  <p>{contact.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-12">
          <Link
            href="/contacts"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition"
          >
            Записаться на приём
          </Link>
        </div>
      </div>
    </section>
  );
}
