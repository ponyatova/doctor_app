import { AdminForm } from "@/components/admin/AdminForm";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminHidden } from "@/components/admin/AdminHidden";
import { AdminSelect } from "@/components/admin/AdminSelect";

import {
  addDoctorSchedule,
  deleteDoctorSchedule,
  upsertDoctorSchedules,
} from "./action";
import { DoctorSchedule } from "@/lib/types";

const days = [
  { value: "1", label: "Понедельник" },
  { value: "2", label: "Вторник" },
  { value: "3", label: "Среда" },
  { value: "4", label: "Четверг" },
  { value: "5", label: "Пятница" },
  { value: "6", label: "Суббота" },
  { value: "7", label: "Воскресенье" },
];

export default function DoctorScheduleTab({
  schedule,
}: {
  schedule: DoctorSchedule[];
}) {
  return (
    <div className="overflow-x-hidden flex flex-col gap-2">
      {/* ADD */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 min-w-0">
          Добавить расписание
        </div>

        <AdminForm action={addDoctorSchedule}>
          <div className="border p-4 rounded space-y-2 w-full min-w-0">
            <AdminSelect
              name="day_of_week"
              label="День недели"
              options={days}
              defaultValue="1"
            />

            <AdminInput name="start_time" type="time" />

            <AdminInput name="end_time" type="time" />
          </div>
        </AdminForm>
      </div>

      {/* LIST */}
      {schedule.map((s, i) => (
        <AdminForm action={upsertDoctorSchedules} key={s.id}>
          <div className="border p-4 rounded space-y-2 w-full min-w-0">
            <AdminHidden name={`schedule[${i}][id]`} value={s.id} />

            <AdminSelect
              name={`schedule[${i}][day_of_week]`}
              label="День недели"
              options={days}
              defaultValue={String(s.day_of_week)}
            />

            <AdminInput
              name={`schedule[${i}][start_time]`}
              defaultValue={s.start_time || ""}
              type="time"
            />

            <AdminInput
              name={`schedule[${i}][end_time]`}
              defaultValue={s.end_time || ""}
              type="time"
            />

            <AdminDeleteButton action={deleteDoctorSchedule} id={s.id} />
          </div>
        </AdminForm>
      ))}
    </div>
  );
}
