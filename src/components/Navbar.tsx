import React, { useState } from "react";
import { Code2, Compass, Home, Play, Search, Shuffle, Bookmark, X } from "lucide-react";
import { cn } from "../lib/utils";
import AniMovieSearchBar from "./AniMovieSearchBar";

export type NavTab = "home" | "browse" | "search" | "mylist" | "explorer";

export default function Navbar({
  activeTab,
  onTabChange,
  onSurprise,
  onSelectAnime,
}: {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onSurprise: () => void;
  onSelectAnime: (slug: string) => void;
}) {
  const [shuffling, setShuffling] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleShuffle = () => {
    setShuffling(true);
    onSurprise();
    setTimeout(() => setShuffling(false), 500);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#09090b]/85 backdrop-blur-xl transition-all">
      <nav className="mx-auto flex h-16 max-w-[92rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onTabChange("home")}
            className="group flex cursor-pointer items-center gap-2.5 select-none"
          >
            <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-xl border border-zinc-700/80 bg-zinc-900 shadow-lg transition-transform group-hover:scale-105">
              <Play className="h-4 w-4 fill-white text-white" />
            </span>
            <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-xl font-extrabold tracking-wider text-transparent">
              ANIVERSE
            </span>
          </button>

          {/* Desktop Nav items */}
          <div className="hidden items-center gap-1 md:flex">
            {[
              { id: "home", label: "Home", icon: Home },
              { id: "browse", label: "Browse", icon: Compass },
              { id: "mylist", label: "My List", icon: Bookmark },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id as NavTab)}
                  className={cn(
                    "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all",
                    active ? "bg-white/10 text-white font-bold" : "text-zinc-400 hover:text-white"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* AniMovie Interactive Live Search Bar (Desktop & Tablet) */}
        <div className="hidden min-w-0 flex-1 justify-center px-4 md:flex">
          <AniMovieSearchBar
            onSelectAnime={onSelectAnime}
            onOpenFullSearch={(q) => {
              onTabChange("search");
            }}
          />
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Mobile search toggle */}
          <button
            onClick={() => setMobileSearchOpen((v) => !v)}
            aria-label="Toggle search"
            className="rounded-xl border border-white/10 p-2 text-zinc-300 hover:bg-white/10 hover:text-white md:hidden cursor-pointer"
          >
            {mobileSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>

          {/* Codebase & Backend Explorer CTA */}
          <button
            onClick={() => onTabChange("explorer")}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all active:scale-95",
              activeTab === "explorer"
                ? "border-brand bg-brand text-white shadow-lg"
                : "border-white/15 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
            )}
          >
            <Code2 className="h-4 w-4 text-brand-soft" />
            <span className="hidden sm:inline">Inspect Source</span>
            <span className="sm:hidden">Code</span>
          </button>

          <button
            onClick={handleShuffle}
            title="Surprise me with random anime"
            aria-label="Random anime"
            className="hidden rounded-xl border border-zinc-700/80 bg-zinc-900 p-2.5 text-zinc-300 shadow-md transition-all hover:text-white sm:block cursor-pointer active:scale-95"
          >
            <Shuffle className={cn("h-4 w-4", shuffling && "animate-spin")} />
          </button>
        </div>
      </nav>

      {/* Mobile search bar dropdown */}
      {mobileSearchOpen && (
        <div className="border-t border-white/10 bg-zinc-950/95 p-3 md:hidden">
          <AniMovieSearchBar
            onSelectAnime={(slug) => {
              setMobileSearchOpen(false);
              onSelectAnime(slug);
            }}
            onOpenFullSearch={() => {
              setMobileSearchOpen(false);
              onTabChange("search");
            }}
          />
        </div>
      )}
    </header>
  );
}
