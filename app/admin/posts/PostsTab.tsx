import Link from "next/link";

import { AdminForm } from "@/components/admin/AdminForm";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminHidden } from "@/components/admin/AdminHidden";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";

import { Post } from "@/lib/types";
import { createPost, deletePost, updatePosts } from "./action";
import Image from "next/image";

export default function PostsTab({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-6">
      <AdminForm action={createPost}>
        <div className="border p-4 rounded space-y-2">
          <AdminInput name="title" placeholder="title" />
          <AdminInput name="slug" placeholder="slug" />
          <AdminInput name="file" type="file" />
        </div>
      </AdminForm>

      {posts.map((p, i) => (
        <AdminForm action={updatePosts} key={p.id}>
          <div className="border p-4 rounded space-y-2">
            <AdminHidden name={`posts[${i}][id]`} value={p.id} />

            <AdminInput name={`posts[${i}][title]`} defaultValue={p.title} />

            <AdminInput name={`posts[${i}][slug]`} defaultValue={p.slug} />

            <AdminInput name={`posts[${i}][file]`} type="file" />

            <Image
              src={p.banner_image}
              alt={p.title}
              width={400}
              height={200}
              className="object-cover rounded"
            />
            <div className="flex space-x-4">
              <Link
                href={`/admin/posts?tab=sections&post_id=${p.id}`}
                className="text-blue-500"
              >
                Редактировать секции
              </Link>

              <AdminDeleteButton action={deletePost} id={p.id} />
            </div>
          </div>
        </AdminForm>
      ))}
    </div>
  );
}
