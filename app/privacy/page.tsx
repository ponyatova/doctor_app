import PrivacyPageClient from "./PrivacyPageClient";

export default async function PrivacyPage() {
  const url = "https://dr-aponyatova.vercel.app";
  const email = "ponyatova.95@mail.ru";
  return <PrivacyPageClient url={url} email={email} />;
}
