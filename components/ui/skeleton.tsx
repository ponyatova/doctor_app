import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-gradient-to-r from-sky-100 via-cyan-50 to-sky-100 bg-[length:200%_100%]",
        className,
      )}
    />
  );
}
