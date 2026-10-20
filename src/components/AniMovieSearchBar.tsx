import React, { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, Sparkles, Star, Film, Tv, BookOpen, Clock, ArrowRight } from "lucide-react";
import { searchTmdb, tmdbImage } from "../lib/tmdb";
import { fetchFromAniList } from "../lib/anilist";
import { getAllAnime, seedAnimeFromExternal, findAnime } from "../lib/dataStore";
import { cn } from "../lib/utils";

type SearchFilterType = "all" | "anime" | "movies" | "tv" | "manga";

interface SearchResultItem {
  id: string;
  slug: string;
  title: string;
  subTitle?: string;
  poster: string;
  year: number;
  rating: number;
  type: string;
  genres?: string[];
  rawTmdb?: any;
  rawAni?: any;
}

const TRENDING_KEYWORDS = [
  "Jujutsu Kaisen",
  "Demon Slayer",
  "Solo Leveling",
  "One Piece",
  "Bleach",
  "Attack on Titan",
  "Naruto Shippuden",
  "Chainsaw Man",
];

export default function AniMovieSearchBar({
  onSelectAnime,
  onOpenFullSearch,
  className,
}: {
  onSelectAnime: (slug: string) => void;
  onOpenFullSearch?: (q?: string) => void;
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<SearchFilterType>("all");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("aniverse_recent_searches") || "[]");
    } catch {
      return [];
    }
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener: "/" or "Ctrl+K" / "Cmd+K" to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search logic combining local catalog, TMDB & AniList
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        // 1. Local catalog matches
        const localMatches = getAllAnime({ q }).map((a) => ({
          id: `local-${a.id}`,
          slug: a.slug,
          title: a.title,
          subTitle: a.japaneseTitle,
          poster: a.posterImage || a.coverImage,
          year: a.year,
          rating: a.rating,
          type: a.type === "Movie" ? "Movie" : "Anime",
          genres: a.genres,
        }));

        // 2. Fetch from TMDB and AniList simultaneously
        const [tmdbList, aniList] = await Promise.all([
          searchTmdb(q).catch(() => []),
          fetchFromAniList(q, 6).catch(() => []),
        ]);

        const externalResults: SearchResultItem[] = [];

        // AniList Anime & Manga
        for (const ani of aniList) {
          const title = ani.title?.english || ani.title?.romaji || "";
          if (!title) continue;
          if (localMatches.some((m) => m.title.toLowerCase() === title.toLowerCase())) continue;

          externalResults.push({
            id: `ani-${ani.id}`,
            slug: `seed-al-${ani.id}`,
            title,
            subTitle: ani.title?.native || ani.title?.romaji,
            poster: ani.coverImage?.extraLarge || ani.coverImage?.large,
            year: ani.startDate?.year || 2024,
            rating: Math.round(((ani.averageScore || 80) / 10) * 10) / 10,
            type: ani.type === "MANGA" ? "Manga" : "Anime",
            genres: ani.genres || [],
            rawAni: ani,
          });
        }

        // TMDB Movies and TV
        for (const tmdb of tmdbList) {
          const title = tmdb.name || tmdb.title || "";
          if (!title) continue;
          if (
            localMatches.some((m) => m.title.toLowerCase() === title.toLowerCase()) ||
            externalResults.some((m) => m.title.toLowerCase() === title.toLowerCase())
          )
            continue;

          externalResults.push({
            id: `tmdb-${tmdb.id}`,
            slug: `seed-tm-${tmdb.id}`,
            title,
            subTitle: tmdb.original_name || tmdb.original_title,
            poster: tmdbImage(tmdb.poster_path, "w500"),
            year: Number((tmdb.first_air_date || tmdb.release_date || "").slice(0, 4)) || 2024,
            rating: Math.round((tmdb.vote_average || 7.5) * 10) / 10,
            type: tmdb.media_type === "movie" ? "Movie" : "TV",
            genres: [],
            rawTmdb: tmdb,
          });
        }

        setResults([...localMatches, ...externalResults]);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  const saveRecentSearch = (kw: string) => {
    const trimmed = kw.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem("aniverse_recent_searches", JSON.stringify(updated));
    } catch {}
  };

  const handleSelect = (item: SearchResultItem) => {
    saveRecentSearch(item.title);
    setIsOpen(false);
    setQuery("");

    if (item.rawTmdb) {
      const slug = seedAnimeFromExternal({
        title: item.title,
        poster: item.poster,
        backdrop: tmdbImage(item.rawTmdb.backdrop_path, "w1280"),
        year: item.year,
        rating: item.rating,
        type: item.type,
        overview: item.rawTmdb.overview,
        tmdbId: item.rawTmdb.id,
      });
      onSelectAnime(slug);
    } else if (item.rawAni) {
      const slug = seedAnimeFromExternal({
        title: item.title,
        poster: item.poster,
        backdrop: item.rawAni.bannerImage || item.poster,
        year: item.year,
        rating: item.rating,
        type: item.type === "Manga" ? "Manga" : "Anime",
        overview: item.rawAni.description ? item.rawAni.description.replace(/<[^>]*>/g, "") : "",
        anilistId: item.rawAni.id,
      });
      onSelectAnime(slug);
    } else {
      onSelectAnime(item.slug);
    }
  };

  const handleKeywordClick = (kw: string) => {
    setQuery(kw);
    inputRef.current?.focus();
    saveRecentSearch(kw);
  };

  // Filtered results
  const filteredResults = results.filter((item) => {
    if (filter === "all") return true;
    if (filter === "anime") return item.type === "Anime";
    if (filter === "movies") return item.type === "Movie";
    if (filter === "tv") return item.type === "TV" || item.type === "Anime";
    if (filter === "manga") return item.type === "Manga";
    return true;
  });

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-lg", className)}>
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-zinc-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && filteredResults[0]) {
              handleSelect(filteredResults[0]);
            }
          }}
          placeholder="Search anime, movies, TMDB & AniList..."
          className="h-10 w-full rounded-2xl border border-white/10 bg-zinc-900/90 pl-10 pr-20 text-xs text-white placeholder-zinc-500 shadow-inner backdrop-blur-md transition-all focus:border-brand/80 focus:bg-black focus:outline-none focus:ring-1 focus:ring-brand/50"
        />

        <div className="absolute right-2.5 flex items-center gap-1.5">
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-brand" />}
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
                inputRef.current?.focus();
              }}
              className="rounded-full p-1 text-zinc-400 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
              <span className="text-xs">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      {/* Floating AniMovie Instant Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[520px] overflow-hidden rounded-2xl border border-white/15 bg-zinc-950/95 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-white/10 bg-white/[0.02] p-2.5 scrollbar-none">
            {[
              { id: "all", label: "All Media" },
              { id: "anime", label: "Anime" },
              { id: "movies", label: "Movies" },
              { id: "tv", label: "TV Shows" },
              { id: "manga", label: "Manga" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilter(t.id as SearchFilterType)}
                className={cn(
                  "rounded-full px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer shrink-0",
                  filter === t.id
                    ? "bg-brand text-white shadow-sm font-bold"
                    : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="max-h-[440px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-zinc-700">
            {/* If query is empty, show Trending & Recent Searches */}
            {!query.trim() && (
              <div className="p-3 space-y-4">
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        <Clock className="h-3 w-3 text-zinc-500" /> Recent Searches
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setRecentSearches([]);
                          localStorage.removeItem("aniverse_recent_searches");
                        }}
                        className="text-[10px] text-zinc-500 hover:text-red-400 cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((kw, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleKeywordClick(kw)}
                          className="rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 text-xs text-zinc-300 hover:border-brand/40 hover:bg-brand/10 hover:text-brand-soft cursor-pointer transition-colors"
                        >
                          {kw}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    <Sparkles className="h-3 w-3 text-brand" /> Trending Today
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {TRENDING_KEYWORDS.map((kw, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleKeywordClick(kw)}
                        className="rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 text-xs text-zinc-300 hover:border-brand/40 hover:bg-brand/10 hover:text-brand-soft cursor-pointer transition-colors"
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Results List */}
            {query.trim() && (
              <div className="space-y-1">
                {loading && filteredResults.length === 0 ? (
                  <div className="flex items-center justify-center py-10 text-xs text-zinc-400">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-brand" />
                    Searching TMDB & AniList...
                  </div>
                ) : filteredResults.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-500">
                    No matching titles found for "{query}". Try checking spelling or genre.
                  </div>
                ) : (
                  <>
                    {filteredResults.slice(0, 8).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item)}
                        className="group flex w-full items-center gap-3 rounded-xl p-2 text-left transition-all hover:bg-white/10 cursor-pointer"
                      >
                        <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-900 border border-white/10">
                          {item.poster ? (
                            <img
                              src={item.poster}
                              alt={item.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-[10px] text-zinc-500">
                              No Pic
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-xs font-bold text-white group-hover:text-brand-soft">
                              {item.title}
                            </span>
                            <span
                              className={cn(
                                "shrink-0 rounded px-1.5 py-0.2 text-[9px] font-bold uppercase",
                                item.type === "Movie"
                                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                  : item.type === "Manga"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              )}
                            >
                              {item.type}
                            </span>
                          </div>

                          {item.subTitle && (
                            <p className="truncate text-[11px] text-zinc-400 font-serif">
                              {item.subTitle}
                            </p>
                          )}

                          <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-400">
                            {item.rating > 0 && (
                              <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                                <Star className="h-2.5 w-2.5 fill-amber-400" />
                                {item.rating.toFixed(1)}
                              </span>
                            )}
                            {item.year > 0 && <span>{item.year}</span>}
                            {item.genres && item.genres.length > 0 && (
                              <span className="text-zinc-500 truncate">
                                • {item.genres.slice(0, 2).join(", ")}
                              </span>
                            )}
                          </div>
                        </div>

                        <ArrowRight className="h-4 w-4 text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:text-brand transition-all -translate-x-1 group-hover:translate-x-0" />
                      </button>
                    ))}

                    {onOpenFullSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          onOpenFullSearch(query);
                        }}
                        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                      >
                        <span>View all results for "{query}"</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
