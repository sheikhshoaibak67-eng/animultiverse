import React, { useEffect, useState } from "react";
import { Bookmark, X } from "lucide-react";
import { isListed, LIST_EVENT, toggleListItem, type ListItem } from "../lib/progress";
import { cn } from "../lib/utils";

export type BannerItem = ListItem;

export default function BannerCard({
  item,
  onSelect,
  rank = 0,
  chips = [],
  progressPct,
  onRemove,
  showBookmark = true,
  className = "",
}: {
  item: BannerItem;
  onSelect?: (slug: string) => void;
  rank?: number;
  chips?: string[];
  progressPct?: number;
  onRemove?: () => void;
  showBookmark?: boolean;
  className?: string;
}) {
  const [listed, setListed] = useState(false);

  useEffect(() => {
    const sync = () => setListed(isListed(item.slug));
    sync();
    window.addEventListener(LIST_EVENT, sync);
    return () => window.removeEventListener(LIST_EVENT, sync);
  }, [item.slug]);

  return (
    <div
      onClick={() => onSelect && onSelect(item.slug)}
      title={item.title}
      className={cn(
        "group relative block cursor-pointer overflow-hidden rounded-xl bg-[var(--color-panel)] transition-all duration-300 hover:-translate-y-1 hover:border-white/20",
        className
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={item.cover}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = "0.3";
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

        {rank > 0 && (
          <span className="absolute left-2 top-2 z-10 rounded-lg border border-white/20 bg-black/75 px-2 py-0.5 font-display text-xs font-black text-white">
            {rank}
          </span>
        )}

        {chips.length > 0 && (
          <div className="absolute left-2 top-2 z-10 flex max-w-[70%] flex-col items-start gap-1">
            {chips.map((c) => (
              <span
                key={c}
                className="rounded-md border border-white/15 bg-black/75 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-sm"
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {showBookmark && (
          <button
            type="button"
            aria-pressed={listed}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleListItem(item);
            }}
            className="group/bm absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full transition active:scale-90"
          >
            <span
              className={cn(
                "grid h-7 w-7 place-items-center rounded-full text-[13px] transition-colors",
                listed
                  ? "bg-brand text-white shadow-md"
                  : "bg-black/50 text-white/90 group-hover/bm:bg-black/80 group-hover/bm:text-white"
              )}
            >
              <Bookmark className={cn("h-3.5 w-3.5", listed && "fill-white")} />
            </span>
          </button>
        )}

        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            className="group/rm absolute bottom-2 right-2 z-10 grid h-8 w-8 place-items-center rounded-full transition active:scale-90"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white transition-colors group-hover/rm:bg-brand">
              <X className="h-3.5 w-3.5" />
            </span>
          </button>
        )}

        <h3 className="absolute inset-x-0 bottom-0 z-10 line-clamp-2 p-3 font-display text-xs font-bold uppercase leading-snug text-white drop-shadow-md sm:text-sm">
          {item.title}
        </h3>

        {progressPct !== undefined && (
          <div className="absolute inset-x-0 bottom-0 z-20 h-1 bg-white/20" aria-hidden>
            <div
              className="h-full bg-brand"
              style={{ width: `${Math.max(3, Math.round(progressPct * 100))}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
