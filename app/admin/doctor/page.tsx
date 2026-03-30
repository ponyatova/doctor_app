"use server";

import { getDoctorFull } from "@/lib/actions";
import { DoctorFull } from "@/lib/types";
import Tabs from "@/components/admin/DoctorTabs";
import DoctorMainForm from "./DoctorMainForm";
import DoctorContacts from "./DoctorContacts";
import DoctorAddresses from "./DoctorAddresses";
import DoctorScheduleTab from "./DoctorSchedule";
import DoctorEducationTab from "./DoctorEducation";

type Props = {
  searchParams?: { tab?: string };
};

export default async function DoctorPage({ searchParams }: Props) {
  const doctor: DoctorFull = await getDoctorFull();
  const serarchParamsTab = await searchParams;
  const tab = serarchParamsTab?.tab || "main";

  return (
    <div className="mt-[70px]">
      <Tabs
        tab={tab}
        tabs={[
          {
            key: "admin",
            label: "Вернуться к админке",
            component: () => null,
          },
          {
            key: "main",
            label: "Основное",
            component: () => <DoctorMainForm doctor={doctor.doctor} />,
          },
          {
            key: "contacts",
            label: "Контакты",
            component: () => <DoctorContacts contacts={doctor.contacts} />,
          },
          {
            key: "addresses",
            label: "Адреса",
            component: () => <DoctorAddresses addresses={doctor.addresses} />,
          },
          {
            key: "schedule",
            label: "Расписание",
            component: () => <DoctorScheduleTab schedule={doctor.schedule} />,
          },
          {
            key: "education",
            label: "Образование",
            component: () => (
              <DoctorEducationTab education={doctor.education} />
            ),
          },
        ]}
      />
    </div>
  );
}
