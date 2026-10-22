import React, { useState } from "react";
import Navbar, { type NavTab } from "./components/Navbar";
import MobileNav from "./components/MobileNav";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import DiscoverChips from "./components/DiscoverChips";
import GenreCards from "./components/GenreCards";
import ContinueWatching from "./components/ContinueWatching";
import MyListRail from "./components/MyListRail";
import SectionHeader from "./components/SectionHeader";
import TrendingMarquee from "./components/TrendingMarquee";
import PosterRow from "./components/PosterRow";
import PosterCard, { type PosterItem } from "./components/PosterCard";
import BrowseFilters from "./components/BrowseFilters";
import SeasonBrowser from "./components/SeasonBrowser";
import CastSection from "./components/CastSection";
import DetailActions from "./components/DetailActions";
import WatchPlayer from "./components/WatchPlayer";
import EpisodeNav from "./components/EpisodeNav";
import DownloadButton from "./components/DownloadButton";
import SearchExperience from "./components/SearchExperience";
import BannerCard from "./components/BannerCard";
import CodeExplorer from "./components/CodeExplorer";
import TitleDetailPage from "./components/TitleDetailPage";
import Top10TodayRow from "./components/Top10TodayRow";

import {
  getFeatured,
  getTrending,
  getTopRated,
  getLatestEpisodes,
  getAllAnime,
  getGenres,
  getAnimeBySlug,
  getEpisodeBundle,
  getSimilar,
  getRandomSlug,
  getStats,
  getCartoons,
  loadLiveAniMovieTmdbCatalog,
  isTmdbLiveLoaded,
} from "./lib/dataStore";
import { cn, formatDuration, formatViews } from "./lib/utils";
import { getTagline } from "./lib/copy";
import { readListItems, removeFromList, LIST_KEY } from "./lib/progress";
import {
  Flame,
  Radio,
  Sparkles,
  Trophy,
  Library,
  TrendingUp,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Star,
  Ghost,
  BookmarkX,
  RefreshCw,
  Film,
} from "lucide-react";

function parsePathRoute(): { tab: NavTab; slug: string } {
  if (typeof window === "undefined") return { tab: "home", slug: "demon-slayer-kimetsu-no-yaiba" };
  const p = window.location.pathname;
  if (p.startsWith("/title/")) {
    const raw = p.replace("/title/", "").trim();
    if (raw === "tv-85937" || raw === "85937" || raw.includes("demon-slayer")) {
      return { tab: "anime-detail" as NavTab, slug: "demon-slayer-kimetsu-no-yaiba" };
    }
    return { tab: "anime-detail" as NavTab, slug: raw };
  }
  if (p === "/browse" || p.startsWith("/browse")) return { tab: "browse", slug: "solo-leveling" };
  if (p === "/search" || p.startsWith("/search")) return { tab: "search", slug: "solo-leveling" };
  if (p === "/my-list" || p.startsWith("/my-list") || p === "/mylist") return { tab: "mylist", slug: "solo-leveling" };
  return { tab: "home", slug: "demon-slayer-kimetsu-no-yaiba" };
}

