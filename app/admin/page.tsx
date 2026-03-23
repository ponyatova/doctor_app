"use server";

import Link from "next/link";
import { getDashboardStats } from "@/lib/actions";
import {
  LuUsers,
  LuFileText,
  LuStar,
  LuSettings,
  LuPackage,
  LuUser,
} from "react-icons/lu";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminPage() {
  const stats = await getDashboardStats();

  const sections = [
    {
      title: "Врач",
      description: "Редактирование профиля врача (единая страница)",
      href: "/admin/doctor",
      icon: LuUsers,
      stats: [
        {
          label: "Статус",
          value: stats.activeDoctorsCount ? "Активен" : "Неактивен",
        },
      ],
    },

    {
      title: "Контент сайта",
      description:
        "Баннеры, проблемы, этапы лечения (редактируется в одном месте)",
      href: "/admin/content",
      icon: LuFileText,
      stats: [
        { label: "Баннеры", value: stats.bannersCount },
        { label: "Проблемы", value: stats.problemsCount },
        { label: "Этапы", value: stats.treatmentStagesCount },
      ],
    },

    {
      title: "Блог",
      description: "Статьи и их секции",
      href: "/admin/posts",
      icon: LuFileText,
      stats: [{ label: "Статьи", value: stats.postsCount }],
    },

    {
      title: "Отзывы",
      description: "Публикация отзывов от пациентов",
      href: "/admin/reviews",
      icon: LuStar,
      stats: [{ label: "Всего", value: stats.reviewsCount }],
    },

    {
      title: "Сервисы",
      description: "Услуги и цены",
      href: "/admin/services",
      icon: LuPackage,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8 max-w-7xl mx-auto mt-[70px]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light text-slate-800">Админ-панель</h1>

        <LogoutButton />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-5 rounded-xl border">
          <div className="text-2xl font-bold">{stats.doctorsCount}</div>
          <div className="text-sm text-slate-500">Врач</div>
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <div className="text-2xl font-bold">{stats.reviewsCount}</div>
          <div className="text-sm text-slate-500">Отзывы</div>
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <div className="text-2xl font-bold">{stats.postsCount}</div>
          <div className="text-sm text-slate-500">Статьи</div>
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <div className="text-2xl font-bold">{stats.bannersCount}</div>
          <div className="text-sm text-slate-500">Баннеры</div>
        </div>
      </div>

      {/* Секции */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="bg-white p-6 rounded-2xl border hover:shadow-md transition block"
          >
            <h2 className="text-xl font-semibold mb-2">{section.title}</h2>

            <p className="text-sm text-slate-500 mb-4">{section.description}</p>

            {/* Статы */}
            {section.stats && (
              <div className="flex gap-4">
                {section.stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-lg font-bold">{stat.value}</div>
                    <div className="text-xs text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
