import { AdminForm } from "@/components/admin/AdminForm";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminHidden } from "@/components/admin/AdminHidden";
import { AdminSelect } from "@/components/admin/AdminSelect";

import {
  addDoctorEducation,
  deleteDoctorEducation,
  upsertDoctorEducation,
} from "./action";

import type { DoctorEducation } from "@/lib/types";

const types = [
  { value: "diploma", label: "Диплом" },
  { value: "certificate", label: "Сертификат" },
  { value: "course", label: "Курс" },
  { value: "conference", label: "Конференция" },
  { value: "residency", label: "Ординатура" },
  { value: "internship", label: "Интернатура" },
];

export default function DoctorEducationTab({
  education,
}: {
  education: DoctorEducation[];
}) {
  return (
    <div className="overflow-x-hidden">
      {/* ADD */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 min-w-0">
          Добавить образование
        </div>

        <AdminForm action={addDoctorEducation}>
          <div className="border p-4 rounded space-y-2 w-full min-w-0">
            <AdminInput name="title" placeholder="Название" />

            <AdminInput name="year" placeholder="Год" />

            <AdminSelect
              name="type"
              label="Тип"
              options={types}
              defaultValue="university"
            />

            <AdminInput name="order_num" type="number" placeholder="Порядок" />
          </div>
        </AdminForm>
      </div>

      {/* LIST */}
      {education.map((e, i) => (
        <AdminForm action={upsertDoctorEducation} key={e.id}>
          <div className="border p-4 rounded space-y-2 w-full min-w-0">
            <AdminHidden name={`education[${i}][id]`} value={e.id} />

            <AdminInput
              name={`education[${i}][title]`}
              defaultValue={e.title}
              placeholder="Название"
            />

            <AdminInput
              name={`education[${i}][year]`}
              defaultValue={e.year}
              placeholder="Год"
            />

            <AdminSelect
              name={`education[${i}][type]`}
              options={types}
              defaultValue={e.type || ""}
            />

            <AdminInput
              name={`education[${i}][order_num]`}
              defaultValue={e.order_num ?? ""}
              type="number"
              placeholder="Порядок"
            />

            <AdminDeleteButton action={deleteDoctorEducation} id={e.id} />
          </div>
        </AdminForm>
      ))}
    </div>
  );
}
