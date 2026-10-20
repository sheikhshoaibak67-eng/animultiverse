import React from "react";
import { Play, Globe, Code2, Database, Server } from "lucide-react";

export default function Footer({
  onSelectGenre,
  onOpenExplorer,
}: {
  onSelectGenre: (genre: string) => void;
  onOpenExplorer: () => void;
}) {
  return (
    <footer className="relative mt-24 border-t border-white/5 bg-[var(--color-panel)]/40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />
      <div className="mx-auto max-w-[92rem] px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="glow-brand grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand">
                <Play className="h-4 w-4 fill-white text-white" />
              </span>
              <span className="font-display text-lg font-extrabold uppercase tracking-widest text-white">
                ANIVERSE
              </span>
            </div>
            <p className="mt-4 max-w-sm text-xs sm:text-sm leading-relaxed text-zinc-400">
              Free anime streaming experience with real TMDB metadata, transparent logos, multi-server playback (TG Server, VidStuck, VidSrc, AnimeWorld India), and local progress tracking.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={onOpenExplorer}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white"
              >
                <Code2 className="h-3.5 w-3.5 text-brand" />
                Browse Project Source Code
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500">
              Stack Architecture
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-zinc-400">
              <li className="flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-brand-soft" /> Next.js 16 App Router
              </li>
              <li className="flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-emerald-400" /> PostgreSQL & Drizzle ORM
              </li>
              <li className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-sky-400" /> TMDB & AniList GraphQL
              </li>
              <li className="flex items-center gap-1.5">
                <Play className="h-3.5 w-3.5 text-amber-400" /> Multi-Server Video Players
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500">
              Popular Genres
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-zinc-400">
              {["Action", "Fantasy", "Sci-Fi", "Comedy", "Drama", "Romance"].map((g) => (
                <li key={g}>
                  <button
                    onClick={() => onSelectGenre(g)}
                    className="cursor-pointer text-zinc-400 transition-colors hover:text-brand-soft"
                  >
                    {g}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500">
              Deployment Platforms
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-zinc-400">
              <li>Vercel Serverless (Next.js 16)</li>
              <li>Neon Serverless PostgreSQL</li>
              <li>Railway Nixpacks (All-in-one)</li>
              <li>Docker Container (Node 20 Alpine)</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-zinc-600 sm:flex-row">
          <p>© 2026 ANIVERSE. Built for the love of anime.</p>
          <p className="font-mono uppercase tracking-[0.2em] text-[10px]">
            Zero Ads • Multi-Server • Free & Open
          </p>
        </div>
      </div>
    </footer>
  );
}
