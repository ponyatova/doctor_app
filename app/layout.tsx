import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { getDoctorById } from "@/lib/db";
import { CookieConsent } from "@/components/CookieConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const defaultJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  name: "Врач невролог в Самаре",
  description: "Диагностика и лечение неврологических заболеваний",
  url: process.env.NEXT_PUBLIC_APP_URL,
  telephone: "+79374591633",
  medicalSpecialty: "Neurologic",
};

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    metadataBase: new URL(baseUrl),

    title: {
      default: "Врач невролог — лечение и диагностика",
      template: "%s | Врач невролог",
    },

    description:
      "Диагностика и лечение неврологических заболеваний: мигрени, боли в спине, нарушения сна.",

    openGraph: {
      type: "website",
      url: baseUrl,
      siteName: "Врач невролог",
      title: "Врач невролог — лечение и диагностика",
      description: "Диагностика и лечение неврологических заболеваний.",
      images: [
        {
          url: `${baseUrl}/android-chrome-192x192.png`,
          width: 192,
          height: 192,
          alt: "Врач невролог",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Врач невролог — лечение и диагностика",
      description:
        "Диагностика и лечение неврологических заболеваний: мигрени, боли в спине, нарушения сна.",
      images: [`${baseUrl}/android-chrome-192x192.png`],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const doctor = await getDoctorById(1).catch(() => null);

  return (
    <html lang="ru">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(defaultJsonLd),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${inter.className} h-full antialiased font-sans`}
      >
        <div className="fixed inset-0 z-[-1] bg-white/85" />

        <div className="relative z-0 min-h-screen">
          <ErrorBoundary>
            <Header doctor={doctor} />
            {children} <Footer doctor={doctor} />
          </ErrorBoundary>
        </div>
      </body>
    </html>
  );
}
