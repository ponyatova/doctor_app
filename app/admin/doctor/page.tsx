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
      <Tabs<DoctorFull>
        entity={doctor}
        tab={tab}
        tabs={[
          {
            key: "admin",
            label: "Вернуться к админке",
            component: ({ entity }) => null,
          },
          {
            key: "main",
            label: "Основное",
            component: ({ entity }) => (
              <DoctorMainForm doctor={entity.doctor} />
            ),
          },
          {
            key: "contacts",
            label: "Контакты",
            component: ({ entity }) => (
              <DoctorContacts contacts={entity.contacts} />
            ),
          },
          {
            key: "addresses",
            label: "Адреса",
            component: ({ entity }) => (
              <DoctorAddresses addresses={entity.addresses} />
            ),
          },
          {
            key: "schedule",
            label: "Расписание",
            component: ({ entity }) => (
              <DoctorScheduleTab schedule={entity.schedule} />
            ),
          },
          {
            key: "education",
            label: "Образование",
            component: ({ entity }) => (
              <DoctorEducationTab education={entity.education} />
            ),
          },
        ]}
      />
    </div>
  );
}
