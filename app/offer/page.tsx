import ClientPageOffer from "./ClientPageOffer";

export default async function OfferPage() {
 
  const url = "https://dr-aponyatova.vercel.app"
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
  return <ClientPageOffer url={url} email={email} />;
}
