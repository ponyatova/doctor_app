import { NextResponse } from "next/server";
const nodemailer = require("nodemailer");
type Body = {
  name: string;
  phone: string;
  service?: string;
  date?: string;
  message?: string;
  online?: boolean;
  source?: string;
};

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();

    if (!body?.name || !body?.phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 },
      );
    }

    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      return NextResponse.json(
        { error: "SMTP settings are not configured" },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const to = process.env.CONTACT_EMAIL_TO || process.env.SMTP_USER;
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    const dateFormatted = body.date
      ? new Date(body.date).toLocaleDateString("ru-RU")
      : "Не указана";

    const subject = `Новая заявка: ${body.name} — ${body.phone}`;

    const html = `
      <h3>Новая заявка с сайта</h3>
      <p><strong>Имя:</strong> ${body.name}</p>
      <p><strong>Телефон:</strong> ${body.phone}</p>
      <p><strong>Онлайн:</strong> ${body.online ? "Да" : "Нет"}</p>
      <p><strong>Услуга:</strong> ${body.service || "Не выбрана"}</p>
      <p><strong>Дата:</strong> ${dateFormatted}</p>
      <p><strong>Комментарий:</strong></p>
      <p>${body.message ? body.message.replace(/\n/g, "<br />") : "Без комментария"}</p>
      <p style="margin-top:12px;color:#666;font-size:12px">Источник: ${body.source || "Форма записи"}</p>
    `;

    await transporter.sendMail({
      from,
      to,
      subject,
      text: `${subject}\n\nОнлайн: ${body.online ? "Да" : "Нет"}\n\n${body.message || ""}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
