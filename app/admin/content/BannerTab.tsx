"use client";

import { AdminForm } from "@/components/admin/AdminForm";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminHidden } from "@/components/admin/AdminHidden";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { Banner } from "@/lib/types";
import Image from "next/image";
import { createBanner, deleteBanner, updateBanner } from "./action";

export default function BannerTab({ banners }: { banners: Banner[] }) {
  return (
    <div className="space-y-6">
      <div className="border p-4 rounded space-y-2">
        <div className="font-semibold">Добавить баннер</div>

        <AdminForm action={createBanner}>
          <AdminInput name="title" defaultValue="Заголовок" />
          <AdminInput name="subtitle" defaultValue="Подзаголовок" />
          <AdminInput name="file" type="file" />
        </AdminForm>
      </div>
      {banners.map((b) => (
        <AdminForm key={b.id} action={updateBanner}>
          <div className="border p-4 rounded space-y-2">
            <AdminHidden name="id" value={b.id.toString()} />

            <AdminInput name="title" defaultValue={b.title} />

            <AdminInput name="subtitle" defaultValue={b.subtitle} />

            <AdminInput name="file" type="file" />

            <Image
              src={b.image_url}
              alt={b.title}
              width={400}
              height={200}
              className="object-cover rounded"
            />

            <AdminDeleteButton action={deleteBanner} id={b.id.toString()} />
          </div>
        </AdminForm>
      ))}
    </div>
  );
}
