"use client";

import { useEffect, useRef, useState } from "react";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

interface Stage {
  threshold: number;
  title: string;
  description: string;
  color?: string;
}

interface DrivenSectionProps {
  stages: Stage[];
  title: string;
}

export function DrivenSection({ stages, title }: DrivenSectionProps) {
  const elementRef = useRef<HTMLElement | null>(null);

  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const total = stages.length;

  const goTo = (newIndex: number) => {
    if (isAnimating) return;

    const clamped = Math.max(0, Math.min(total - 1, newIndex));

    if (clamped === index) return;

    setIsAnimating(true);
    setIndex(clamped);

    setTimeout(() => setIsAnimating(false), 400);
  };

  // свайп
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0].clientY;
      const diff = startY - endY;

      if (Math.abs(diff) < 40) return;

      if (diff > 0) {
        goTo(index + 1);
      } else {
        goTo(index - 1);
      }
    };

    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [index]);

  return (
    <section
      ref={elementRef}
      className="relative overflow-hidden select-none py-16"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">{title}</h3>

          {/* TILE */}
          <div className="relative min-h-[320px]">
            {stages.map((stage, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-500 ease-out rounded-2xl shadow-xl p-10 flex items-center ${
                  i === index
                    ? "opacity-100 scale-100 z-10"
                    : "opacity-0 scale-95 z-0"
                }`}
                style={{
                  background:
                    stage.color || "linear-gradient(135deg, #667eea, #764ba2)",
                }}
              >
                <div className="text-white max-w-xl">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    {stage.title}
                  </h3>
                  <p className="text-base md:text-lg opacity-90 leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CONTROLS */}
          <div className="flex items-center justify-between mt-8">
            {/* BACK */}
            <button
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                index === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              <LuArrowLeft className="w-4 h-4" />
              Назад
            </button>

            {/* INDICATORS */}
            <div className="flex gap-2">
              {stages.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-8 bg-blue-600" : "w-2 bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* NEXT */}
            <button
              onClick={() => goTo(index + 1)}
              disabled={index === total - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                index === total - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Вперёд
              <LuArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
