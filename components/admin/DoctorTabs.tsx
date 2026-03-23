import { TabConfig } from "@/lib/types";
import Link from "next/link";

export default function Tabs<T>({
  entity,
  tabs,
  tab,
}: {
  entity: T;
  tabs: TabConfig<T>[];
  tab?: string;
}) {
  const activeTab = tabs.find((t) => t.key === tab);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex gap-4 border-b mb-6 overflow-x-auto whitespace-nowrap">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.key === "admin" ? "/admin" : `?tab=${t.key}`}
            className={`pb-2 text-sm border-b-2 whitespace-nowrap ${
              tab === t.key
                ? "border-black text-black"
                : "border-transparent text-slate-500"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {activeTab && activeTab.component({ entity })}
    </div>
  );
}
