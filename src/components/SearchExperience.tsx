import React, { useState, useEffect } from "react";
import { Ghost, Loader2, Search, Sparkles, X } from "lucide-react";
import PosterCard, { type PosterItem } from "./PosterCard";
import TrendingMarquee from "./TrendingMarquee";
import { searchTmdb, tmdbImage } from "../lib/tmdb";
import { fetchFromAniList } from "../lib/anilist";
import { getAllAnime, seedAnimeFromExternal } from "../lib/dataStore";
import { cn } from "../lib/utils";

export default function SearchExperience({
  onSelectAnime,
}: {
  onSelectAnime: (slug: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"anime" | "manga" | "movies" | "tv">("anime");
  const [loading, setLoading] = useState(false);

  const [localResults, setLocalResults] = useState<PosterItem[]>([]);
  const [tmdbResults, setTmdbResults] = useState<any[]>([]);
  const [anilistResults, setAnilistResults] = useState<any[]>([]);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setLocalResults([]);
      setTmdbResults([]);
      setAnilistResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const local = getAllAnime({ q }).map((a) => ({
          slug: a.slug,
          title: a.title,
          poster: a.posterImage || a.coverImage,
          year: a.year,
          rating: a.rating,
          type: a.type,
        }));
        setLocalResults(local);

        const [tmdb, anilist] = await Promise.all([
          searchTmdb(q).catch(() => []),
          fetchFromAniList(q, 10).catch(() => []),
        ]);

        setTmdbResults(tmdb);
        setAnilistResults(anilist);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Transform results into active tab
  const getTabResults = (): PosterItem[] => {
    if (activeTab === "anime") {
      const fromLocal = localResults.filter((r) => r.type === "TV" || r.type === "Anime");
      const fromAni = anilistResults
        .filter((r) => r.type === "ANIME")
        .map((r) => ({
          slug: `seed-al-${r.id}`,
          title: r.title.english || r.title.romaji,
          poster: r.coverImage.extraLarge || r.coverImage.large,
          year: r.startDate?.year || 2024,
          rating: Math.round(((r.averageScore || 80) / 10) * 10) / 10,
          type: "Anime",
          rawAni: r,
        }));
      return [...fromLocal, ...fromAni];
    }

    if (activeTab === "manga") {
      return anilistResults
        .filter((r) => r.type === "MANGA")
        .map((r) => ({
          slug: `seed-manga-${r.id}`,
          title: r.title.english || r.title.romaji,
          poster: r.coverImage.extraLarge || r.coverImage.large,
          year: r.startDate?.year || 2024,
          rating: Math.round(((r.averageScore || 80) / 10) * 10) / 10,
          type: "Manga",
          rawAni: r,
        }));
    }

    if (activeTab === "movies") {
      const fromLocal = localResults.filter((r) => r.type === "Movie");
      const fromTmdb = tmdbResults
        .filter((r) => r.media_type === "movie")
        .map((r) => ({
          slug: `seed-tm-${r.id}`,
          title: r.title || r.name || "",
          poster: tmdbImage(r.poster_path, "w500"),
          year: Number((r.release_date || "").split("-")[0]) || 2024,
          rating: Math.round((r.vote_average || 7.5) * 10) / 10,
          type: "Movie",
          rawTmdb: r,
        }));
      return [...fromLocal, ...fromTmdb];
    }

    // TV Shows
    return tmdbResults
      .filter((r) => r.media_type === "tv")
      .map((r) => ({
        slug: `seed-tv-${r.id}`,
        title: r.name || r.title || "",
        poster: tmdbImage(r.poster_path, "w500"),
        year: Number((r.first_air_date || "").split("-")[0]) || 2024,
        rating: Math.round((r.vote_average || 7.5) * 10) / 10,
        type: "TV",
        rawTmdb: r,
      }));
  };

  const handleItemClick = (item: PosterItem & { rawTmdb?: any; rawAni?: any }) => {
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
        type: item.type,
        overview: item.rawAni.description,
        anilistId: item.rawAni.id,
      });
      onSelectAnime(slug);
    } else {
      onSelectAnime(item.slug);
    }
  };

  const currentTabList = getTabResults();
  const showRecommendations = !query.trim();

  const recommendedItems = getAllAnime({ limit: 14 }).map((a) => ({
    slug: a.slug,
    title: a.title,
    poster: a.posterImage || a.coverImage,
    year: a.year,
    rating: a.rating,
    type: a.type,
  }));

  const tabs: Array<{ id: "anime" | "manga" | "movies" | "tv"; label: string }> = [
    { id: "anime", label: "Anime" },
    { id: "manga", label: "Manga" },
    { id: "movies", label: "Movies" },
    { id: "tv", label: "TV Shows" },
  ];

  return (
    <main className="mx-auto min-h-screen max-w-[92rem] px-4 pb-20 pt-24 sm:px-6 md:pb-10 lg:px-10">
      <section className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Live Search & Discovery
          </h1>
          <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            TMDB & AniList Powered
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/90 p-3 shadow-xl backdrop-blur-xl sm:p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 focus-within:border-white/30 sm:px-5 sm:py-3.5">
            <Search className="h-5 w-5 shrink-0 text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anime, manga, movies, or TV series..."
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder-zinc-500 outline-none"
            />
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-brand" />
            ) : query ? (
              <button
                onClick={() => setQuery("")}
                className="cursor-pointer rounded-full p-1 text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <div className="mt-4 flex items-center gap-1 border-t border-white/5 pt-3">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95",
                  activeTab === t.id
                    ? "bg-white text-black shadow-md font-bold"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
              >
                {t.label}
              </button>
            ))}
            <div className="flex-1" />
            <p className="hidden text-[10px] font-bold uppercase tracking-widest text-zinc-600 sm:block">
              {query.trim() ? "Search Results" : "Auto Discovery"}
            </p>
          </div>
        </div>
      </section>

      {showRecommendations ? (
        <section className="mt-10">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-soft" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Popular & Recommended Anime
            </h2>
          </div>
          <TrendingMarquee items={recommendedItems} onSelect={onSelectAnime} />
        </section>
      ) : currentTabList.length > 0 ? (
        <section className="mt-8 space-y-6">
          <div className="border-b border-zinc-800 pb-2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white sm:text-base">
              {activeTab} Results for "{query.trim()}" ({currentTabList.length})
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
            {currentTabList.map((item, i) => (
              <div key={item.slug + i} onClick={() => handleItemClick(item as any)}>
                <PosterCard item={item} className="w-full" />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-10 rounded-2xl border border-white/10 bg-zinc-900/50 p-12 text-center">
          <Ghost className="mx-auto h-10 w-10 text-zinc-600" />
          <h2 className="mt-4 text-lg font-bold text-white">No {activeTab} results found</h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-500">
            Try checking spelling or switching to another media tab (Anime, Manga, Movies, TV).
          </p>
        </section>
      )}
    </main>
  );
}
