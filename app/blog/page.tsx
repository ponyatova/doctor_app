import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPosts } from "@/lib/db";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Статьи и рекомендации невролога",
    alternates: {
      canonical: "/posts",
    },
  };
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="mx-auto max-w-6xl px-5 pb-20 pt-[80px]">
      <header className="mb-7">
        <h1 className="m-0 text-[clamp(2rem,4vw,2.7rem)] text-sky-950">
          Полезные материалы по неврологии
        </h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          Практические рекомендации, обзор современных подходов и ответы на
          частые вопросы пациентов.
        </p>
      </header>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} prefetch={false}>
            <Card className="h-full overflow-hidden">
              <Image
                src={post.banner_image}
                alt={post.title}
                width={900}
                height={520}
                loading="lazy"
                className="block h-[220px] w-full object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <CardHeader className="pb-2">
                <CardTitle className="leading-6">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-500">
                  {post.created_at &&
                    new Date(post.created_at).toLocaleDateString("ru-RU")}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  );
}
