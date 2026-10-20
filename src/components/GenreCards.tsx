import React from "react";
import { Flame, Ghost, Heart, Rocket, Shield, Sparkles, Swords, Wand2 } from "lucide-react";

const GENRE_MAP: Record<string, { icon: any; gradient: string }> = {
  Action: { icon: Swords, gradient: "from-red-600 to-orange-600" },
  "Sci-Fi": { icon: Rocket, gradient: "from-violet-600 to-indigo-600" },
  Drama: { icon: Heart, gradient: "from-pink-600 to-rose-600" },
  Comedy: { icon: Sparkles, gradient: "from-amber-500 to-yellow-500" },
  Mystery: { icon: Ghost, gradient: "from-emerald-600 to-teal-600" },
  Crime: { icon: Shield, gradient: "from-slate-600 to-zinc-600" },
  Animation: { icon: Wand2, gradient: "from-blue-600 to-cyan-500" },
  Fantasy: { icon: Flame, gradient: "from-purple-600 to-pink-600" },
};

export default function GenreCards({
  genres,
  onSelectGenre,
}: {
  genres: string[];
  onSelectGenre: (genre: string) => void;
}) {
  const displayGenres = genres.slice(0, 8);

  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 py-2 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      {displayGenres.map((g) => {
        const meta = GENRE_MAP[g] || { icon: Sparkles, gradient: "from-zinc-700 to-zinc-600" };
        const Icon = meta.icon;
        return (
          <button
            key={g}
            onClick={() => onSelectGenre(g)}
            className="group flex shrink-0 cursor-pointer items-center gap-2.5 rounded-2xl border border-white/[0.06] bg-zinc-900/80 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-lg"
          >
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${meta.gradient} shadow-md transition-transform duration-300 group-hover:scale-110`}
            >
              <Icon className="h-4 w-4 text-white" />
            </span>
            <span className="whitespace-nowrap text-xs font-semibold text-zinc-200 transition-colors group-hover:text-white sm:text-sm">
              {g}
            </span>
          </button>
        );
      })}
    </div>
  );
}
