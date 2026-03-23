import { RevealSection } from "./RevealSection";
import { LuChevronRight } from "react-icons/lu";
import Link from "next/link";

export function BlogPreview() {
  return (
    <RevealSection animation="scale">
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Полезные статьи
            </h2>
            <p className="text-gray-600">
              Читайте мой блог о неврологии и здоровье
            </p>
          </div>
          <div className="text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Перейти в блог
              <LuChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </RevealSection>
  );
}