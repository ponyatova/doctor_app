'use client'

import { RevealSection } from "./RevealSection";
import { LuStar, LuChevronDown, LuChevronUp, LuExternalLink } from "react-icons/lu";
import type { Review } from "@/lib/types";
import { useState } from "react";

interface ReviewsSectionProps {
  reviews: Review[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());
  const [showAll, setShowAll] = useState(false);

  if (reviews.length === 0) return null;

  const toggleReview = (id: number) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedReviews(newExpanded);
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, 6);

  // Фильтруем отзывы с рейтингом для подсчета среднего
  const reviewsWithRating = reviews.filter(review => review.rating !== null);
  const averageRating = reviewsWithRating.length > 0
    ? reviewsWithRating.reduce((acc, review) => acc + (review.rating || 0), 0) / reviewsWithRating.length
    : 0;

  // Функция для обрезки текста
  const truncateText = (text: string, maxLength: number = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <RevealSection animation="fade-up">
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          {/* Заголовок с рейтингом */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-slate-800 mb-4">
              Отзывы пациентов
            </h2>

            {/* Общий рейтинг (показываем только если есть оценки) */}
            {reviewsWithRating.length > 0 && (
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <LuStar
                      key={i}
                      size={24}
                      className={i < Math.round(averageRating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-2xl font-light text-slate-700">
                  {averageRating.toFixed(1)}
                </span>
              </div>
            )}

            <p className="text-slate-500">
              На основе {reviews.length} отзывов
            </p>
          </div>

          {/* Сетка отзывов */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {displayedReviews.map((review) => {
              const isExpanded = expandedReviews.has(review.id);
              const displayText = isExpanded ? review.text : truncateText(review.text);
              const needsExpand = review.text && review.text.length > 150;

              return (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group"
                >
                  {/* Шапка с рейтингом и датой */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <LuStar
                          key={i}
                          size={16}
                          className={review.rating && i < review.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-200"
                          }
                        />
                      ))}
                    </div>
                    {review.created_at && (
                      <span className="text-xs text-slate-400">
                        {new Date(review.created_at).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    )}
                  </div>

                  {/* Текст отзыва */}
                  <div className="flex-1">
                    <p className="text-slate-600 mb-4 leading-relaxed">
                      {displayText || 'Нет текста отзыва'}
                    </p>

                    {/* Кнопка "Читать полностью" */}
                    {needsExpand && (
                      <button
                        onClick={() => toggleReview(review.id)}
                        className="flex items-center gap-1 text-sm text-slate-400 hover:text-blue-500 transition-colors mb-4 group"
                      >
                        {isExpanded ? (
                          <>
                            <LuChevronUp size={14} />
                            <span>Свернуть</span>
                          </>
                        ) : (
                          <>
                            <LuChevronDown size={14} />
                            <span>Читать полностью</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Информация об авторе */}
                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <p className="font-medium text-slate-800">
                      {review.name || 'Анонимно'}
                    </p>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Кнопка "Показать все" */}
          {reviews.length > 6 && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors duration-300 shadow-sm"
              >
                <span>
                  {showAll ? 'Показать меньше' : `Показать все отзывы (${reviews.length})`}
                </span>
                {showAll ? <LuChevronUp size={18} /> : <LuChevronDown size={18} />}
              </button>
            </div>
          )}

          {/* Ссылка на внешний источник (опционально) */}
          {reviews.length > 0 && (
            <div className="text-center mt-8">
              <a
                href="https://prodoctorov.ru/samara/vrach/1240037-ponyatova/otzivi/#otzivi"

                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                <LuExternalLink size={14} />
                <span>Читать отзывы на ПРОДОКТОРОВ</span>
              </a>
            </div>
          )}
        </div>
      </section>
    </RevealSection>
  );
}