import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostSlugs } from "@/lib/db";
import { Reveal } from "@/components/animation/Reveal";
import { LuArrowLeft, LuCalendar, LuClock } from "react-icons/lu";
import { getPostBySlug } from "@/lib/actions";
import { PostSection } from "@/components/posts/PostSection";
import Link from "next/link";

export const revalidate = 300;

type PostSectionType = {
  id: string;
  image: string | null;
  order_num: number;
  post_id: string;
  text: string;
  title: string;
};

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPostBySlug(slug);

  if (!data) {
    return {
      title: "Статья не найдена",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: data.post.title,
    description: data.post.excerpt || data.post.title,

    alternates: {
      canonical: `/posts/${data.post.slug}`,
    },

    openGraph: {
      title: data.post.title,
      description: data.post.excerpt || data.post.title,
      type: "article",
      images: [
        {
          // Use site default image for messenger previews (android-chrome-192x192.png)
          url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/android-chrome-192x192.png`,
          width: 192,
          height: 192,
          alt: data.post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.post.title,
      description: data.post.excerpt || data.post.title,
      images: [
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/android-chrome-192x192.png`,
      ],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPostBySlug(slug);

  if (!data) {
    notFound();
  }

  // Форматируем дату
  const formattedDate = data.post.created_at
    ? new Date(data.post.created_at).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen bg-white">
      <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        {/* Изображение */}
        <div className="absolute inset-0">
          <Image
            src={data.post.banner_image}
            alt={data.post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={90}
          />
        </div>

        {/* Градиентный оверлей */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Контент поверх изображения */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-16 md:pb-24">
            <div className="max-w-4xl">
              {/* Заголовок */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-6 ">
                {data.post.title}
              </h1>

              {/* Мета-информация */}
              <div className="flex flex-wrap items-center gap-4">
                {formattedDate && (
                  <div className="flex items-center gap-2 text-sm text-white/90 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                    <LuCalendar size={16} className="text-white/80" />
                    <span>{formattedDate}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-white/90 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                  <LuClock size={16} className="text-white/80" />
                  <span>
                    {Math.max(3, Math.ceil(data.post.title.length / 15))} мин
                    чтения
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Контент статьи */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Хлебные крошки */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-10 pb-6 border-b border-slate-100">
            <a href="/" className="hover:text-blue-600 transition-colors">
              Главная
            </a>
            <span>•</span>
            <a href="/blog" className="hover:text-blue-600 transition-colors">
              Блог
            </a>
            <span>•</span>
            <span className="text-slate-700 font-medium truncate max-w-[300px]">
              {data.post.title}
            </span>
          </nav>

          {/* Содержание статьи */}
          <article className="prose prose-lg prose-slate max-w-none">
            <div className="flex flex-col gap-12">
              {data.post.sections.map((section: PostSectionType) => (
                <Reveal key={section.id}>
                  <PostSection section={section} />
                </Reveal>
              ))}
            </div>
          </article>

          {/* Разделитель */}
          <div className="my-16 border-t border-slate-200" />

          {/* Навигация по статьям */}
          <div className="flex justify-between items-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-blue-600 transition-colors group bg-white rounded-xl border border-slate-200 hover:border-blue-200 shadow-sm"
            >
              <LuArrowLeft
                className="group-hover:-translate-x-1 transition-transform"
                size={18}
              />
              <span>Все статьи</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
