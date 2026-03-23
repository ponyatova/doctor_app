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
        entity={content}
        tabs={[
          {
            key: "admin",
            label: "Вернуться к админке",
            component: ({ entity }) => null,
          },
          {
            key: "banners",
            label: "Баннеры",
            component: ({ entity }) => <BannerTab banners={entity.banners} />,
          },
          {
            key: "problems",
            label: "Проблемы",
            component: ({ entity }) => (
              <ProblemTab problems={entity.problems} />
            ),
          },
          {
            key: "stages",
            label: "Этапы",
            component: ({ entity }) => <StagesTab stages={entity.stages} />,
          },
        ]}
      />
    </div>
  );
}
