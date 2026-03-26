import { ContactForm } from "@/components/ContactForm";
import { ClinicLocations } from "@/components/lending/ClinicLocations";
import { getDoctorById, getProblems } from "@/lib/db";
import { LuPhone, LuMail } from "react-icons/lu";
import { RevealSection } from "@/components/lending/RevealSection";

export default async function ContactsPage() {
  const [doctor, problems] = await Promise.all([
    getDoctorById(1).catch(() => null),
    getProblems().catch(() => []),
  ]);
  return (
    <main className="relative min-h-screen pt-[80px]">
     
      {doctor && <ContactForm problem={problems} doctor={doctor} />}

      {/* Карта с адресами */}
      {doctor?.addresses && doctor.addresses.length > 0 && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <ClinicLocations locations={doctor.addresses} />
          </div>
        </section>
      )}
    </main>
  );
}
