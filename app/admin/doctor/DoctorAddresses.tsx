import { AdminForm } from "@/components/admin/AdminForm";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminHidden } from "@/components/admin/AdminHidden";

import { DoctorAddress } from "@/lib/types";
import {
  addDoctorAddress,
  deleteDoctorAddress,
  upsertDoctorAddresses,
} from "./action";

export default function DoctorAddresses({
  addresses,
}: {
  addresses: DoctorAddress[];
}) {
  return (
    <div className="overflow-x-hidden flex flex-col gap-2">
      {/* ADD */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 min-w-0">
          Добавить новый адрес
        </div>

        <AdminForm action={addDoctorAddress}>
          <div className="border p-4 rounded space-y-2 w-full min-w-0">
            <AdminInput name="address" placeholder="Адрес" />

            <AdminInput name="clinic" placeholder="Клиника" />

            <AdminInput name="map_link" placeholder="Ссылка на карту" />
          </div>
        </AdminForm>
      </div>

      {/* LIST */}
      {addresses.map((a, i) => (
        <AdminForm action={upsertDoctorAddresses} key={a.id}>
          <div className="border p-4 rounded space-y-2 w-full min-w-0">
            <AdminHidden name={`addresses[${i}][id]`} value={a.id} />

            <AdminInput
              name={`addresses[${i}][address]`}
              defaultValue={a.address}
              placeholder="Адрес"
            />

            <AdminInput
              name={`addresses[${i}][clinic]`}
              defaultValue={a.clinic}
              placeholder="Клиника"
            />

            <AdminInput
              name={`addresses[${i}][map_link]`}
              defaultValue={a.map_link || ""}
              placeholder="Ссылка на карту"
            />

            <AdminDeleteButton action={deleteDoctorAddress} id={a.id} />
          </div>
        </AdminForm>
      ))}
    </div>
  );
}
