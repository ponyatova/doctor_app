import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPostsPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-20 pt-12">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-[320px]" />
        ))}
      </div>
    </main>
  );
}
