import { DoctorEducation } from "@/lib/types";
import { RevealSection } from "./RevealSection";
import { LuGraduationCap, LuCalendar, LuAward, LuBookOpen, LuFileText } from "react-icons/lu";

interface EducationSectionProps {
    education: DoctorEducation[];
}

export function EducationSection({ education }: EducationSectionProps) {
    if (!education || education.length === 0) return null;

    // Сортируем по году (от новых к старым)
    const sortedEducation = [...education].sort((a, b) =>
        parseInt(b.year) - parseInt(a.year)
    );

    // Группируем по типу
    const groupedByType = sortedEducation.reduce((acc, item) => {
        const type = item.type || 'other';
        if (!acc[type]) acc[type] = [];
        acc[type].push(item);
        return acc;
    }, {} as Record<string, DoctorEducation[]>);

    // Иконки для разных типов образования
    const typeIcons = {
        diploma: <LuGraduationCap className="w-5 h-5" />,
        certificate: <LuAward className="w-5 h-5" />,
        course: <LuBookOpen className="w-5 h-5" />,
        conference: <LuFileText className="w-5 h-5" />,
        residency: <LuGraduationCap className="w-5 h-5" />,
        internship: <LuBookOpen className="w-5 h-5" />,
    };

    // Русские названия для типов
    const typeNames = {
        diploma: 'Дипломы',
        certificate: 'Сертификаты',
        course: 'Курсы повышения',
        conference: 'Конференции',
        residency: 'Ординатура',
        internship: 'Стажировки',
        other: 'Другое',
    };

    return (
        <RevealSection animation="fade-up">
            <section className="py-20 bg-gradient-to-b from-white to-slate-50">
                <div className="container mx-auto px-4">
                    {/* Заголовок */}
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-light text-slate-800 mb-4">
                            Образование и повышение квалификации
                        </h2>
                        <p className="text-lg text-slate-500">
                            Постоянное развитие и обучение — основа моей работы
                        </p>
                    </div>



                    {/* Вариант 2: Карточки по группам */}
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(groupedByType).map(([type, items]) => (
                                <div key={type} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center text-blue-600">
                                            {typeIcons[type as keyof typeof typeIcons] || <LuFileText className="w-5 h-5" />}
                                        </div>
                                        <h3 className="text-lg font-medium text-slate-800">
                                            {typeNames[type as keyof typeof typeNames] || type}
                                        </h3>
                                        <span className="ml-auto text-sm text-slate-400">
                                            {items.length}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex items-start gap-2 text-sm">
                                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2" />
                                                <div>
                                                    <span className="text-slate-700">{item.title}</span>
                                                    <span className="text-slate-400 text-xs ml-2">
                                                        {item.year}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Вариант 3: Компактный список */}

                </div>
            </section>
        </RevealSection>
    );
}