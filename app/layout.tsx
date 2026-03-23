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

        <script
          dangerouslySetInnerHTML={{
            __html: `
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
      })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=106364517', 'ym');

      window.__METRIKA_CONSENT = localStorage.getItem('cookie-consent') === 'true';
      if (!window.__METRIKA_CONSENT) {
        window.ym = function(){};
      } else {
        ym(106364517, 'init', {
          ssr:true, webvisor:true, clickmap:true,
          ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true
        });
      }
    `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${inter.className} h-full antialiased font-sans`}
      >
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/106364517"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
        <div
          className="fixed inset-0 z-[-2] bg-no-repeat"
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundColor: "#f4fbff",
          }}
        />

        <div className="fixed inset-0 z-[-1] bg-white/85" />

        <div className="relative z-0 min-h-screen">
          <ErrorBoundary>
            <Header doctor={doctor} />
            {children} <Footer doctor={doctor} />
          </ErrorBoundary>
          <CookieConsent />
        </div>
      </body>
    </html>
  );
}