export default function App() {
  const initialRoute = parsePathRoute();
  const [navTab, setNavTab] = useState<NavTab>(initialRoute.tab);
  const [version, setVersion] = useState(0);
  const [isLiveTmdb, setIsLiveTmdb] = useState(isTmdbLiveLoaded());
  const [isSyncing, setIsSyncing] = useState(false);

  // Detail & Watch state
  const [selectedSlug, setSelectedSlug] = useState<string>(initialRoute.slug);
  const [currentSeason, setCurrentSeason] = useState<number>(1);
  const [currentEpisode, setCurrentEpisode] = useState<number>(1);

  // Handle browser URL back/forward navigation
  React.useEffect(() => {
    const handlePopState = () => {
      const r = parsePathRoute();
      setNavTab(r.tab);
      if (r.slug) {
        setSelectedSlug(r.slug);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Hydrate live TMDB catalog on mount
  React.useEffect(() => {
    let mounted = true;
    const onCatalogUpdate = () => {
      if (!mounted) return;
      setIsLiveTmdb(true);
      setVersion((v) => v + 1);
    };

    window.addEventListener("aniverse:catalog-updated", onCatalogUpdate);

    loadLiveAniMovieTmdbCatalog().then(() => {
      if (mounted) {
        setIsLiveTmdb(true);
        setVersion((v) => v + 1);
      }
    });

    return () => {
      mounted = false;
      window.removeEventListener("aniverse:catalog-updated", onCatalogUpdate);
    };
  }, []);

  const handleSyncTmdb = async () => {
    setIsSyncing(true);
    await loadLiveAniMovieTmdbCatalog(true);
    setIsSyncing(false);
    setVersion((v) => v + 1);
  };

  // Browse state
  const [browseGenre, setBrowseGenre] = useState<string>("");
  const [browseSort, setBrowseSort] = useState<string>("popular");

  // Data queries
  const featured = getFeatured();
  const trending = getTrending(20);
  const topRated = getTopRated(10);
  const latestEpisodes = getLatestEpisodes(10);
  const allAnime = getAllAnime({
    genre: browseGenre,
    sort: browseSort,
  });
  const genres = getGenres();
  const stats = getStats();

  const cartoons = getCartoons(12);

  // AniMovie Home Showcase Switcher
  const [homeShowcase, setHomeShowcase] = useState<"all" | "movies" | "shonen" | "supernatural" | "cartoons">("all");
  const showcaseItems = React.useMemo(() => {
    if (homeShowcase === "movies") {
      return allAnime.filter((a) => a.type === "Movie" && a.category !== "cartoon");
    }
    if (homeShowcase === "shonen") {
      return allAnime.filter((a) => (a.genres.includes("Action") || a.genres.includes("Action & Adventure")) && a.category !== "cartoon");
    }
    if (homeShowcase === "supernatural") {
      return allAnime.filter((a) => (a.genres.includes("Fantasy") || a.genres.includes("Supernatural") || a.genres.includes("Sci-Fi & Fantasy")) && a.category !== "cartoon");
    }
    if (homeShowcase === "cartoons") {
      return getCartoons(24);
    }
    return allAnime.filter((a) => a.category !== "cartoon");
  }, [allAnime, homeShowcase]);

  const toPosterItem = (a: any): PosterItem => ({
    slug: a.slug,
    title: a.title,
    poster: a.posterImage || a.coverImage,
    year: a.year,
    rating: a.rating,
    type: a.type,
  });

  const handleSurprise = () => {
    const slug = getRandomSlug();
    handleOpenAnime(slug);
  };

  const handleOpenAnime = (slugOrId: string) => {
    let urlSlug = slugOrId;
    if (
      slugOrId === "demon-slayer-kimetsu-no-yaiba" ||
      slugOrId === "85937" ||
      slugOrId === "tv-85937"
    ) {
      urlSlug = "tv-85937";
    } else if (/^\d+$/.test(slugOrId)) {
      urlSlug = `tv-${slugOrId}`;
    }

    try {
      window.history.pushState({}, "", `/title/${urlSlug}`);
    } catch {}

    setSelectedSlug(slugOrId);
    setCurrentSeason(1);
    setCurrentEpisode(1);
    setNavTab("anime-detail" as any);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToCatalog = () => {
    try {
      window.history.pushState({}, "", "/");
    } catch {}
    setNavTab("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWatchAnime = (slug: string, ep = 1, season = 1) => {
    setSelectedSlug(slug);
    setCurrentSeason(season);
    setCurrentEpisode(ep);
    setNavTab("watch" as any);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGenrePick = (g: string) => {
    setBrowseGenre(g);
    setNavTab("browse");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Watch page bundle
  const watchBundle = getEpisodeBundle(selectedSlug, currentSeason, currentEpisode);
  const detailData = getAnimeBySlug(selectedSlug) || getAnimeBySlug("demon-slayer-kimetsu-no-yaiba");

  return (
    <div className="min-h-screen bg-[#09090b] text-[#e4e4e7] selection:bg-brand selection:text-white">
      {/* Top Navbar with AniMovie Live Search */}
      <Navbar
        activeTab={navTab}
        onTabChange={(tab) => {
          setNavTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onSurprise={handleSurprise}
        onSelectAnime={handleOpenAnime}
      />

      {/* VIEW: HOME */}
      {navTab === "home" && (
        <main className="relative z-10 flex min-h-screen w-full flex-col select-none pb-20 md:pb-10">
          {/* Hero Carousel */}
          <Hero
            items={featured}
            onWatch={(slug) => handleWatchAnime(slug, 1, 1)}
            onDetails={(slug) => handleOpenAnime(slug)}
          />

          {/* Live TMDB API Status Strip */}
          <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20 -mt-2 mb-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-2.5 backdrop-blur-md shadow-lg">
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                </span>
                <span className="font-bold text-emerald-400">TMDB Live Active</span>
                <span className="text-zinc-600 font-bold">·</span>
                <span className="text-zinc-300 font-medium">
                  {stats.series} Anime Loaded • Real Posters & Transparent Title Logos (Text Without Background)
                </span>
              </div>
              <button
                type="button"
                onClick={handleSyncTmdb}
                disabled={isSyncing}
                className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold text-zinc-300 transition-all hover:bg-white/15 hover:text-white active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin text-brand-soft" : ""}`} />
                <span>{isSyncing ? "Syncing..." : "Sync Live TMDB"}</span>
              </button>
            </div>
          </div>

          {/* Discover Chips */}
          <DiscoverChips
            onSelectGenre={handleGenrePick}
            onSortChange={(sort) => {
              setBrowseSort(sort);
              setNavTab("browse");
            }}
            onSurprise={handleSurprise}
          />

          {/* Genre Cards */}
          <div className="mt-4">
            <GenreCards genres={genres} onSelectGenre={handleGenrePick} />
          </div>

          {/* Continue Watching (localStorage) */}
          <ContinueWatching onSelectWatch={(slug, ep, s) => handleWatchAnime(slug, ep, s)} />

          {/* My List Rail */}
          <MyListRail
            onSelectAnime={handleOpenAnime}
            onManage={() => setNavTab("mylist")}
          />

          {/* Trending anime marquee */}
          <div className="mt-6">
            <SectionHeader
              title="Trending Anime"
              badge="Live Trending"
              badgeColor="bg-brand"
              subtitle="Most popular anime streaming right now"
              icon={Flame}
              onViewMore={() => setNavTab("browse")}
            />
            <TrendingMarquee items={trending.map(toPosterItem)} onSelect={handleOpenAnime} />
          </div>

          {/* Top 10 in Anime Today (AniMovie / Netflix Signature Feature) */}
          <div className="mt-6">
            <SectionHeader
              title="Top 10 in Anime Today"
              badge="Top 10"
              badgeColor="bg-amber-600"
              subtitle="The most-watched anime series ranked by daily viewership"
              icon={Trophy}
              onViewMore={() => {
                setBrowseSort("rating");
                setNavTab("browse");
              }}
            />
            <Top10TodayRow
              items={trending.slice(0, 10).map(toPosterItem)}
              onSelect={handleOpenAnime}
            />
          </div>

          {/* New Simulcasts */}
          <div className="mt-4">
            <SectionHeader
              title="New Episodes"
              badge="Simulcast"
              badgeColor="bg-emerald-600"
              subtitle="Latest episodes dropped across all series"
              icon={Radio}
            />
            <PosterRow>
              {latestEpisodes.map((e) => (
                <div
                  key={e.id}
                  onClick={() => handleWatchAnime(e.slug, e.number, e.season)}
                  className="group block w-[140px] shrink-0 cursor-pointer sm:w-[155px] md:w-[170px]"
                >
                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-900 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-white/20">
                    <img
                      src={e.thumb || e.cover}
                      alt={`${e.animeTitle} EP ${e.number}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(ev) => {
                        (ev.target as HTMLImageElement).src = e.cover;
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2.5">
                      <span className="rounded bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                        EP {e.number}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 px-0.5">
                    <h3 className="truncate text-[13px] font-semibold text-zinc-100">
                      {e.animeTitle}
                    </h3>
                    <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                      {e.title} • {formatDuration(e.duration)}
                    </p>
                  </div>
                </div>
              ))}
            </PosterRow>
          </div>

          {/* SEPARATE DEDICATED CARTOONS SECTION ("cartoon section alage") */}
          {cartoons.length > 0 && (
            <div className="mt-8">
              <SectionHeader
                title="Cartoons & Animated Classics"
                badge="Cartoons Only"
                badgeColor="bg-cyan-600"
                subtitle="Ben 10, Avatar, Arcane, Doraemon, Shin-chan & western favorites"
                icon={Film}
                onViewMore={() => {
                  setHomeShowcase("cartoons");
                }}
              />
              <PosterRow>
                {cartoons.map((c) => (
                  <div key={c.slug} className="relative w-[140px] shrink-0 sm:w-[155px] md:w-[170px]">
                    <div className="absolute top-2 left-2 z-10 rounded-md bg-cyan-600/95 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-md">
                      Cartoon
                    </div>
                    <PosterCard item={toPosterItem(c)} onSelect={handleOpenAnime} className="w-full" />
                  </div>
                ))}
              </PosterRow>
            </div>
          )}

          {/* AniMovie Media Showcase & Library Grid */}
          <div className="mt-10">
            <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-black tracking-wide text-white flex items-center gap-2">
                  <Flame className="h-5 w-5 text-brand" />
                  <span>AniMovie Catalog Showcase</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Filter by anime series, blockbuster movies, shonen action, and cartoons
                </p>
              </div>

              {/* AniMovie Interactive Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
                {[
                  { id: "all", label: "Pure Anime Library" },
                  { id: "movies", label: "🎬 Anime Movies" },
                  { id: "shonen", label: "⚔️ Shonen / Action" },
                  { id: "supernatural", label: "⚡ Supernatural" },
                  { id: "cartoons", label: "🎨 Cartoons Only" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setHomeShowcase(tab.id as any)}
                    className={cn(
                      "rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer",
                      homeShowcase === tab.id
                        ? "bg-brand text-white shadow-md font-extrabold"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 px-4 sm:grid-cols-3 sm:px-8 md:grid-cols-4 md:px-12 lg:grid-cols-5 xl:grid-cols-6 lg:px-16 xl:px-20">
              {showcaseItems.slice(0, 18).map((a) => (
                <PosterCard
                  key={a.slug}
                  item={toPosterItem(a)}
                  onSelect={handleOpenAnime}
                  className="w-full"
                />
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <section className="mx-4 mt-14 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 p-6 sm:p-10 backdrop-blur-xl">
              <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white sm:text-3xl">
                    Explore the Codebase & Architecture
                  </h2>
                  <p className="mt-2 max-w-lg text-xs sm:text-sm text-zinc-400">
                    See every line of Next.js 16 frontend code, Drizzle PostgreSQL schema, rotating TMDB key pool, AniList GraphQL queries, and multi-server streaming integrations.
                  </p>
                </div>
                <button
                  onClick={() => setNavTab("explorer")}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-zinc-200 active:scale-95"
                >
                  <TrendingUp className="h-4 w-4" />
                  Open Full Inspector
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* VIEW: BROWSE */}
      {navTab === "browse" && (
        <main className="mx-auto min-h-screen max-w-[92rem] px-4 pb-20 pt-28 sm:px-6 md:pb-10 lg:px-10">
          <header className="mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white sm:text-4xl">Browse Anime</h1>
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold uppercase tracking-wider text-zinc-300">
                {allAnime.length} Titles
              </span>
            </div>
            {browseGenre && (
              <p className="mt-2 text-xs text-zinc-400">
                Filtered by: <span className="font-semibold text-white">{browseGenre}</span>
              </p>
            )}
          </header>

          <BrowseFilters
            genres={genres}
            selectedGenre={browseGenre}
            selectedSort={browseSort}
            onGenreChange={setBrowseGenre}
            onSortChange={setBrowseSort}
          />

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {allAnime.map((a) => (
              <PosterCard
                key={a.slug}
                item={toPosterItem(a)}
                onSelect={handleOpenAnime}
                className="w-full"
              />
            ))}
          </div>

          {allAnime.length === 0 && (
            <p className="mt-10 rounded-2xl border border-white/5 bg-zinc-900/50 p-12 text-center text-sm text-zinc-500">
              No anime match this filter. Try a different genre or clear filters.
            </p>
          )}
        </main>
      )}

      {/* VIEW: SEARCH */}
      {navTab === "search" && (
        <SearchExperience onSelectAnime={handleOpenAnime} />
      )}

      {/* VIEW: MY LIST */}
      {navTab === "mylist" && (
        <main className="mx-auto min-h-screen max-w-[92rem] px-4 pb-20 pt-28 sm:px-6 md:pb-10 lg:px-10">
          <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-brand-soft">
                <BookmarkX className="h-3.5 w-3.5" /> Saved locally on this browser
              </p>
              <h1 className="flex items-center gap-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
                <span className="h-8 w-2 rounded-full bg-brand shadow-md" aria-hidden />
                My List
              </h1>
            </div>
            {readListItems().length > 0 && (
              <button
                onClick={() => {
                  window.localStorage.setItem(LIST_KEY, JSON.stringify([]));
                  window.location.reload();
                }}
                className="cursor-pointer text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Clear all
              </button>
            )}
          </header>

          {readListItems().length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {readListItems().map((item) => (
                <BannerCard
                  key={item.slug}
                  className="w-full"
                  onSelect={handleOpenAnime}
                  item={item}
                  onRemove={() => {
                    removeFromList(item.slug);
                    window.location.reload();
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="glass mx-auto max-w-lg rounded-3xl p-12 text-center">
              <Ghost className="mx-auto h-12 w-12 text-brand-soft/70" />
              <h2 className="mt-5 font-display text-xl font-bold text-white">Your list is empty</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Click the bookmark icon on any anime card to build your personal watchlist.
              </p>
              <button
                onClick={() => setNavTab("browse")}
                className="glow-brand mt-6 inline-block cursor-pointer rounded-full bg-brand px-6 py-3 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
              >
                Browse anime catalog
              </button>
            </div>
          )}
        </main>
      )}

      {/* VIEW: ANIME DETAIL */}
      {navTab === ("anime-detail" as any) && (
        <TitleDetailPage
          titleIdOrSlug={selectedSlug}
          onBack={handleBackToCatalog}
          onWatch={(slug, ep, s) => handleWatchAnime(slug, ep, s)}
          onNavigateTitle={(newId) => handleOpenAnime(newId)}
        />
      )}

      {/* VIEW: WATCH PLAYER */}
      {navTab === ("watch" as any) && watchBundle && (
        <main className="mx-auto max-w-[92rem] px-4 pt-20 sm:px-6 lg:px-10">
          <div className="mb-4 flex flex-wrap items-center gap-x-2 text-xs sm:text-sm">
            <button
              onClick={() => handleOpenAnime(watchBundle.series.slug)}
              className="flex cursor-pointer items-center gap-1 text-zinc-400 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              {watchBundle.series.title}
            </button>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400">Season {watchBundle.episode.season}</span>
            <span className="text-zinc-600">/</span>
            <span className="font-semibold text-white">Episode {watchBundle.episode.number}</span>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-5">
              <WatchPlayer
                embedTgvid={
                  watchBundle.series.tmdbId
                    ? watchBundle.series.type === "Movie"
                      ? `https://tgvid.lovable.app/embed/movie/${watchBundle.series.tmdbId}?color=e50914`
                      : `https://tgvid.lovable.app/embed/tv/${watchBundle.series.tmdbId}/${watchBundle.episode.season}/${watchBundle.episode.number}?color=e50914`
                    : null
                }
                embedVidsrcIcu={
                  watchBundle.series.tmdbId
                    ? `https://vidsrc.icu/embed/anime/${watchBundle.series.tmdbId}/${watchBundle.episode.absoluteNumber || watchBundle.episode.number}/0`
                    : null
                }
                embedVidsrcSbs={
                  watchBundle.series.tmdbId
                    ? `https://vidsrc.sbs/embed/tv/${watchBundle.series.tmdbId}/${watchBundle.episode.season}/${watchBundle.episode.number}`
                    : null
                }
                embedVidsrcMe={
                  watchBundle.series.tmdbId
                    ? `https://vidsrc.me/embed/tv?tmdb=${watchBundle.series.tmdbId}&season=${watchBundle.episode.season}&episode=${watchBundle.episode.number}`
                    : null
                }
                embedAutoembed={
                  watchBundle.series.tmdbId
                    ? `https://autoembed.to/tv/tmdb/${watchBundle.series.tmdbId}-${watchBundle.episode.season}-${watchBundle.episode.number}`
                    : null
                }
                demo={{
                  src: watchBundle.episode.videoUrl,
                  poster: watchBundle.episode.thumb || watchBundle.series.coverImage,
                  storageKey: `${watchBundle.series.slug}:s${watchBundle.episode.season}:e${watchBundle.episode.number}`,
                  meta: {
                    slug: watchBundle.series.slug,
                    title: watchBundle.series.title,
                    cover: watchBundle.series.coverImage,
                    season: watchBundle.episode.season,
                    ep: watchBundle.episode.number,
                    epTitle: watchBundle.episode.title,
                  },
                  onBack: () => handleOpenAnime(watchBundle.series.slug),
                  nextEpisode: watchBundle.next
                    ? () => handleWatchAnime(watchBundle.series.slug, watchBundle.next!.number, watchBundle.next!.season)
                    : undefined,
                  prevEpisode: watchBundle.prev
                    ? () => handleWatchAnime(watchBundle.series.slug, watchBundle.prev!.number, watchBundle.prev!.season)
                    : undefined,
                  hasNext: Boolean(watchBundle.next),
                  hasPrev: Boolean(watchBundle.prev),
                }}
              />

              {/* Episode metadata & actions */}
              <div className="glass rounded-2xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="font-display text-xl font-bold text-white sm:text-2xl">
                      {watchBundle.series.title}{" "}
                      <span className="text-brand-soft">
                        S{watchBundle.episode.season} E{watchBundle.episode.number}
                      </span>
                    </h1>
                    <p className="mt-1 text-sm text-zinc-400">
                      {watchBundle.episode.title}
                    </p>
                  </div>
                  <DownloadButton
                    tmdbId={watchBundle.series.tmdbId}
                    title={`${watchBundle.series.title} S${watchBundle.episode.season}E${watchBundle.episode.number}`}
                    type="tv"
                    season={watchBundle.episode.season}
                    episode={watchBundle.episode.number}
                  />
                </div>

                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-zinc-400">
                  {watchBundle.episode.overview}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" />
                    {formatDuration(watchBundle.episode.duration)}
                  </span>
                  <span className="rounded border border-white/10 px-2 py-0.5 font-mono">
                    Multi-Audio (Sub / Hindi Dub)
                  </span>
                </div>

                {/* Next / Prev buttons */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {watchBundle.prev ? (
                    <button
                      onClick={() =>
                        handleWatchAnime(
                          watchBundle.series.slug,
                          watchBundle.prev!.number,
                          watchBundle.prev!.season
                        )
                      }
                      className="glass flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm text-zinc-200 hover:border-white/30"
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous episode
                    </button>
                  ) : null}

                  {watchBundle.next ? (
                    <button
                      onClick={() =>
                        handleWatchAnime(
                          watchBundle.series.slug,
                          watchBundle.next!.number,
                          watchBundle.next!.season
                        )
                      }
                      className="flex cursor-pointer items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-brand-deep"
                    >
                      Next episode <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <span className="glass rounded-full px-5 py-2.5 text-xs sm:text-sm text-zinc-500">
                      You're all caught up!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Episode Sidebar Navigator */}
            <EpisodeNav
              slug={watchBundle.series.slug}
              cover={watchBundle.series.coverImage}
              title={watchBundle.series.title}
              current={watchBundle.episode.number}
              currentSeason={watchBundle.episode.season}
              seasons={watchBundle.seasons}
              episodes={watchBundle.episodes}
              onSelectEpisode={(s, ep) => handleWatchAnime(watchBundle.series.slug, ep, s)}
              onSelectSeason={(s) => handleWatchAnime(watchBundle.series.slug, 1, s)}
            />
          </div>
        </main>
      )}

      {/* VIEW: FULL CODEBASE & ARCHITECTURE EXPLORER */}
      {navTab === "explorer" && (
        <CodeExplorer onSelectAnime={handleOpenAnime} />
      )}

      {/* Footer */}
      <Footer
        onSelectGenre={handleGenrePick}
        onOpenExplorer={() => {
          setNavTab("explorer");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={navTab} onTabChange={setNavTab} />
    </div>
  );
}
