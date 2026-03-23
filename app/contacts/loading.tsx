import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-pink-50">
      <div className="text-center">
        <div className="w-48 h-48 mx-auto mb-5 relative flex items-center justify-center">
          <div className="absolute w-32 h-32 bg-pink-400 rounded-full blur-3xl opacity-30 animate-pulse" />

          <div className="relative animate-[growMorph_2.5s_ease-in-out_infinite]">
            <Image
              src="/loader.png"
              alt="Loading"
              width={200}
              height={200}
              priority
            />
          </div>
        </div>

        <p className="text-slate-400 tracking-wide animate-pulse">
          Загрузка...
        </p>
      </div>
    </div>
  );
}
