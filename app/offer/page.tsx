import ClientPageOffer from "./ClientPageOffer";

export default async function OfferPage() {
  const urlEnv = await process.env.NEXT_PUBLIC_BASE_URL
  const url = urlEnv || "http://localhost:3000";
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
  return <ClientPageOffer url={url} email={email} />;
}
