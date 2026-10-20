import React, { useState, useEffect } from "react";
import { Bookmark, Check, ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import type { AnimeItem } from "../lib/types";
import { isListed, LIST_EVENT, toggleListItem } from "../lib/progress";

export default function Hero({
  items,
  onWatch,
  onDetails,
}: {
  items: AnimeItem[];
  onWatch: (slug: string) => void;
  onDetails: (slug: string) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [listed, setListed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const cur = items[idx] ?? items[0];

  useEffect(() => {
    setLogoError(false);
  }, [cur?.slug]);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % items.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [items.length, paused]);

  useEffect(() => {
    if (!cur) return;
    const sync = () => setListed(isListed(cur.slug));
    sync();
    window.addEventListener(LIST_EVENT, sync);
    return () => window.removeEventListener(LIST_EVENT, sync);
  }, [cur]);

  if (!cur) return null;

  return (
    <section
      className="relative w-full select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Ambient blurred backdrop glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-35">
        <img
          src={cur.coverImage}
          alt=""
          className="h-full w-full object-cover blur-[90px] saturate-200"
        />
      </div>

      {/* Main desktop and tablet hero box */}
      <div className="mx-auto max-w-[92rem] px-4 pt-20 pb-4 sm:px-8 md:px-10 lg:px-12">
        <div className="relative h-[480px] w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl md:h-[520px]">
          {/* Backdrop photo */}
          <img
            key={cur.slug}
            src={cur.coverImage}
            alt={cur.title}
            className="h-full w-full object-cover object-center transition-all duration-700 animate-fadeIn"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1280&auto=format&fit=crop&q=80";
            }}
          />

          {/* Gradients */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

          {/* Hero Content */}
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-10 md:p-12 lg:p-14 max-w-3xl">
            {/* Meta row */}
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 drop-shadow">
              <span>{cur.type === "TV" ? "Series" : cur.type}</span>
              <span className="text-zinc-500 font-bold">·</span>
              <span>{cur.year}</span>
              <span className="text-zinc-500 font-bold">·</span>
              <span className="flex items-center gap-1 font-bold text-white">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {cur.rating.toFixed(1)}
              </span>
              {cur.genres.slice(0, 3).map((g) => (
                <span key={g} className="flex items-center gap-2">
                  <span className="text-zinc-500 font-bold">·</span>
                  <span className="text-zinc-300">{g}</span>
                </span>
              ))}
            </div>

            {/* Title & TMDB Logo (Text Without Background) */}
            <div className="my-3 min-h-[80px] flex flex-col justify-end">
              {cur.logoImage && !logoError ? (
                <div className="space-y-2">
                  <img
                    src={cur.logoImage}
                    alt={cur.title}
                    className="max-h-24 sm:max-h-32 md:max-h-36 max-w-[320px] sm:max-w-[460px] md:max-w-[540px] object-contain object-left drop-shadow-[0_6px_28px_rgba(0,0,0,0.95)] select-none"
                    onError={() => setLogoError(true)}
                  />
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                      {cur.title}
                    </h2>
                    {cur.japaneseTitle && cur.japaneseTitle !== cur.title && (
                      <span className="rounded-md bg-black/70 px-2.5 py-0.5 font-mono text-xs font-semibold text-zinc-300 backdrop-blur border border-white/10">
                        {cur.japaneseTitle}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="font-display text-3xl font-black italic uppercase tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,1)] sm:text-4xl md:text-5xl lg:text-6xl leading-[0.95]">
                    {cur.title}
                  </h1>
                  {cur.japaneseTitle && (
                    <p className="mt-1.5 text-sm sm:text-base font-semibold tracking-wider text-zinc-300">
                      {cur.japaneseTitle}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Synopsis */}
            <p className="mt-2 line-clamp-3 text-sm text-zinc-300 drop-shadow-md sm:text-base leading-relaxed max-w-xl">
              {cur.synopsis}
            </p>

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onWatch(cur.slug)}
                className="liquid-glass-btn flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold text-black transition-all active:scale-95 sm:text-sm cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current ml-0.5" />
                <span>Watch Now</span>
              </button>
              <button
                type="button"
                onClick={() => onDetails(cur.slug)}
                className="liquid-glass flex items-center gap-1.5 rounded-full px-5 py-3 text-xs font-semibold text-white transition-all hover:bg-white/10 active:scale-95 sm:text-sm cursor-pointer"
              >
                Details
              </button>
              <button
                type="button"
                onClick={() =>
                  toggleListItem({
                    slug: cur.slug,
                    title: cur.title,
                    cover: cur.posterImage || cur.coverImage,
                    year: cur.year,
                    rating: cur.rating,
                    type: cur.type,
                    totalEpisodes: cur.totalEpisodes,
                    genres: cur.genres,
                  })
                }
                className={`rounded-full p-3 border transition-all active:scale-90 cursor-pointer ${
                  listed
                    ? "bg-white text-black border-white shadow-md"
                    : "neomorph-btn text-white border-white/20"
                }`}
                title={listed ? "In My List" : "Add to My List"}
              >
                {listed ? (
                  <Check className="h-4 w-4 text-black stroke-[2.5]" />
                ) : (
                  <Bookmark className="h-4 w-4 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Dots */}
          <div className="absolute bottom-6 right-8 z-30 hidden items-center gap-2 sm:flex">
            {items.map((it, i) => (
              <button
                key={it.slug}
                onClick={() => setIdx(i)}
                aria-label={`Slide ${i + 1}`}
                className={`cursor-pointer transition-all duration-300 ${
                  i === idx
                    ? "h-1.5 w-6 rounded-full bg-white shadow-sm"
                    : "h-1.5 w-1.5 rounded-full bg-zinc-600 hover:bg-zinc-400"
                }`}
              />
            ))}
          </div>

          {/* Nav arrows */}
          {items.length > 1 && (
            <>
              <button
                onClick={() => setIdx((idx - 1 + items.length) % items.length)}
                aria-label="Previous Slide"
                className="absolute left-4 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black md:grid cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIdx((idx + 1) % items.length)}
                aria-label="Next Slide"
                className="absolute right-4 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black md:grid cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
