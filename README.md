# doctorQ — Врач-невролог (Next.js)

Клонированный проект на Next.js (App Router). Сайт для приёма пациентов и блога, с формой записи, отправкой уведомлений в Telegram и отправкой писем через SMTP.

Ключевые моменты

- Next.js 16 (App Router)
- React 19, TailwindCSS
- Supabase для хранилища/контента (части кода используют Supabase clients)
- Отправка уведомлений: Telegram (бот) и Email (nodemailer, SMTP)

Быстрый старт

1. Установить зависимости

```bash
npm install
```

2. Создать файл окружения `.env.local` (пример ниже) и заполнить значения.

3. Запустить дев-сервер

```bash
npm run dev
```

Основные скрипты

- `npm run dev` — запуск в режиме разработки
- `npm run build` — билд
- `npm run start` — запуск production
- `npm run type-check` — TypeScript check

Важные файлы и папки

- `app/` — Next.js App Router (страницы, layout, API)
  - `app/layout.tsx` — глобальные метаданные, JSON-LD
  - `app/blog/[slug]/page.tsx` — блог, динамические metadata
  - `app/api/contact/route.ts` — серверный роут для отправки писем (nodemailer)
- `components/` — React компоненты (форма контакта, футер и т.д.)
- `lib/` — вспомогательные функции, supabase клиенты

Необходимые переменные окружения

Приведён список переменных, используемых в проекте — добавьте их в `.env.local`.

- `NEXT_PUBLIC_APP_URL` — базовый URL сайта (https://example.com)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key

Email / SMTP (для `app/api/contact/route.ts`)

- `SMTP_HOST` — SMTP хост (например, smtp.gmail.com)
- `SMTP_PORT` — порт (обычно 587)
- `SMTP_SECURE` — `true` или `false` (использовать TLS)
- `SMTP_USER` — логин SMTP
- `SMTP_PASS` — пароль / app password
- `SMTP_FROM` — опционально, адрес отправителя

Пример `.env.local` (не коммитить в VCS):

```
NEXT_PUBLIC_APP_URL=https://example.com
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
NEXT_PUBLIC_TELEGRAM_BOT_ID=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
NEXT_PUBLIC_TELEGRAM_CHAT_ID=987654321

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=you@example.com
SMTP_PASS=your-smtp-password
SMTP_FROM="Site Name <you@example.com>"
CONTACT_EMAIL_TO=owner@example.com
```

Форма контакта

- Компонент: `components/ContactForm.tsx` — отправляет данные в `POST /api/contact` и дополнительно вызывает `sendAppointmentMessage` (Telegram).
- Поля отправляются в JSON; есть флаг `online` (boolean).

Open Graph / Social preview

- Глобальные метаданные в `app/layout.tsx` (OG и Twitter card).
- Для постов `app/blog/[slug]/page.tsx` используется `android-chrome-192x192.png` как превью (абсолютный URL).

Где менять текст/контент

- Контент постов/страниц подтягивается через Supabase (`lib/actions.ts`, `lib/db.ts`). Чтобы изменить контент — используйте Supabase project, либо редактируйте данные через админку (если настроена).

Контакты

- Разработчик: https://www.mirniydev.ru
