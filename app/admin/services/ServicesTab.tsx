import { AdminForm } from "@/components/admin/AdminForm";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminHidden } from "@/components/admin/AdminHidden";
import { Service } from "@/lib/types";
import { createService, deleteService, updateServices } from "./action";

export default function ServicesTab({ services }: { services: Service[] }) {
  return (
    <div className="overflow-x-hidden flex flex-col gap-6">
      {/* ADD */}
      <div className="mb-6">
        <div className="mb-4">Добавить услугу</div>

        <AdminForm action={createService}>
          <div className="border p-4 rounded space-y-2">
            <AdminInput name="title" placeholder="Название" />

            <AdminInput name="description" placeholder="Описание" />

            <AdminInput name="price" type="number" placeholder="Цена" />

            <AdminInput
              name="duration_minutes"
              type="number"
              placeholder="Длительность (мин)"
            />
          </div>
        </AdminForm>
      </div>

      {/* LIST */}
      {services.map((s, i) => (
        <AdminForm action={updateServices} key={s.id}>
          <div className="border p-4 rounded space-y-2 w-full min-w-0">
            <AdminHidden name={`services[${i}][id]`} value={s.id} />

            <AdminInput name={`services[${i}][title]`} defaultValue={s.title} />

            <AdminInput
              name={`services[${i}][description]`}
              defaultValue={s.description || ""}
            />

            <AdminInput
              name={`services[${i}][price]`}
              type="number"
              defaultValue={String(s.price)}
            />

            <AdminInput
              name={`services[${i}][duration_minutes]`}
              type="number"
              defaultValue={String(s.duration_minutes)}
            />

            <AdminDeleteButton action={deleteService} id={s.id} />
          </div>
        </AdminForm>
      ))}
    </div>
  );
}
