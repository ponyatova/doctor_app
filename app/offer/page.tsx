import ClientPageOffer from "./ClientPageOffer";

export default async function OfferPage() {
 
  const url = process.env.NEXT_PUBLIC_BASE_URL || "";
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
  return <ClientPageOffer url={url} email={email} />;
}
