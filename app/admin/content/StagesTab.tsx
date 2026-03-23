"use client";

import { AdminForm } from "@/components/admin/AdminForm";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminHidden } from "@/components/admin/AdminHidden";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { TreatmentStage } from "@/lib/types";
import { addStage, deleteStage, upsertStages } from "./action";

export default function StagesTab({ stages }: { stages: TreatmentStage[] }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2">Добавить этап</div>

        <AdminForm action={addStage}>
          <div className="border p-4 rounded space-y-2">
            <AdminInput name="title" placeholder="Название" />
            <AdminInput name="description" placeholder="Описание" />
            <AdminInput name="color_gradient" placeholder="gradient" />
            <AdminInput name="threshold" placeholder="threshold" />
            <AdminInput name="order_num" placeholder="Порядок" />
          </div>
        </AdminForm>
      </div>

      {stages.map((s, i) => (
        <AdminForm action={upsertStages} key={s.id}>
          <div className="border p-4 rounded space-y-2">
            <AdminHidden name={`stages[${i}][id]`} value={s.id.toString()} />

            <AdminInput name={`stages[${i}][title]`} defaultValue={s.title} />

            <AdminInput
              name={`stages[${i}][description]`}
              defaultValue={s.description}
            />

            <AdminInput
              name={`stages[${i}][color_gradient]`}
              defaultValue={s.color_gradient}
            />

            <AdminInput
              name={`stages[${i}][threshold]`}
              defaultValue={s.threshold}
            />

            <AdminInput
              name={`stages[${i}][order_num]`}
              defaultValue={s.order_num ?? ""}
            />

            <AdminDeleteButton action={deleteStage} id={s.id.toString()} />
          </div>
        </AdminForm>
      ))}
    </div>
  );
}
