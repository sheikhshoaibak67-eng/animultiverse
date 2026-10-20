import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Clapperboard, User } from "lucide-react";
import type { CastItem } from "../lib/types";

export default function CastSection({ cast }: { cast: CastItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const voiceCast = cast.filter((c) => c.role === "cast");
  const crew = cast.filter((c) => c.role === "crew");

  const scroll = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  if (voiceCast.length === 0 && crew.length === 0) return null;

  return (
    <section className="border-b border-white/5 bg-zinc-900/10 px-4 py-8 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      {/* Voice Cast */}
      {voiceCast.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="section-rule-brand font-display text-lg font-bold text-white sm:text-xl">
                Voice Cast
              </h3>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-zinc-400">
                {voiceCast.length} actors
              </span>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => scroll(-1)}
                aria-label="Scroll left"
                className="neomorph-btn grid h-8 w-8 place-items-center rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scroll(1)}
                aria-label="Scroll right"
                className="neomorph-btn grid h-8 w-8 place-items-center rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="no-scrollbar flex gap-3 overflow-x-auto pb-2 sm:gap-4"
          >
            {voiceCast.map((c) => (
              <div
                key={`cast-${c.id}`}
                className="group w-[110px] shrink-0 sm:w-[125px] md:w-[135px]"
              >
                <div className="relative aspect-[3/4.2] overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-950 shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:border-white/20">
                  {c.profileImage ? (
                    <img
                      src={c.profileImage}
                      alt={c.name}
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-900">
                      <User className="h-8 w-8 text-zinc-700" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-2.5 pt-8">
                    <p className="truncate text-xs font-bold text-white drop-shadow">
                      {c.name}
                    </p>
                    {c.character && (
                      <p className="mt-0.5 truncate text-[10px] font-semibold text-zinc-400">
                        {c.character}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crew */}
      {crew.length > 0 && (
        <div className={voiceCast.length > 0 ? "mt-8" : ""}>
          <div className="mb-4 flex items-center gap-3">
            <h3 className="section-rule-brand font-display text-lg font-bold text-white sm:text-xl">
              Production Staff
            </h3>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-zinc-400">
              {crew.length} crew
            </span>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4">
            {crew.map((c) => (
              <div
                key={`crew-${c.id}`}
                className="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-[var(--color-panel)] p-2.5 pr-4 transition-all duration-300 hover:border-white/15"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-800">
                  <div className="flex h-full w-full items-center justify-center">
                    <Clapperboard className="h-5 w-5 text-zinc-500" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {c.name}
                  </p>
                  <p className="truncate text-[11px] text-zinc-500">
                    {c.job || "Production"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
