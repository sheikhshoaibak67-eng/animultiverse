import React, { useState } from "react";
import { Star, Film } from "lucide-react";

export type PosterItem = {
  slug: string;
  title: string;
  poster: string;
  year: number;
  rating: number;
  type: string;
};

export default function PosterCard({
  item,
  onSelect,
  className = "",
}: {
  item: PosterItem;
  onSelect?: (slug: string) => void;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => onSelect && onSelect(item.slug)}
      title={item.title}
      className={`group block shrink-0 cursor-pointer ${className}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-900 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-white/25 group-hover:shadow-[0_16px_48px_-16px_rgba(0,0,0,0.8)]">
        {!imgError && item.poster ? (
          <img
            src={item.poster}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-zinc-800 to-zinc-950">
            <Film className="h-8 w-8 text-zinc-600 mb-2" />
            <span className="line-clamp-2 text-xs font-bold text-zinc-300">
              {item.title}
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="mt-2.5 px-0.5">
        <h3 className="truncate text-[13px] font-semibold text-zinc-100 transition-colors group-hover:text-white">
          {item.title}
        </h3>
        <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-400">
          {item.rating > 0 && (
            <>
              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-zinc-200">{item.rating.toFixed(1)}</span>
              <span className="text-zinc-600">·</span>
            </>
          )}
          {item.year > 0 && (
            <>
              <span>{item.year}</span>
              <span className="text-zinc-600">·</span>
            </>
          )}
          <span>{item.type}</span>
        </p>
      </div>
    </div>
  );
}
