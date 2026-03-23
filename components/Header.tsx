'use client'
import { DoctorWithRelations } from '@/lib/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LuMenu, LuX, LuPhone } from 'react-icons/lu';

interface HeaderProps {
    doctor: DoctorWithRelations | null;
}

export function Header({ doctor }: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname(); // useRouter() -> usePathname() в App Router

    const isActive = (path: string) => pathname === path;

    // Форматируем телефон для ссылки
    const formatPhoneLink = (phone: string) => {
        return phone.replace(/[^0-9+]/g, '');
    };

    // Берем имя доктора или дефолтное
    const doctorName = doctor?.name || 'Д-р Понятова';

    // Берем телефон из доктора или дефолтный
    const doctorPhone = doctor?.phone || '+7 (846) 233-54-26';

    return (
        <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 h-[80px]">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Логотип с именем доктора */}
                    <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {doctorName}
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className={`transition-colors hover:text-blue-600 ${isActive('/') ? 'text-blue-600 font-medium' : 'text-gray-700'
                                }`}
                        >
                            Главная
                        </Link>

                        <Link
                            href="/blog"
                            className={`transition-colors hover:text-blue-600 ${isActive('/blog') ? 'text-blue-600 font-medium' : 'text-gray-700'
                                }`}
                        >
                            Блог
                        </Link>
                        <Link
                            href="/contacts"
                            className={`transition-colors hover:text-blue-600 ${isActive('/contacts') ? 'text-blue-600 font-medium' : 'text-gray-700'
                                }`}
                        >
                            Контакты
                        </Link>

                        {/* Кнопка записи с телефоном */}
                        <div className="flex items-center gap-3">
                            <a
                                href={`tel:${formatPhoneLink(doctorPhone)}`}
                                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
                                title="Позвонить"
                            >
                                <LuPhone className="w-5 h-5" />
                                <span className="text-sm font-medium">{doctorPhone}</span>
                            </a>
                            <a
                                href="#contact"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-sm"
                            >
                                Записаться
                            </a>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
                        aria-label="Меню"
                    >
                        {isOpen ? <LuX size={24} /> : <LuMenu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden absolute left-0 right-0 top-[80px] bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg">
                        <div className="container mx-auto px-4 py-6 space-y-4">
                            <Link
                                href="/"
                                className={`block py-3 transition-colors hover:text-blue-600 text-base ${isActive('/') ? 'text-blue-600 font-medium' : 'text-gray-700'
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                Главная
                            </Link>

                            <Link
                                href="/blog"
                                className={`block py-3 transition-colors hover:text-blue-600 text-base ${isActive('/blog') ? 'text-blue-600 font-medium' : 'text-gray-700'
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                Блог
                            </Link>
                            <Link
                                href="/contacts"
                                className={`block py-3 transition-colors hover:text-blue-600 text-base ${isActive('/contacts') ? 'text-blue-600 font-medium' : 'text-gray-700'
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                Контакты
                            </Link>

                            <div className="pt-4 space-y-3 border-t border-gray-100">
                                <a
                                    href={`tel:${formatPhoneLink(doctorPhone)}`}
                                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-50 text-blue-600 rounded-xl hover:bg-gray-100 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <LuPhone className="w-5 h-5" />
                                    <span className="font-medium">{doctorPhone}</span>
                                </a>
                                <a
                                    href="#contact"
                                    className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Записаться на приём
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}