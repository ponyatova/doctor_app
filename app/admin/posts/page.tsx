"use server";

import { getPosts, getPostSections } from "@/lib/actions";
import Tabs from "@/components/admin/DoctorTabs";

import PostsTab from "./PostsTab";
import SectionsTab from "./SectionPostTab";

type Props = {
  searchParams?: { tab?: string; post_id?: string };
};

export default async function ContentPage({ searchParams }: Props) {
  const params = await searchParams;
  const tab = params?.tab || "posts";
  const post_id = params?.post_id;

  const posts = await getPosts();

  const sections = post_id ? await getPostSections(post_id) : [];
  // console.log("sections", sections, post_id);
  return (
    <div className="mt-[70px]">
      <Tabs
        tab={tab}
        tabs={[
          {
            key: "admin",
            label: "Вернуться к админке",
            component: () => null,
          },
          {
            key: "posts",
            label: "Посты",
            component: () => <PostsTab posts={posts.posts} />,
          },
          {
            key: "sections",
            label: "Секции",
            component: () => (
              <SectionsTab sections={sections} post_id={post_id} />
            ),
          },
        ]}
      />
    </div>
  );
}
