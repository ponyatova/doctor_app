// app/proxy.ts
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // 🔥 1. Блокируем ВСЕ служебные запросы Next.js 16
   if (
    request.headers.get("x-proxy-ignore") ||
    request.nextUrl.searchParams.has("_rsc") ||     // ← RSC запросы
    request.nextUrl.pathname.includes(".") ||
    request.headers.has("next-url") ||
    request.headers.has("x-nextjs-request-id")
  ) {
    return NextResponse.next();
  }


  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // 2. Только чтение cookies
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) { return request.cookies.get(name)?.value; },
      set: () => { },
      remove: () => { },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  // 3. Login страница
  if (request.nextUrl.pathname === "/admin/login") {
    if (user) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  // 4. Все остальные /admin/* - требуют авторизации
  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // 5. Проверка роли
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!userData?.role || userData.role !== "admin") {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // 🔥 6. ТОЧНЫЙ matcher - только пользовательские роуты
  matcher: ["/admin/:path*", "/admin"],
};
