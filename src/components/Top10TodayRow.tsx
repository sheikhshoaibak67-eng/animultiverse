import React from "react";
import { Star, Play, Flame, Trophy } from "lucide-react";
import type { PosterItem } from "./PosterCard";

export default function Top10TodayRow({
  items,
  onSelect,
}: {
  items: PosterItem[];
  onSelect: (slug: string) => void;
}) {
  const top10 = items.slice(0, 10);

  return (
    <div className="relative py-2">
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {top10.map((item, index) => {
          const rank = index + 1;
          return (
            <div
              key={item.slug}
              onClick={() => onSelect(item.slug)}
              className="group relative flex w-[170px] sm:w-[200px] shrink-0 cursor-pointer items-end transition-transform duration-300 hover:-translate-y-1.5 select-none"
            >
              {/* Massive 3D-styled Rank Number (AniMovie / Netflix Style) */}
              <div className="pointer-events-none relative -mr-6 -mb-3 z-0">
                <span
                  className="font-black italic text-transparent select-none leading-none tracking-tighter"
                  style={{
                    fontSize: "7.5rem",
                    WebkitTextStroke: "2.5px rgba(255, 255, 255, 0.4)",
                    textShadow: "0 10px 30px rgba(0,0,0,0.9)",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.05) 75%)",
                    WebkitBackgroundClip: "text",
                  }}
                >
                  {rank}
                </span>
              </div>

              {/* Poster Card */}
              <div className="relative z-10 w-[125px] sm:w-[145px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-xl transition-all duration-300 group-hover:border-brand/60 group-hover:shadow-[0_12px_36px_-8px_rgba(235,52,52,0.45)]">
                <div className="relative aspect-[2/3] w-full overflow-hidden">
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

                  {/* Gradient Overlay & Hover Play Button */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />

                  {/* Top Badge: Rank */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-brand px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-md">
                    <Trophy className="h-2.5 w-2.5" />
                    <span>#{rank}</span>
                  </div>

                  {/* Hover Center Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-transform group-hover:scale-110">
                      <Play className="h-4 w-4 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Rating / Meta at bottom of poster */}
                  <div className="absolute bottom-1.5 inset-x-2 flex items-center justify-between text-[10px] text-zinc-300">
                    <span className="flex items-center gap-1 font-bold text-amber-300">
                      <Star className="h-2.5 w-2.5 fill-amber-300 text-amber-300" />
                      {item.rating.toFixed(1)}
                    </span>
                    <span className="rounded bg-black/60 px-1 py-0.5 text-[9px] font-semibold text-zinc-400 backdrop-blur-sm">
                      {item.type}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div className="p-2 bg-zinc-950/90">
                  <h4 className="truncate text-xs font-bold text-white group-hover:text-brand-soft transition-colors">
                    {item.title}
                  </h4>
                  <p className="mt-0.5 flex items-center justify-between text-[10px] text-zinc-500">
                    <span>{item.year}</span>
                    <span className="text-[9px] font-semibold text-zinc-400">SUB • DUB</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
