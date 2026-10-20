import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import BannerCard from "./BannerCard";
import {
  PROGRESS_KEY,
  PROGRESS_EVENT,
  readProgressMap,
  removeProgressEntry,
  type ProgressEntry,
} from "../lib/progress";
import { formatTime } from "../lib/utils";

type Entry = ProgressEntry & { key: string };

export default function ContinueWatching({
  onSelectWatch,
}: {
  onSelectWatch: (slug: string, ep: number, season: number) => void;
}) {
  const [entries, setEntries] = useState<Entry[]>([]);

  const load = () => {
    const map = readProgressMap();
    const list = Object.entries(map)
      .map(([key, e]) => ({ ...e, key }))
      .filter((e) => e.d > 0 && e.t > 15 && e.t < e.d - 25)
      .sort((a, b) => b.at - a.at)
      .slice(0, 12);
    setEntries(list);
  };

  useEffect(() => {
    load();
    window.addEventListener(PROGRESS_EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, []);

  if (entries.length === 0) return null;

  return (
    <div className="mt-6 flex w-full flex-col">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 px-4 pb-2 pt-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-white sm:text-xl">
          <span
            className="h-5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_rgba(229,48,60,0.5)]"
            aria-hidden
          />
          Continue Watching
        </h2>
        <button
          onClick={() => {
            window.localStorage.setItem(PROGRESS_KEY, JSON.stringify({}));
            setEntries([]);
          }}
          className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-zinc-400 transition-colors hover:text-white"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear
        </button>
      </div>
      <div className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth px-4 py-2 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        {entries.map((e) => {
          const pct = e.d > 0 ? e.t / e.d : 0;
          const remaining = Math.max(0, e.d - e.t);
          return (
            <BannerCard
              key={e.key}
              className="w-[240px] shrink-0 sm:w-[260px] md:w-[280px]"
              onSelect={() => onSelectWatch(e.slug, e.ep, e.season || 1)}
              item={{
                slug: e.slug,
                title: `${e.title} - ${e.epTitle}`,
                cover: e.cover,
                year: 0,
                rating: 0,
                type: "TV",
                totalEpisodes: 0,
                genres: [],
              }}
              chips={[
                (e.season ?? 1) > 1 ? `S${e.season} E${e.ep}` : `E${e.ep}`,
                `${formatTime(remaining)} left`,
              ]}
              progressPct={pct}
              showBookmark={false}
              onRemove={() => {
                removeProgressEntry(e.key);
                setEntries((prev) => prev.filter((x) => x.key !== e.key));
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
