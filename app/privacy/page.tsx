import PrivacyPageClient from "./PrivacyPageClient";

export default async function PrivacyPage() {
  const url = "https://dr-aponyatova.vercel.app";
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
  return <PrivacyPageClient url={url} email={email} />;
}
