import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  ArrowUpDown,
  Bookmark,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Film,
  Play,
  PlayCircle,
  Plus,
  Search,
  Share2,
  Sparkles,
  Star,
  Tv,
  X,
} from "lucide-react";
import {
  getShow,
  getMovie,
  getSeason,
  getTitleLogo,
  getAggregateCredits,
  getVideos,
  getRecommendations,
  getShowStills,
  searchTmdb,
  tmdbImage,
} from "../lib/tmdb";
import { findAnime } from "../lib/dataStore";
import { resolveAllSeasons } from "../lib/animeSeasonsData";
import {
  DEMON_SLAYER_DETAILS,
  DEMON_SLAYER_SEASONS,
  DEMON_SLAYER_EPISODES,
  DEMON_SLAYER_CAST,
  DEMON_SLAYER_RECS,
  DEMON_SLAYER_TRAILER,
} from "../lib/demonSlayerData";
import { isListed, toggleListItem, type ListItem } from "../lib/progress";
import { VIDEOS } from "../lib/catalog";

export interface TitleDetailPageProps {
  titleIdOrSlug: string;
  onBack: () => void;
  onWatch: (slug: string, ep: number, season: number) => void;
  onNavigateTitle: (idOrSlug: string) => void;
}

export default function TitleDetailPage({
  titleIdOrSlug,
  onBack,
  onWatch,
  onNavigateTitle,
}: TitleDetailPageProps) {
  // Find anime in catalog by slug, id, or TMDB id
  const catalogItem = findAnime(titleIdOrSlug);

  const isDemonSlayer =
    titleIdOrSlug === "tv-85937" ||
    titleIdOrSlug === "85937" ||
    titleIdOrSlug === "demon-slayer-kimetsu-no-yaiba" ||
    catalogItem?.slug === "demon-slayer-kimetsu-no-yaiba";

  const isMovie = catalogItem?.type === "Movie" || titleIdOrSlug.startsWith("movie-");

  const [resolvedId, setResolvedId] = useState<number>(() => {
    if (catalogItem?.tmdbId) return catalogItem.tmdbId;
    if (isDemonSlayer) return 85937;
    const num = parseInt(titleIdOrSlug.replace(/^(tv|movie)-?/, ""), 10);
    return isNaN(num) ? 0 : num;
  });

  const parsedId = resolvedId || catalogItem?.tmdbId || (isDemonSlayer ? 85937 : 0);

  // Title Details state - initialize immediately with the clicked anime!
  const initialData = catalogItem || (isDemonSlayer ? DEMON_SLAYER_DETAILS : null);
  const [details, setDetails] = useState<any>(initialData);
  const [logoUrl, setLogoUrl] = useState<string | null>(
    catalogItem?.logoImage || (catalogItem as any)?.logo || (isDemonSlayer ? DEMON_SLAYER_DETAILS.logoImage : null)
  );
  const [trailerKey, setTrailerKey] = useState<string | null>(
    isDemonSlayer ? DEMON_SLAYER_TRAILER : null
  );

  // Initialize ALL seasons for this anime immediately from canonical presets or catalog
  const [seasons, setSeasons] = useState<any[]>(() => {
    if (isMovie) return [];
    if (isDemonSlayer) return DEMON_SLAYER_SEASONS;
    const resolved = resolveAllSeasons(catalogItem?.slug || titleIdOrSlug || catalogItem?.tmdbId || "");
    if (resolved && resolved.length > 0) {
      return resolved.map((sn) => ({
        number: sn.number,
        name: sn.name,
        episodeCount: sn.episodeCount,
        poster: sn.poster || catalogItem?.posterImage || "",
        year: sn.year || catalogItem?.year || 2024,
      }));
    }
    return [];
  });
  const [activeSeason, setActiveSeason] = useState<number>(1);
  const [seasonEpisodes, setSeasonEpisodes] = useState<Record<number, any[]>>(() => {
    const init: Record<number, any[]> = {};
    if (isDemonSlayer) {
      init[1] = DEMON_SLAYER_EPISODES.filter((e) => e.season === 1);
      init[2] = DEMON_SLAYER_EPISODES.filter((e) => e.season === 2);
      init[3] = DEMON_SLAYER_EPISODES.filter((e) => e.season === 3);
      init[4] = DEMON_SLAYER_EPISODES.filter((e) => e.season === 4);
      init[5] = DEMON_SLAYER_EPISODES.filter((e) => e.season === 5);
    }
    return init;
  });
  const [cast, setCast] = useState<any[]>(isDemonSlayer ? DEMON_SLAYER_CAST : []);
  const [recs, setRecs] = useState<any[]>(isDemonSlayer ? DEMON_SLAYER_RECS : []);
  const [showStills, setShowStills] = useState<string[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"oldest" | "newest">("oldest");
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [selectedDownloadEp, setSelectedDownloadEp] = useState<any | null>(null);
  const [isMyList, setIsMyList] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Reset and sync state when titleIdOrSlug changes!
  useEffect(() => {
    setActiveSeason(1);
    setSearchQuery("");
    setShowStills([]);
    const item = findAnime(titleIdOrSlug);
    if (item) {
      setDetails(item);
      setLogoUrl(item.logoImage || (item as any).logo || null);
      setResolvedId(item.tmdbId || item.id);
      setSeasonEpisodes({});
      setCast([]);
      setRecs([]);
      setTrailerKey(null);
      if (item.type !== "Movie") {
        const itemSeasons = resolveAllSeasons(item.slug || item.tmdbId || item.id);
        setSeasons(
          itemSeasons.map((sn) => ({
            number: sn.number,
            name: sn.name,
            episodeCount: sn.episodeCount,
            poster: sn.poster || item.posterImage,
            year: sn.year || item.year,
          }))
        );
      } else {
        setSeasons([]);
      }
    } else if (
      titleIdOrSlug === "tv-85937" ||
      titleIdOrSlug === "85937" ||
      titleIdOrSlug === "demon-slayer-kimetsu-no-yaiba"
    ) {
      setDetails(DEMON_SLAYER_DETAILS);
      setLogoUrl(DEMON_SLAYER_DETAILS.logoImage);
      setResolvedId(85937);
      setTrailerKey(DEMON_SLAYER_TRAILER);
      setSeasons(DEMON_SLAYER_SEASONS);
      const init: Record<number, any[]> = {};
      init[1] = DEMON_SLAYER_EPISODES.filter((e) => e.season === 1);
      init[2] = DEMON_SLAYER_EPISODES.filter((e) => e.season === 2);
      init[3] = DEMON_SLAYER_EPISODES.filter((e) => e.season === 3);
      init[4] = DEMON_SLAYER_EPISODES.filter((e) => e.season === 4);
      init[5] = DEMON_SLAYER_EPISODES.filter((e) => e.season === 5);
      setSeasonEpisodes(init);
      setCast(DEMON_SLAYER_CAST);
      setRecs(DEMON_SLAYER_RECS);
    } else {
      const num = parseInt(titleIdOrSlug.replace(/^(tv|movie)-?/, ""), 10);
      setResolvedId(isNaN(num) ? 0 : num);
      setSeasonEpisodes({});
      setCast([]);
      setRecs([]);
      setTrailerKey(null);
      if (!titleIdOrSlug.startsWith("movie-")) {
        const itemSeasons = resolveAllSeasons(titleIdOrSlug);
        setSeasons(
          itemSeasons.map((sn) => ({
            number: sn.number,
            name: sn.name,
            episodeCount: sn.episodeCount,
            poster: sn.poster || "",
            year: sn.year || 2024,
          }))
        );
      } else {
        setSeasons([]);
      }
    }
  }, [titleIdOrSlug]);

  // Sync My List state
  useEffect(() => {
    const slug = details?.slug || (catalogItem ? catalogItem.slug : `tv-${parsedId}`);
    setIsMyList(isListed(slug));
  }, [details, parsedId, catalogItem]);

  // Load show details from TMDB
  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        let targetId = parsedId;
        if (!targetId && titleIdOrSlug) {
          try {
            const results = await searchTmdb(titleIdOrSlug.replace(/-/g, " "));
            const match = results.find((r) => r.poster_path || r.backdrop_path) || results[0];
            if (match && match.id) {
              targetId = match.id;
              if (active) setResolvedId(targetId);
            }
          } catch {}
        }

        if (!targetId) return;

        if (isMovie) {
          const m = await getMovie(targetId);
          if (!active) return;
          setDetails({
            id: m.id,
            tmdbId: m.id,
            slug: catalogItem?.slug || `movie-${m.id}`,
            title: m.title,
            japaneseTitle: m.original_title,
            tagline: m.tagline,
            synopsis: m.overview,
            coverImage: tmdbImage(m.backdrop_path, "w1280"),
            posterImage: tmdbImage(m.poster_path, "w500"),
            rating: m.vote_average,
            year: m.release_date ? new Date(m.release_date).getFullYear() : 2024,
            status: m.status,
            type: "Movie",
            studio: m.production_companies?.[0]?.name || "Movie Studio",
            genres: m.genres?.map((g) => g.name) || ["Animation", "Action"],
            totalSeasons: 1,
            totalEpisodes: 1,
          });
        } else {
          // TV show
          const s = await getShow(targetId);
          if (!active) return;
          const validSeasons = (s.seasons || [])
            .filter((sn) => sn.season_number > 0)
            .map((sn) => ({
              number: sn.season_number,
              name: sn.name,
              episodeCount: sn.episode_count,
              poster: sn.poster_path ? tmdbImage(sn.poster_path, "w500") : "",
              year: sn.air_date ? new Date(sn.air_date).getFullYear() : 2020,
            }));

          const resolvedSeasons = resolveAllSeasons(
            catalogItem?.slug || titleIdOrSlug || catalogItem?.tmdbId || s.id,
            validSeasons
          );

          // Select the most complete season list
          const finalSeasons =
            validSeasons.length > resolvedSeasons.length ? validSeasons : resolvedSeasons;

          setDetails({
            id: s.id,
            tmdbId: s.id,
            slug: catalogItem?.slug || (isDemonSlayer ? "demon-slayer-kimetsu-no-yaiba" : `tv-${s.id}`),
            title: s.name,
            japaneseTitle: s.original_name,
            tagline: s.tagline || (isDemonSlayer ? "It is the Taisho Period in Japan..." : ""),
            synopsis: s.overview,
            coverImage: tmdbImage(s.backdrop_path, "w1280"),
            posterImage: tmdbImage(s.poster_path, "w500"),
            rating: s.vote_average,
            year: s.first_air_date ? new Date(s.first_air_date).getFullYear() : 2019,
            status: s.status,
            type: "TV",
            studio: s.production_companies?.[0]?.name || s.networks?.[0]?.name || "Anime Studio",
            genres: s.genres?.map((g) => g.name) || ["Animation", "Action & Adventure", "Fantasy"],
            totalSeasons: finalSeasons.length,
            totalEpisodes: s.number_of_episodes || finalSeasons.reduce((acc: number, curr: any) => acc + (curr.episodeCount || 12), 0),
          });

          if (finalSeasons.length > 0) {
            setSeasons(
              finalSeasons.map((sn: any) => ({
                number: sn.number,
                name: sn.name,
                episodeCount: sn.episodeCount || sn.episode_count || 12,
                poster: sn.poster || (sn.poster_path ? tmdbImage(sn.poster_path, "w500") : s.poster_path ? tmdbImage(s.poster_path, "w500") : ""),
                year: sn.year || (sn.air_date ? new Date(sn.air_date).getFullYear() : 2024),
              }))
            );
          }
        }

        // Fetch transparent PNG title logo (text without background)
        const logo = await getTitleLogo(targetId, isMovie ? "movie" : "tv");
        if (active && logo) {
          setLogoUrl(logo);
        }

        // Fetch trailer
        const ytTrailer = await getVideos(targetId, isMovie ? "movie" : "tv");
        if (active && ytTrailer) {
          setTrailerKey(ytTrailer);
        }

        // Fetch cast
        const credits = await getAggregateCredits(targetId, isMovie ? "movie" : "tv");
        if (active && credits.cast && credits.cast.length > 0) {
          setCast(
            credits.cast.slice(0, 14).map((c) => ({
              name: c.name,
              character: c.roles?.[0]?.character || c.character || "Voice Cast",
              profile: c.profile_path ? tmdbImage(c.profile_path, "w276_and_h350_face") : "",
            }))
          );
        }

        // Fetch recommendations
        const recResults = await getRecommendations(targetId, isMovie ? "movie" : "tv");
        if (active && recResults.length > 0) {
          setRecs(
            recResults.slice(0, 12).map((r) => ({
              id: r.id,
              title: r.name || r.title,
              poster: tmdbImage(r.poster_path, "w500"),
              backdrop: tmdbImage(r.backdrop_path, "w1280"),
              rating: r.vote_average,
              year: (r.first_air_date || r.release_date || "").slice(0, 4),
              type: r.media_type === "movie" ? "movie" : "tv",
            }))
          );
        }

        // Fetch real video stills and backdrops for this anime
        const videoStills = await getShowStills(targetId, isMovie ? "movie" : "tv");
        if (active && videoStills && videoStills.length > 0) {
          setShowStills(videoStills);
        }
      } catch (err) {
        console.warn("Failed to load TMDB show details:", err);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [parsedId, isMovie, isDemonSlayer, titleIdOrSlug]);

  // Load episodes for active season with REAL video frame stills
  useEffect(() => {
    if (isMovie || !parsedId) return;
    if (seasonEpisodes[activeSeason] && seasonEpisodes[activeSeason].length > 0) {
      return; // Already cached
    }

    let active = true;
    setLoadingEpisodes(true);

    getSeason(parsedId, activeSeason)
      .then(async (data) => {
        if (!active) return;
        let eps = (data.episodes || []).map((ep, idx) => ({
          season: activeSeason,
          number: ep.episode_number,
          title: ep.name || `Episode ${ep.episode_number}`,
          overview: ep.overview || `Watch Episode ${ep.episode_number} of ${details?.title || catalogItem?.title || "this series"} in high definition.`,
          still: ep.still_path
            ? tmdbImage(ep.still_path, "w500")
            : (showStills[idx % Math.max(showStills.length, 1)] || details?.coverImage || catalogItem?.coverImage || ""),
          air_date: (ep as any).air_date || "",
          runtime: ep.runtime || 25,
        }));

        // If Season 2+ returned 0 episodes, check if Season 1 contains subsequent episodes (e.g. JJK where all 47 eps are in Season 1)
        if (eps.length === 0 && activeSeason > 1) {
          try {
            const s1 = await getSeason(parsedId, 1);
            if (s1.episodes && s1.episodes.length > 20) {
              const startIdx = (activeSeason - 1) * 24;
              const sliced = s1.episodes.slice(startIdx, startIdx + 26);
              if (sliced.length > 0) {
                eps = sliced.map((ep, idx) => ({
                  season: activeSeason,
                  number: idx + 1,
                  title: ep.name || `Episode ${idx + 1}`,
                  overview: ep.overview || `Watch Episode ${idx + 1} in full HD.`,
                  still: ep.still_path
                    ? tmdbImage(ep.still_path, "w500")
                    : (showStills[idx % Math.max(showStills.length, 1)] || details?.coverImage || ""),
                  air_date: (ep as any).air_date || "",
                  runtime: ep.runtime || 25,
                }));
              }
            }
          } catch {}
        }

        if (eps.length > 0) {
          setSeasonEpisodes((prev) => ({ ...prev, [activeSeason]: eps }));
        } else {
          // Fallback if no episodes from API
          const targetSeason = seasons.find((sn) => sn.number === activeSeason);
          const epCount = targetSeason?.episodeCount || 12;
          const seasonName = targetSeason?.name || `Season ${activeSeason}`;
          const fallbackEps = Array.from({ length: epCount }, (_, idx) => ({
            season: activeSeason,
            number: idx + 1,
            title: `${seasonName} - Episode ${idx + 1}`,
            overview: `Watch Season ${activeSeason} Episode ${idx + 1} of ${details?.title || catalogItem?.title || "this series"} in high definition.`,
            still: showStills[idx % Math.max(showStills.length, 1)] || details?.coverImage || catalogItem?.coverImage || "",
            air_date: "",
            runtime: 25,
          }));
          setSeasonEpisodes((prev) => ({ ...prev, [activeSeason]: fallbackEps }));
        }
        setLoadingEpisodes(false);
      })
      .catch(async (err) => {
        console.warn(`Could not load season ${activeSeason} episodes:`, err);
        if (!active) return;

        // Try checking Season 1 for Season 2+ episodes
        if (activeSeason > 1) {
          try {
            const s1 = await getSeason(parsedId, 1);
            if (s1.episodes && s1.episodes.length > 20) {
              const startIdx = (activeSeason - 1) * 24;
              const sliced = s1.episodes.slice(startIdx, startIdx + 26);
              if (sliced.length > 0) {
                const eps = sliced.map((ep, idx) => ({
                  season: activeSeason,
                  number: idx + 1,
                  title: ep.name || `Episode ${idx + 1}`,
                  overview: ep.overview || `Watch Episode ${idx + 1} in full HD.`,
                  still: ep.still_path
                    ? tmdbImage(ep.still_path, "w500")
                    : (showStills[idx % Math.max(showStills.length, 1)] || details?.coverImage || ""),
                  air_date: (ep as any).air_date || "",
                  runtime: ep.runtime || 25,
                }));
                setSeasonEpisodes((prev) => ({ ...prev, [activeSeason]: eps }));
                setLoadingEpisodes(false);
                return;
              }
            }
          } catch {}
        }

        const targetSeason = seasons.find((sn) => sn.number === activeSeason);
        const epCount = targetSeason?.episodeCount || 12;
        const seasonName = targetSeason?.name || `Season ${activeSeason}`;
        const fallbackEps = Array.from({ length: epCount }, (_, idx) => ({
          season: activeSeason,
          number: idx + 1,
          title: `${seasonName} - Episode ${idx + 1}`,
          overview: `Watch Season ${activeSeason} Episode ${idx + 1} of ${details?.title || catalogItem?.title || "this series"} in high definition.`,
          still: showStills[idx % Math.max(showStills.length, 1)] || details?.coverImage || catalogItem?.coverImage || "",
          air_date: "",
          runtime: 25,
        }));
        setSeasonEpisodes((prev) => ({ ...prev, [activeSeason]: fallbackEps }));
        setLoadingEpisodes(false);
      });

    return () => {
      active = false;
    };
  }, [parsedId, activeSeason, isMovie, details?.title, catalogItem?.title, showStills]);

  // Filter and sort episodes
  const displayedEpisodes = useMemo(() => {
    const list = seasonEpisodes[activeSeason] || [];
    let filtered = list;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.overview.toLowerCase().includes(q) ||
          `ep ${e.number}`.includes(q) ||
          `episode ${e.number}`.includes(q)
      );
    }
    return sortOrder === "newest" ? [...filtered].reverse() : filtered;
  }, [seasonEpisodes, activeSeason, searchQuery, sortOrder]);

  const handleToggleList = () => {
    if (!details) return;
    const listItem: ListItem = {
      slug: details.slug,
      title: details.title,
      cover: details.posterImage || details.coverImage,
      year: details.year,
      rating: details.rating,
      type: details.type,
      totalEpisodes: details.totalEpisodes,
      genres: details.genres,
    };
    const newState = toggleListItem(listItem);
    setIsMyList(newState);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: details?.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const handleStartWatch = (epNumber = 1, seasonNum = activeSeason) => {
    const slug = catalogItem?.slug || details?.slug || titleIdOrSlug;
    onWatch(slug, epNumber, seasonNum);
  };

  const currentSeasonData = seasons.find((s) => s.number === activeSeason) || seasons[0];

  return (
    <div className="min-h-screen bg-[#09090b] text-[#e4e4e7] selection:bg-brand selection:text-white pb-24">
      {/* Top Header / Back Nav */}
      <div className="sticky top-0 z-40 bg-[#09090b]/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs sm:text-sm font-bold text-white transition active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
            {isMovie ? `movie-${parsedId}` : `tv-${parsedId}`}
          </span>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-bold text-zinc-300 transition active:scale-95 cursor-pointer"
          >
            {shareCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Hero & Backdrop Section */}
      <section className="relative w-full overflow-hidden">
        {/* Backdrop Image with Multi-directional Gradients */}
        <div className="relative h-[48vh] sm:h-[60vh] md:h-[72vh] w-full overflow-hidden bg-black">
          {details?.coverImage && (
            <img
              src={details.coverImage}
              alt={details.title}
              className="w-full h-full object-cover object-[center_20%] animate-kenburns opacity-75"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://image.tmdb.org/t/p/w1280/3GQKYh6Trm8pxd2AypovoYQf4Ay.jpg";
              }}
            />
          )}
          {/* Gradients matching anymovie.ai.studio */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/90 via-[#09090b]/50 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-[#09090b]/40 to-[#09090b]" />
        </div>

        {/* Hero Content Overlay */}
        <div className="container mx-auto max-w-7xl -mt-36 sm:-mt-52 md:-mt-64 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-end">
            {/* Poster Card */}
            <div className="w-36 xs:w-44 sm:w-56 md:w-64 shrink-0 rounded-2xl overflow-hidden border border-white/15 bg-zinc-900 shadow-2xl ring-1 ring-white/10 group relative">
              <div className="aspect-[2/3] w-full overflow-hidden bg-zinc-950">
                <img
                  src={details?.posterImage || details?.coverImage}
                  alt={details?.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg";
                  }}
                />
              </div>
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-black text-amber-400 flex items-center gap-1 shadow-md">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{details ? Number(details.rating).toFixed(1) : "8.7"}</span>
              </div>
            </div>

            {/* Title & Info */}
            <div className="flex-1 flex flex-col justify-end space-y-3 pt-2">
              {/* Upper Fetched Logo Name (or text title fallback if no logo available) */}
              {logoUrl ? (
                <div className="mb-3">
                  <img
                    src={logoUrl}
                    alt={details?.title || "Anime Title"}
                    className="max-h-24 sm:max-h-36 md:max-h-44 max-w-[300px] sm:max-w-[480px] md:max-w-[580px] object-contain object-left drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)] select-none"
                    onError={() => setLogoUrl(null)}
                  />
                </div>
              ) : (
                /* Fallback only if upper logo is not available */
                <div className="flex flex-wrap items-baseline gap-3">
                  <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                    {details?.title || "Demon Slayer: Kimetsu no Yaiba"}
                  </h1>
                  {details?.japaneseTitle && (
                    <span className="px-2.5 py-0.5 rounded-md bg-white/10 border border-white/15 text-xs font-bold text-zinc-300 backdrop-blur-sm">
                      {details.japaneseTitle}
                    </span>
                  )}
                </div>
              )}

              {/* Tagline */}
              {details?.tagline && (
                <p className="text-xs sm:text-sm font-semibold italic text-zinc-300 drop-shadow max-w-2xl">
                  "{details.tagline}"
                </p>
              )}

              {/* Metadata Badges Row */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-300 pt-1">
                <span className="px-2.5 py-0.5 rounded-md bg-brand/20 border border-brand/50 text-brand-soft text-[11px] font-extrabold uppercase tracking-wider">
                  {isMovie ? "Movie" : "TV Show"}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-[11px] font-bold">
                  {details?.year || 2019}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-extrabold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {details ? Number(details.rating).toFixed(1) : "8.7"} ★
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-white text-[11px] font-bold">
                  HD · 1080p
                </span>
                {!isMovie && (
                  <>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-[11px] font-bold">
                      {seasons.length || 5} Seasons
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-[11px] font-bold">
                      {details?.totalEpisodes || 63} Episodes
                    </span>
                  </>
                )}
                {details?.studio && (
                  <span className="px-2 py-0.5 rounded-md bg-brand-soft/10 border border-brand-soft/30 text-brand-soft text-[11px] font-bold">
                    {details.studio}
                  </span>
                )}
                {details?.genres?.map((g: string) => (
                  <span
                    key={g}
                    className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-400 text-[11px]"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Synopsis */}
              <p className="text-xs sm:text-sm font-normal text-zinc-300/90 leading-relaxed max-w-3xl pt-1">
                {details?.synopsis ||
                  "Tanjiro Kamado, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon. To make matters worse, his younger sister Nezuko, the sole survivor, has been transformed into a demon herself. Tanjiro resolves to become a demon slayer."}
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                {/* Watch Now */}
                <button
                  onClick={() => handleStartWatch(1, activeSeason)}
                  className="px-6 py-3 rounded-xl bg-brand hover:bg-brand-deep text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-lg shadow-brand/30 hover:shadow-brand/50 transition active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Watch Now</span>
                </button>

                {/* Watch Trailer */}
                {trailerKey && (
                  <button
                    onClick={() => setIsTrailerOpen(true)}
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition active:scale-95 cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4 text-amber-400" />
                    <span>Trailer</span>
                  </button>
                )}

                {/* My List */}
                <button
                  onClick={handleToggleList}
                  aria-pressed={isMyList}
                  className={`px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2 transition active:scale-95 cursor-pointer ${
                    isMyList
                      ? "bg-brand border-brand text-white shadow-md shadow-brand/20"
                      : "bg-white/5 hover:bg-white/15 border-white/15 text-zinc-200"
                  }`}
                >
                  {isMyList ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>In List</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>My List</span>
                    </>
                  )}
                </button>

                {/* Download */}
                <button
                  onClick={() => {
                    setSelectedDownloadEp(
                      seasonEpisodes[activeSeason]?.[0] || {
                        number: 1,
                        season: activeSeason,
                        title: details?.title,
                      }
                    );
                    setIsDownloadOpen(true);
                  }}
                  className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-zinc-200 text-xs sm:text-sm font-bold flex items-center gap-2 transition active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEASONS SELECTOR (Horizontal Cards) */}
      {!isMovie && seasons.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-14">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-5 sm:h-6 bg-white rounded-full inline-block shrink-0" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Seasons
              </h2>
            </div>
            <span className="text-xs font-semibold text-zinc-400">
              {seasons.length} {seasons.length === 1 ? "Season" : "Seasons"}
            </span>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3 pt-1">
            {seasons.map((s) => {
              const isActive = s.number === activeSeason;
              return (
                <div
                  key={s.number}
                  onClick={() => {
                    setActiveSeason(s.number);
                    setSearchQuery("");
                  }}
                  className={`relative shrink-0 w-32 xs:w-36 sm:w-44 md:w-48 aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group ${
                    isActive
                      ? "border-2 border-white ring-2 ring-white/20 scale-[1.02] shadow-2xl z-10"
                      : "border border-white/10 opacity-75 hover:opacity-100 hover:scale-[1.01]"
                  }`}
                >
                  <img
                    src={s.poster || details?.posterImage || details?.coverImage}
                    alt={s.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        details?.posterImage ||
                        "https://image.tmdb.org/t/p/w500/bV0ZCL0IqrTQKClu6EtXlZaJevD.jpg";
                    }}
                  />

                  {/* Episode Count Tag */}
                  <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-bold text-white shadow-md">
                    {s.episodeCount} Eps
                  </div>

                  {/* Season Title Bottom Overlay */}
                  <div className="absolute inset-x-0 bottom-0 pt-10 pb-3 px-3 bg-gradient-to-t from-black via-black/80 to-transparent flex items-end">
                    <span className="text-xs sm:text-sm font-extrabold text-white leading-tight drop-shadow-md truncate">
                      {s.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* EPISODES SECTION */}
      {!isMovie && (
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-5 sm:h-6 bg-brand rounded-full inline-block shrink-0" />
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Episodes · Season {activeSeason} ({currentSeasonData?.name || `Season ${activeSeason}`})
              </h3>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              {/* Sort Order Button */}
              <button
                type="button"
                onClick={() => setSortOrder((v) => (v === "oldest" ? "newest" : "oldest"))}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-200 flex items-center gap-1.5 transition active:scale-95 cursor-pointer shrink-0"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                <span>{sortOrder === "oldest" ? "Oldest first" : "Newest first"}</span>
              </button>

              {/* Search Episodes Bar */}
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${seasonEpisodes[activeSeason]?.length || 0} episodes...`}
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition"
                />
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Episode Cards Grid */}
          {loadingEpisodes ? (
            <div className="py-20 flex flex-col items-center justify-center text-zinc-400 bg-zinc-900/30 rounded-2xl border border-zinc-800/60 mt-4">
              <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin mb-3" />
              <p className="text-xs font-semibold">Loading Season {activeSeason} Episodes...</p>
            </div>
          ) : displayedEpisodes.length === 0 ? (
            <div className="py-16 text-center text-zinc-400 bg-zinc-900/30 rounded-2xl border border-zinc-800/60 mt-4">
              <p className="text-sm">
                {searchQuery
                  ? `No episodes found matching "${searchQuery}".`
                  : `No episodes available for Season ${activeSeason}.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {displayedEpisodes.map((ep) => {
                const epStill =
                  ep.still || details?.coverImage || "https://image.tmdb.org/t/p/w1280/3GQKYh6Trm8pxd2AypovoYQf4Ay.jpg";

                return (
                  <div
                    key={`${ep.season}-${ep.number}`}
                    onClick={() => handleStartWatch(ep.number, ep.season)}
                    className="group relative flex flex-col justify-between rounded-2xl bg-[#121214] hover:bg-[#18181b] border border-zinc-800/80 hover:border-zinc-700/80 overflow-hidden transition-all duration-200 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-0.5"
                  >
                    {/* Episode Video Frame Thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                      <img
                        src={epStill}
                        alt={`EP ${ep.number} - ${ep.title}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            details?.coverImage ||
                            "https://image.tmdb.org/t/p/w1280/3GQKYh6Trm8pxd2AypovoYQf4Ay.jpg";
                        }}
                      />

                      {/* Top Left: EP Badge */}
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-black text-white tracking-wide shadow-md">
                        EP {ep.number}
                      </div>

                      {/* Bottom Right: Duration Badge */}
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-bold text-white shadow-md">
                        {ep.runtime || 25}m
                      </div>

                      {/* Play overlay on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-11 h-11 rounded-full bg-brand text-white flex items-center justify-center shadow-xl shadow-brand/40 scale-90 group-hover:scale-100 transition-transform">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-3.5 flex flex-col justify-between flex-1">
                      <div>
                        <h4 className="text-sm font-extrabold text-white group-hover:text-brand-soft transition-colors truncate">
                          {ep.title}
                        </h4>
                        <p className="text-xs text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed font-normal">
                          {ep.overview || `Watch Episode ${ep.number} of ${details?.title || "this series"} in high definition.`}
                        </p>
                      </div>

                      {/* Footer Row: Air Date + Download Icon */}
                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-800/60 text-xs text-zinc-500 font-medium">
                        <span>{ep.air_date ? `Aired ${ep.air_date}` : `Season ${ep.season}`}</span>
                        <button
                          type="button"
                          title="Download episode"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDownloadEp(ep);
                            setIsDownloadOpen(true);
                          }}
                          className="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* VOICE CAST SECTION */}
      {cast.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-14">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-1.5 h-5 sm:h-6 bg-white rounded-full inline-block shrink-0" />
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Voice Cast & Characters
            </h3>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3 pt-1">
            {cast.map((actor, idx) => (
              <div
                key={`${actor.name}-${idx}`}
                className="w-28 xs:w-32 sm:w-36 shrink-0 flex flex-col rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 group hover:border-zinc-700 transition"
              >
                <div className="aspect-[3/4] w-full overflow-hidden bg-zinc-950">
                  <img
                    src={actor.profile}
                    alt={actor.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";
                    }}
                  />
                </div>
                <div className="p-2.5 flex flex-col justify-center">
                  <p className="text-xs font-bold text-white truncate">{actor.name}</p>
                  <p className="text-[10px] text-zinc-400 truncate mt-0.5">{actor.character}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MORE LIKE THIS / RECOMMENDATIONS */}
      {recs.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-14">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-5 sm:h-6 bg-white rounded-full inline-block shrink-0" />
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                You May Also Like
              </h3>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3 pt-1">
            {recs.map((rec) => (
              <div
                key={rec.id}
                onClick={() => {
                  onNavigateTitle(`tv-${rec.id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-32 xs:w-36 sm:w-44 shrink-0 flex flex-col rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition group cursor-pointer hover:-translate-y-1 duration-200"
              >
                <div className="aspect-[2/3] w-full overflow-hidden bg-zinc-950 relative">
                  <img
                    src={rec.poster || rec.backdrop}
                    alt={rec.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg";
                    }}
                  />
                  {rec.rating && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-white/10 text-[10px] font-bold text-amber-400 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span>{Number(rec.rating).toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <div className="p-2.5 flex flex-col">
                  <p className="text-xs font-bold text-white truncate group-hover:text-brand-soft">
                    {rec.title}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{rec.year || "Anime"}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* YOUTUBE TRAILER MODAL */}
      {isTrailerOpen && trailerKey && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl">
            <button
              onClick={() => setIsTrailerOpen(false)}
              className="absolute top-3 right-3 z-50 p-2 rounded-full bg-black/80 hover:bg-zinc-800 text-white transition cursor-pointer border border-white/20"
              title="Close Trailer"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
              title={`${details?.title} Trailer`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* DOWNLOAD MODAL */}
      {isDownloadOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-brand" />
                <h3 className="text-base font-extrabold text-white">Download Episode</h3>
              </div>
              <button
                onClick={() => setIsDownloadOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="text-xs text-zinc-400">
                {details?.title} · Season {selectedDownloadEp?.season || activeSeason} Episode{" "}
                {selectedDownloadEp?.number || 1}
              </p>
              <h4 className="text-sm font-bold text-white mt-0.5 truncate">
                {selectedDownloadEp?.title || "Episode"}
              </h4>
            </div>

            <div className="space-y-2.5">
              {[
                { res: "1080p Ultra HD", size: "1.2 GB", speed: "Best Quality • 60fps" },
                { res: "720p HD", size: "650 MB", speed: "Recommended" },
                { res: "480p SD", size: "320 MB", speed: "Data Saver" },
              ].map((q) => (
                <button
                  key={q.res}
                  onClick={() => {
                    const sampleVideo = VIDEOS[0];
                    const a = document.createElement("a");
                    a.href = sampleVideo;
                    a.download = `${details?.title || "Anime"}_S${
                      selectedDownloadEp?.season || activeSeason
                    }E${selectedDownloadEp?.number || 1}_${q.res.split(" ")[0]}.mp4`;
                    a.target = "_blank";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setIsDownloadOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-left transition group cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-brand-soft">
                      {q.res}
                    </p>
                    <p className="text-[10px] text-zinc-400">{q.speed}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-300">{q.size}</span>
                </button>
              ))}
            </div>

            <p className="text-[10px] text-zinc-500 text-center">
              Direct high-speed CDN download. Subtitles included.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
