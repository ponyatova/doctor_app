"use server";

import Tabs from "@/components/admin/DoctorTabs";
import { getServices } from "@/lib/actions";
import { Service } from "@/lib/types";
import ServicesTab from "./ServicesTab";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="mt-[70px] space-y-6">
      <Tabs<Service[]>
        entity={services}
        tab="services"
        tabs={[
          {
            key: "admin",
            label: "Вернуться к админке",
            component: ({ entity }) => null,
          },
          {
            key: "services",
            label: "Сервисы",
            component: ({ entity }) => <ServicesTab services={entity} />,
          },
        ]}
      />
    </div>
  );
}
