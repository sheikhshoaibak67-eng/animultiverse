import React, { useEffect, useState } from "react";
import { Check, ChevronDown, ListVideo } from "lucide-react";
import type { EpisodeItem, SeasonItem } from "../lib/types";
import { readWatched } from "../lib/progress";
import { cn, formatDuration } from "../lib/utils";

export default function EpisodeNav({
  slug,
  cover,
  title,
  current,
  currentSeason,
  seasons,
  episodes,
  onSelectEpisode,
  onSelectSeason,
}: {
  slug: string;
  cover: string;
  title: string;
  current: number;
  currentSeason: number;
  seasons: SeasonItem[];
  episodes: EpisodeItem[];
  onSelectEpisode: (season: number, ep: number) => void;
  onSelectSeason: (season: number) => void;
}) {
  const [watched, setWatched] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setWatched(readWatched());
    sync();
    window.addEventListener("aniverse:watched-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("aniverse:watched-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <aside className="glass h-fit overflow-hidden rounded-2xl xl:sticky xl:top-24">
      <div className="flex items-center justify-between gap-3 border-b border-white/5 px-5 py-4">
        <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-white">
          <ListVideo className="h-4 w-4 text-brand-soft" />
          Episodes
        </h3>
        <span className="font-mono text-[11px] text-zinc-500">
          {episodes.length} total
        </span>
      </div>

      {seasons.length > 1 && (
        <div className="relative border-b border-white/5 px-4 py-3">
          <select
            value={currentSeason}
            onChange={(e) => onSelectSeason(Number(e.target.value))}
            aria-label="Select season"
            className="w-full cursor-pointer appearance-none rounded-lg border border-white/10 bg-white/5 py-2 pl-3 pr-8 text-xs sm:text-sm font-semibold text-white outline-none hover:border-white/25 [&>option]:bg-zinc-900"
          >
            {seasons.map((s) => (
              <option key={s.number} value={s.number}>
                {s.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-7 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        </div>
      )}

      <div className="max-h-[520px] overflow-y-auto p-2">
        {episodes.map((e) => {
          const isCurrent = e.number === current && e.season === currentSeason;
          const isWatched = watched.includes(`${slug}:s${e.season}:e${e.number}`);

          return (
            <div
              key={`${e.season}-${e.number}`}
              onClick={() => onSelectEpisode(e.season, e.number)}
              className={cn(
                "group mb-1 flex cursor-pointer items-center gap-3 rounded-xl border p-2 transition-colors",
                isCurrent
                  ? "border-brand/40 bg-brand/10"
                  : "border-transparent hover:bg-white/5"
              )}
            >
              <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
                <img
                  src={e.thumb || cover}
                  alt=""
                  className={cn(
                    "h-full w-full object-cover transition-all",
                    !isCurrent && "saturate-[0.6] group-hover:saturate-100"
                  )}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = cover;
                  }}
                />
                <span className="absolute bottom-1 left-1 rounded bg-black/75 px-1 py-0.5 font-mono text-[9px] font-bold text-white">
                  E{e.number}
                </span>
                {isCurrent && (
                  <span className="absolute right-1 top-1 h-2 w-2 animate-pulse rounded-full bg-brand" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "truncate text-xs sm:text-sm font-medium",
                    isCurrent ? "text-brand-soft font-bold" : "text-zinc-300 group-hover:text-white"
                  )}
                >
                  {e.title}
                </p>
                <p className="mt-0.5 text-[11px] text-zinc-500">
                  Episode {e.number} • {formatDuration(e.duration)}
                </p>
              </div>

              {isWatched && !isCurrent && (
                <Check className="h-4 w-4 shrink-0 text-emerald-400" aria-label="Watched" />
              )}
              {isCurrent && (
                <span className="shrink-0 rounded-md bg-brand/20 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-brand-soft">
                  Now
                </span>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
