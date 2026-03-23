"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Banner } from "@/lib/types";

interface HeroWithBannersProps {
  banners: Banner[];
}

export function HeroWithBanners({ banners }: HeroWithBannersProps) {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  // Если нет баннеров, показываем заглушку
  if (banners.length === 0) {
    return (
      <section className="relative h-screen flex items-end justify-center overflow-hidden bg-blue-600 pb-20">
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Профессиональная помощь невролога
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Запишитесь на консультацию сегодня
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
          >
            Записаться на приём
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen flex flex-col justify-end overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.id || index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBanner ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <Image
            src={banner.image_url}
            alt={banner.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      <div className="relative z-10 container mx-auto px-4 text-center text-white pb-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
          {banners[currentBanner]?.title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-in">
          {banners[currentBanner]?.subtitle}
        </p>
        <a
          href="#contact"
          className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
        >
          Записаться на приём
        </a>
      </div>

      {/* Banner indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentBanner ? 'bg-white w-8' : 'bg-white/50'
                }`}
              aria-label={`Переключить на баннер ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}