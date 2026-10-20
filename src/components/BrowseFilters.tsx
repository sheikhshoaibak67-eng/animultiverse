import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

const SORTS = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "az", label: "A - Z" },
];

export default function BrowseFilters({
  genres,
  selectedGenre,
  selectedSort,
  onGenreChange,
  onSortChange,
}: {
  genres: string[];
  selectedGenre: string;
  selectedSort: string;
  onGenreChange: (g: string) => void;
  onSortChange: (s: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {["All", ...genres].map((g) => {
          const active = selectedGenre === g || (g === "All" && !selectedGenre);
          return (
            <button
              key={g}
              onClick={() => onGenreChange(g === "All" ? "" : g)}
              className={cn(
                "cursor-pointer rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all",
                active
                  ? "bg-brand text-white shadow-md"
                  : "glass text-zinc-400 hover:border-brand-soft/40 hover:text-white"
              )}
            >
              {g}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
          Sort by
        </span>
        <div className="relative">
          <select
            value={selectedSort || "popular"}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort anime"
            className="glass cursor-pointer appearance-none rounded-full py-2 pl-4 pr-10 text-xs sm:text-sm text-white outline-none [&>option]:bg-zinc-900"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        </div>
      </div>
    </div>
  );
}
