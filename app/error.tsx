"use client";

import { useEffect } from "react";
import { IoAlertCircle } from "react-icons/io5";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4">
      {/* фон */}
      <div className="absolute w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl -top-40 -left-40 animate-[float_10s_ease-in-out_infinite]" />
      <div className="absolute w-80 h-80 bg-blue-200/30 rounded-full blur-3xl bottom-0 right-0 animate-[float_12s_ease-in-out_infinite]" />

      <div className="text-center max-w-md relative z-10">
        {/* иконка */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-indigo-300/30 rounded-full blur-2xl animate-pulse" />
          <IoAlertCircle className="w-16 h-16 text-indigo-500 mx-auto relative animate-[shake_1.2s_ease-in-out_infinite]" />
        </div>

        <h1 className="text-2xl font-semibold text-slate-800 mb-2">
          Что-то пошло не так
        </h1>

        <p className="text-slate-500 mb-6">
          {error.message || "Произошла непредвиденная ошибка"}
        </p>

        <button
          onClick={reset}
          className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-medium 
                     hover:bg-indigo-600 
                     hover:shadow-lg 
                     active:scale-95 
                     transition-all duration-300"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
