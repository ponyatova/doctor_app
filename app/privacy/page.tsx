import PrivacyPageClient from "./PrivacyPageClient";

export default async function PrivacyPage() {
  const url = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
  return <PrivacyPageClient url={url} email={email} />;
}
