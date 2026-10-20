import React, { useState } from "react";
import { Flame, Heart, Rocket, Shuffle, Sparkles, Star, Swords, Trophy } from "lucide-react";
import { cn } from "../lib/utils";

const CHIP =
  "inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs sm:text-sm font-semibold text-zinc-200 transition-all duration-300 hover:border-white/30 hover:bg-white hover:text-black active:scale-95";

export default function DiscoverChips({
  onSelectGenre,
  onSortChange,
  onSurprise,
}: {
  onSelectGenre: (genre: string) => void;
  onSortChange: (sort: string) => void;
  onSurprise: () => void;
}) {
  const [shuffling, setShuffling] = useState(false);

  const handleShuffle = () => {
    setShuffling(true);
    onSurprise();
    setTimeout(() => setShuffling(false), 500);
  };

  return (
    <nav aria-label="Discover" className="mt-3 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      <div className="no-scrollbar flex items-center gap-2.5 overflow-x-auto py-1">
        <button onClick={handleShuffle} className={CHIP}>
          <Shuffle className={cn("h-3.5 w-3.5", shuffling && "animate-spin")} />
          Surprise Me
        </button>
        <button onClick={() => onSortChange("popular")} className={CHIP}>
          <Flame className="h-3.5 w-3.5" /> Trending
        </button>
        <button onClick={() => onSortChange("rating")} className={CHIP}>
          <Star className="h-3.5 w-3.5" /> Top Rated
        </button>
        <button onClick={() => onSelectGenre("Action")} className={CHIP}>
          <Swords className="h-3.5 w-3.5" /> Action
        </button>
        <button onClick={() => onSelectGenre("Sci-Fi")} className={CHIP}>
          <Rocket className="h-3.5 w-3.5" /> Sci-Fi
        </button>
        <button onClick={() => onSelectGenre("Fantasy")} className={CHIP}>
          <Sparkles className="h-3.5 w-3.5" /> Fantasy
        </button>
        <button onClick={() => onSelectGenre("Romance")} className={CHIP}>
          <Heart className="h-3.5 w-3.5" /> Romance
        </button>
        <button onClick={() => onSelectGenre("Sports")} className={CHIP}>
          <Trophy className="h-3.5 w-3.5" /> Sports
        </button>
      </div>
    </nav>
  );
}
