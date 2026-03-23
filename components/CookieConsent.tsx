"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cookie-consent");
    if (saved === "true") {
      setConsentGiven(true);
    } else {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");

    if ((window as any).__METRIKA_CONSENT === false) {
      delete (window as any).__METRIKA_CONSENT;
      (window as any).ym(106364517, "init", {
        ssr: true,
        webvisor: true,
        clickmap: true,
        ecommerce: "dataLayer",
        accurateTrackBounce: true,
        trackLinks: true,
      });
    }

    setConsentGiven(true);
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "false");
    setConsentGiven(false);
    setIsVisible(false);
  };

  if (!isVisible || consentGiven) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row gap-4 md:gap-6 items-center">
        <div className="flex-1 text-slate-100 text-sm sm:text-base leading-relaxed max-w-prose">
          <p>
            Мы используем сервис{" "}
            <strong className="text-slate-200">Яндекс.Метрика</strong> для
            улучшения работы сайта. Это включает cookies и сбор анонимной
            статистики о посещениях.
          </p>
          <p className="mt-2">
            Подробнее в{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline font-medium transition-colors"
            >
              Политике конфиденциальности
            </a>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={declineCookies}
            className="px-6 py-3 bg-slate-700/40 hover:bg-slate-600/50 border border-slate-600 text-slate-200 text-sm font-medium rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] flex-1 sm:flex-none"
          >
            Отклонить
          </button>

          <button
            onClick={acceptCookies}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] flex-1 sm:flex-none"
          >
            Принять cookies
          </button>
        </div>
      </div>
    </motion.div>
  );
}
