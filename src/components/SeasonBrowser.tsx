import React, { useState, useEffect, useMemo } from "react";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Check, Ghost, Play, Search, X } from "lucide-react";
import type { SeasonItem, EpisodeItem } from "../lib/types";
import { readProgressMap, readWatched } from "../lib/progress";
import { cn, formatDuration } from "../lib/utils";

export default function SeasonBrowser({
  slug,
  cover,
  seasons,
  episodes,
  onPlayEpisode,
}: {
  slug: string;
  cover: string;
  seasons: SeasonItem[];
  episodes: EpisodeItem[];
  onPlayEpisode: (season: number, ep: number) => void;
}) {
  const [activeSeason, setActiveSeason] = useState(seasons[0]?.number ?? 1);
  const [query, setQuery] = useState("");
  const [reversed, setReversed] = useState(false);
  const [watched, setWatched] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const sync = () => {
      setWatched(readWatched());
      const map = readProgressMap();
      const p: Record<string, number> = {};
      for (const [k, e] of Object.entries(map)) {
        if (e.slug === slug && e.d > 0) p[k] = Math.min(1, e.t / e.d);
      }
      setProgress(p);
    };
    sync();
    window.addEventListener("aniverse:watched-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("aniverse:watched-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, [slug]);

  const currentSeason = seasons.find((s) => s.number === activeSeason) ?? seasons[0];

  const visibleEpisodes = useMemo(() => {
    let list = episodes.filter((e) => e.season === activeSeason);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.overview.toLowerCase().includes(q) ||
          `episode ${e.number}`.includes(q) ||
          `ep ${e.number}` === q
      );
    }
    return reversed ? [...list].reverse() : list;
  }, [episodes, activeSeason, query, reversed]);

  return (
    <>
      {/* Seasons strip */}
      {seasons.length > 0 && (
        <section className="scroll-mt-20 border-b border-white/5 bg-zinc-900/10 px-4 py-8 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="section-rule-brand font-display text-lg font-bold text-white sm:text-xl">
              Seasons
            </h3>
            <span className="text-xs font-semibold text-zinc-500">
              {seasons.length} {seasons.length === 1 ? "Season" : "Seasons"}
            </span>
          </div>

          <div className="no-scrollbar flex gap-4 overflow-x-auto pb-3">
            {seasons.map((s) => {
              const isActive = s.number === activeSeason;
              return (
                <button
                  key={s.number}
                  onClick={() => {
                    setActiveSeason(s.number);
                    setQuery("");
                  }}
                  className={cn(
                    "group relative flex w-[135px] shrink-0 cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border text-left transition-all duration-300 sm:w-[155px] md:w-[175px]",
                    isActive
                      ? "scale-[1.02] border-white ring-2 ring-white/30 bg-zinc-900/90 shadow-xl"
                      : "border-white/10 bg-[var(--color-panel)] hover:border-white/25"
                  )}
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
                    <img
                      src={s.poster || cover}
                      alt={s.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = cover;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    <span className="absolute right-2 top-2 rounded-md bg-black/80 backdrop-blur-sm border border-white/10 px-2 py-0.5 text-[9px] font-extrabold text-zinc-300">
                      {s.episodeCount} Eps
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug drop-shadow-md sm:text-sm">
                        {s.name}
                      </h4>
                      {s.year > 0 && (
                        <p className="mt-0.5 text-[10px] font-semibold text-zinc-500">
                          {s.year}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Episodes Grid */}
      <section className="scroll-mt-20 border-b border-white/5 bg-zinc-950/25 px-4 py-8 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="section-rule-brand font-display text-lg font-bold text-white sm:text-xl">
              {currentSeason?.name ?? "Episodes"}
            </h3>
            <span className="ml-3 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-zinc-300">
              {episodes.filter((e) => e.season === activeSeason).length} Eps
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setReversed((v) => !v)}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:border-white/25 hover:text-white"
            >
              {reversed ? <ArrowUpNarrowWide className="h-3.5 w-3.5" /> : <ArrowDownWideNarrow className="h-3.5 w-3.5" />}
              {reversed ? "Newest" : "Oldest"}
            </button>

            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search episodes..."
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-8 text-xs text-white placeholder-zinc-500 outline-none transition-colors focus:border-brand/50"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-500 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {visibleEpisodes.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {visibleEpisodes.map((e) => {
              const key = `${slug}:s${e.season}:e${e.number}`;
              const pct = progress[key];
              const isWatched = watched.includes(key);

              return (
                <div
                  key={`${e.season}-${e.number}`}
                  onClick={() => onPlayEpisode(e.season, e.number)}
                  className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-[var(--color-panel)] transition-all duration-300 hover:scale-[1.02] hover:border-brand/40 hover:shadow-lg"
                >
                  <div className="relative">
                    <img
                      src={e.thumb || cover}
                      alt={`Episode ${e.number} - ${e.title}`}
                      className="aspect-video w-full object-cover saturate-[0.8] transition duration-500 group-hover:scale-105 group-hover:saturate-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = cover;
                      }}
                    />
                    <span className="absolute bottom-2.5 right-2.5 rounded bg-black/90 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white">
                      EP {e.number}
                    </span>
                    {isWatched && (
                      <span className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/90 shadow-lg">
                        <Check className="h-3 w-3 text-black" strokeWidth={3.5} />
                      </span>
                    )}
                    {pct !== undefined && pct > 0.02 && !isWatched && (
                      <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
                        <span
                          className="block h-full bg-brand"
                          style={{ width: `${Math.round(pct * 100)}%` }}
                        />
                      </span>
                    )}
                  </div>
                  <div className="flex flex-grow items-start justify-between gap-3 p-3.5">
                    <div className="min-w-0 flex-1">
                      <h4 className="line-clamp-1 text-xs font-bold text-white transition group-hover:text-brand-soft sm:text-sm">
                        {e.title}
                      </h4>
                      {e.overview && (
                        <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-zinc-400">
                          {e.overview}
                        </p>
                      )}
                      <div className="mt-2.5 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-zinc-600">
                          {formatDuration(e.duration)}
                        </p>
                        <div className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100">
                          <Play className="h-3 w-3 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-zinc-500">
            <Ghost className="h-8 w-8" />
            <p className="text-xs font-bold uppercase tracking-widest">
              No episodes match "{query}"
            </p>
          </div>
        )}
      </section>
    </>
  );
}
