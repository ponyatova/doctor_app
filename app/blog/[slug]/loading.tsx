import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPostPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-16 pt-10">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-[280px]" />
        <Skeleton className="h-[220px]" />
        <Skeleton className="h-[220px]" />
      </div>
    </main>
  );
}
