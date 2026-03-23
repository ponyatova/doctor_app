import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PostSection as PostSectionType } from "@/lib/types";

type PostSectionProps = {
  section: PostSectionType;
};

export function PostSection({ section }: PostSectionProps) {
  return (
    <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden bg-white">
      {section.image && (
        <div className="relative h-64 md:h-80 w-full overflow-hidden">
          <Image
            src={section.image}
            alt={section.title}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl font-light text-slate-800">
          {section.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 leading-relaxed">
            {section.text}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}