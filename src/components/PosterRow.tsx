import React, { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PosterRow({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: "smooth" });
  };

  return (
    <div className="group/row relative">
      <div
        ref={ref}
        className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth px-4 pb-4 sm:px-8 md:px-12 lg:px-16 xl:px-20"
      >
        {children}
      </div>
      <button
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        className="absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/80 text-zinc-300 opacity-0 backdrop-blur-md transition-all hover:bg-white hover:text-black group-hover/row:opacity-100 md:grid"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        className="absolute right-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/80 text-zinc-300 opacity-0 backdrop-blur-md transition-all hover:bg-white hover:text-black group-hover/row:opacity-100 md:grid"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
