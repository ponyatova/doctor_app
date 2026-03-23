import { getDoctorContacts } from "@/lib/actions";
import { DoctorContact } from "@/lib/types";
import PrivacyPageClient from "./PrivacyPageClient";

export default async function PrivacyPage() {
  const contacts: DoctorContact[] = await getDoctorContacts();

  return <PrivacyPageClient contacts={contacts} />;
}
