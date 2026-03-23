"use client";

import { AdminForm } from "@/components/admin/AdminForm";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminHidden } from "@/components/admin/AdminHidden";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { Problem } from "@/lib/types";
import { addProblem, deleteProblem, upsertProblems } from "./action";

export default function ProblemTab({ problems }: { problems: Problem[] }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2">Добавить проблему</div>

        <AdminForm action={addProblem}>
          <div className="border p-4 rounded space-y-2">
            <AdminInput name="title" placeholder="Название" />
            <AdminInput name="order_num" placeholder="Порядок" />
          </div>
        </AdminForm>
      </div>

      {problems.map((p, i) => (
        <AdminForm action={upsertProblems} key={p.id}>
          <div className="border p-4 rounded space-y-2">
            <AdminHidden name={`problems[${i}][id]`} value={p.id.toString()} />

            <AdminInput name={`problems[${i}][title]`} defaultValue={p.title} />

            <AdminInput
              name={`problems[${i}][order_num]`}
              defaultValue={p.order_num ?? ""}
            />

            <AdminDeleteButton action={deleteProblem} id={p.id.toString()} />
          </div>
        </AdminForm>
      ))}
    </div>
  );
}
