import React from "react";
import { Star } from "lucide-react";
import type { PosterItem } from "./PosterCard";

export default function TrendingMarquee({
  items,
  onSelect,
}: {
  items: PosterItem[];
  onSelect?: (slug: string) => void;
}) {
  const row = [...items, ...items];

  return (
    <div className="group/marquee relative overflow-hidden py-4">
      <div className="animate-marquee flex w-max gap-4 group-hover/marquee:[animation-play-state:paused]">
        {row.map((item, i) => (
          <div
            key={`${item.slug}-${i}`}
            onClick={() => onSelect && onSelect(item.slug)}
            className="group block w-[140px] shrink-0 cursor-pointer sm:w-[155px] md:w-[170px]"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-900 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-white/20 group-hover:shadow-[0_16px_48px_-16px_rgba(0,0,0,0.8)]">
              <img
                src={item.poster}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=60";
                }}
              />
            </div>
            <div className="mt-2 px-0.5">
              <h3 className="truncate text-[13px] font-semibold text-zinc-100">
                {item.title}
              </h3>
              <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-500">
                {item.rating > 0 && (
                  <>
                    <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-zinc-300">
                      {item.rating.toFixed(1)}
                    </span>
                    <span className="text-zinc-700">·</span>
                  </>
                )}
                <span>{item.year}</span>
                <span className="text-zinc-700">·</span>
                <span>{item.type}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#09090b] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#09090b] to-transparent" />
    </div>
  );
}
