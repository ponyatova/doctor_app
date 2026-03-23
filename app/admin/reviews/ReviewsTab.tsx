"use client";

import { AdminForm } from "@/components/admin/AdminForm";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminHidden } from "@/components/admin/AdminHidden";
import { Review } from "@/lib/types";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { createReviews, deleteReview, updateReviews } from "./action";

export default function ReviewsTab({ reviews }: { reviews: Review[] }) {
  return (
    <div className="overflow-x-hidden flex flex-col gap-6">
      {/* ADD */}
      <div className="mb-6">
        <div className="mb-4">Добавить отзыв</div>

        <AdminForm action={createReviews}>
          <div className="border p-4 rounded space-y-2">
            <AdminInput name="name" placeholder="Название" />

            <AdminInput name="text" placeholder="Текст отзыва" />

            <AdminInput name="rating" type="number" placeholder="Рейтинг" />

            <label className="flex items-center gap-2">
              <input type="checkbox" name="is_active" defaultChecked={false} />
              Активен
            </label>
          </div>
        </AdminForm>
      </div>

      {/* LIST */}
      {reviews.map((s, i) => (
        <AdminForm action={updateReviews} key={s.id}>
          <div className="border p-4 rounded space-y-2 w-full min-w-0">
            <AdminHidden name={`reviews[${i}][id]`} value={s.id.toString()} />

            <AdminInput name={`reviews[${i}][name]`} defaultValue={s.name} />

            <AdminInput
              name={`reviews[${i}][text]`}
              defaultValue={s.text || ""}
            />

            <AdminInput
              name={`reviews[${i}][rating]`}
              type="number"
              defaultValue={String(s.rating)}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name={`reviews[${i}][is_active]`}
                defaultChecked={s.is_active || false}
              />
              Активен
            </label>

            <AdminDeleteButton action={deleteReview} id={s.id.toString()} />
          </div>
        </AdminForm>
      ))}
    </div>
  );
}
