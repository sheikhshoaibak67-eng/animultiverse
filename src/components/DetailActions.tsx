import React, { useEffect, useState } from "react";
import { Bookmark, CalendarDays, Check, Eye, Play, Share2, Shuffle } from "lucide-react";
import { readProgressMap, toggleListItem, isListed, LIST_EVENT, type ListItem } from "../lib/progress";
import { cn } from "../lib/utils";

export default function DetailActions({
  item,
  onWatch,
  onSurprise,
}: {
  item: ListItem;
  onWatch: () => void;
  onSurprise: () => void;
}) {
  const [ctaLabel, setCtaLabel] = useState("Start Watching (E1)");
  const [listed, setListed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shuffling, setShuffling] = useState(false);

  useEffect(() => {
    const map = readProgressMap();
    const mine = Object.values(map)
      .filter((e) => e.slug === item.slug)
      .sort((a, b) => b.at - a.at);
    const last = mine[0];
    if (last) {
      const season = last.season ?? 1;
      const finished = last.d > 0 && last.t / last.d > 0.92;
      const targetEp = finished ? last.ep + 1 : last.ep;
      setCtaLabel(`Continue Watching (${season > 1 ? `S${season}:E${targetEp}` : `E${targetEp}`})`);
    }

    const syncListed = () => setListed(isListed(item.slug));
    syncListed();
    window.addEventListener(LIST_EVENT, syncListed);
    return () => window.removeEventListener(LIST_EVENT, syncListed);
  }, [item.slug]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* ignore */
    }
  };

  const handleSurprise = () => {
    setShuffling(true);
    onSurprise();
    setTimeout(() => setShuffling(false), 500);
  };

  const square =
    "flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/5 text-zinc-200 backdrop-blur transition-all duration-300 hover:border-white/30 hover:bg-white hover:text-black active:scale-95";
  const pill =
    "flex cursor-pointer items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 active:scale-95";

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          onClick={onWatch}
          className="glow-brand inline-flex cursor-pointer shrink-0 items-center gap-2 rounded-xl bg-brand px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-brand-deep active:scale-95 sm:text-sm"
        >
          <Play className="h-4 w-4 fill-white" />
          {ctaLabel}
        </button>

        <button
          onClick={onWatch}
          title="Preview episode 1"
          aria-label="Preview episode 1"
          className={square}
        >
          <Eye className="h-4 w-4" />
        </button>

        <a
          href="#episodes"
          title="Jump to episodes"
          aria-label="Jump to episodes"
          className={square}
        >
          <CalendarDays className="h-4 w-4" />
        </a>
      </div>

      <div className="flex flex-wrap gap-2.5 pt-2">
        <button
          onClick={handleShare}
          className={cn(
            pill,
            "border-white/10 bg-transparent text-zinc-400 hover:bg-white/10 hover:text-white"
          )}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Share2 className="h-3.5 w-3.5" />
          )}
          {copied ? "Copied" : "Share"}
        </button>

        <button
          onClick={() => setListed(toggleListItem(item))}
          aria-pressed={listed}
          className={cn(
            pill,
            listed
              ? "border-brand bg-brand text-white"
              : "border-white/10 bg-transparent text-zinc-400 hover:bg-white/10 hover:text-white"
          )}
        >
          <Bookmark className={cn("h-3.5 w-3.5", listed && "fill-white")} />
          {listed ? "In My List" : "My List"}
        </button>

        <button
          onClick={handleSurprise}
          className={cn(
            pill,
            "border-white/10 bg-transparent text-zinc-400 hover:bg-white/10 hover:text-white"
          )}
        >
          <Shuffle className={cn("h-3.5 w-3.5", shuffling && "animate-spin")} />
          Surprise Me
        </button>
      </div>
    </>
  );
}
