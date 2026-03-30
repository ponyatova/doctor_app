"use server";

import { getContent } from "@/lib/actions";

import Tabs from "@/components/admin/DoctorTabs";
import BannerTab from "./BannerTab";
import ProblemTab from "./ProblemTab";
import StagesTab from "./StagesTab";
type Props = {
  searchParams?: { tab?: string };
};

export default async function ContentPage({ searchParams }: Props) {
  const serarchParamsTab = await searchParams;
  const tab = serarchParamsTab?.tab || "banners";
  const content = await getContent();

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
            key: "banners",
            label: "Баннеры",
            component: () => <BannerTab banners={content.banners} />,
          },
          {
            key: "problems",
            label: "Проблемы",
            component: () => <ProblemTab problems={content.problems} />,
          },
          {
            key: "stages",
            label: "Этапы",
            component: () => <StagesTab stages={content.stages} />,
          },
        ]}
      />
    </div>
  );
}
