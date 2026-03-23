import { RevealSection } from "./RevealSection";
import { LuPhone, LuCalendar, LuCheck } from "react-icons/lu";

export function BookingProcessSection() {
  return (
    <RevealSection animation="slide-left">
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Как записаться на приём
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <LuPhone size={24} />
              </div>
              <h3 className="font-semibold mb-2">Позвоните</h3>
              <p className="text-sm text-gray-600">Свяжитесь с нами по телефону</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <LuCalendar size={24} />
              </div>
              <h3 className="font-semibold mb-2">Выберите время</h3>
              <p className="text-sm text-gray-600">Подберём удобное для вас время</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <LuCheck size={24} />
              </div>
              <h3 className="font-semibold mb-2">Приходите</h3>
              <p className="text-sm text-gray-600">Ждём вас в выбранное время</p>
            </div>
          </div>
        </div>
      </section>
    </RevealSection>
  );
}