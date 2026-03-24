"use client";

import { AdminForm } from "@/components/admin/AdminForm";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminHidden } from "@/components/admin/AdminHidden";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { PostSection } from "@/lib/types";
import { createSection, deleteSection, updateSections } from "./action";
import Image from "next/image";

export default function SectionsTab({
  sections,
  post_id,
}: {
  sections: PostSection[];
  post_id?: string;
}) {
  if (!post_id) {
    return <div>Выберите пост</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2">Добавить секцию</div>

        <AdminForm action={createSection}>
          <AdminHidden name="post_id" value={post_id} />

          <div className="border p-4 rounded space-y-2">
            <AdminInput name="title" placeholder="title" />
            <AdminInput name="text" placeholder="text" />
            <AdminInput name="order" placeholder="order" />

            <AdminInput name="file" type="file" />
          </div>
        </AdminForm>
      </div>

      {sections.map((s, i) => (
        <AdminForm action={updateSections} key={s.id}>
          <div className="border p-4 rounded space-y-2">
            <AdminHidden name={`sections[${i}][id]`} value={s.id} />

            <AdminInput name={`sections[${i}][title]`} defaultValue={s.title} />

            <AdminInput name={`sections[${i}][text]`} defaultValue={s.text} />

            <AdminInput
              name={`sections[${i}][order_num]`}
              defaultValue={s.order_num}
            />

            <AdminInput name={`sections[${i}][file]`} type="file" />

            {s.image && (
              <Image
                src={s.image || "/placeholder.jpg"}
                alt={s.title}
                width={400}
                height={200}
                className="object-cover rounded"
              />
            )}

            <AdminDeleteButton action={deleteSection} id={s.id} />
          </div>
        </AdminForm>
      ))}
    </div>
  );
}
