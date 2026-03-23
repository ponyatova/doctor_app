import { AdminForm } from "@/components/admin/AdminForm";
import { AdminInput } from "@/components/admin/AdminInput";

import { Doctor } from "@/lib/types";
import { updateDoctor } from "./action";

export default function DoctorMainForm({ doctor }: { doctor: Doctor }) {
  return (
    <AdminForm action={updateDoctor}>
      <AdminInput name="name" defaultValue={doctor.name} />
      <AdminInput name="experience" defaultValue={doctor.experience} />
      <AdminInput name="phone" defaultValue={doctor.phone} />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={doctor.is_active || false}
        />
        Активен
      </label>
    </AdminForm>
  );
}
