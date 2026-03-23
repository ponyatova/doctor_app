import { AdminForm } from "@/components/admin/AdminForm";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminSelect } from "@/components/admin/AdminSelect";

import { DoctorContact } from "@/lib/types";
import {
  addDoctorContact,
  deleteDoctorContact,
  upsertDoctorContacts,
} from "./action";
import { AdminHidden } from "@/components/admin/AdminHidden";

export default function DoctorContacts({
  contacts,
}: {
  contacts: DoctorContact[];
}) {
  return (
    <div className="overflow-x-hidden flex flex-col gap-2">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          Добавить новый контакт
        </div>
        <AdminForm action={addDoctorContact}>
          <div className="border p-4 rounded space-y-2">
            <AdminSelect
              name="type"
              defaultValue="email"
              label="Тип контакта"
              options={[
                { value: "phone", label: "Телефон" },
                { value: "email", label: "Email" },
                { value: "website", label: "Сайт" },
                { value: "max", label: "Max" },
              ]}
            />

            <AdminInput name="value" defaultValue="" />

            <AdminInput name="label" defaultValue="" />
          </div>
        </AdminForm>
      </div>
      {contacts.map((c, i) => (
        <AdminForm action={upsertDoctorContacts} key={c.id}>
          <div className="border p-4 rounded space-y-2">
            <AdminHidden name={`contacts[${i}][id]`} value={c.id} />

            <AdminSelect
              name={`contacts[${i}][type]`}
              defaultValue={c.type}
              label="Тип контакта"
              options={[
                { value: "phone", label: "Телефон" },
                { value: "email", label: "Email" },
                { value: "website", label: "Сайт" },
                { value: "max", label: "Max" },
              ]}
            />

            <AdminInput name={`contacts[${i}][value]`} defaultValue={c.value} />

            <AdminInput
              name={`contacts[${i}][label]`}
              defaultValue={c.label || ""}
            />

            <AdminDeleteButton action={deleteDoctorContact} id={c.id} />
          </div>
        </AdminForm>
      ))}
    </div>
  );
}
