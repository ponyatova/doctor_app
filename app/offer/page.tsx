import ClientPageOffer from "./ClientPageOffer";

export default async function OfferPage() {
 
  const url = "https://dr-aponyatova.vercel.app"
  const email = "ponyatova.95@mail.ru";
  return <ClientPageOffer url={url} email={email} />;
}
