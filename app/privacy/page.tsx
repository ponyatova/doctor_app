import PrivacyPageClient from "./PrivacyPageClient";

export default async function PrivacyPage() {
  const url = "https://dr-aponyatova.vercel.app";
  const email = "Angelina163163@yandex.ru";
  return <PrivacyPageClient url={url} email={email} />;
}
