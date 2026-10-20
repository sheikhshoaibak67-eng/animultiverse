import { initialCatalog, cartoonsCatalog, VIDEOS, DURATIONS } from "./catalog";
import type { AnimeItem, SeasonItem, EpisodeItem, CastItem, AnimeBundle, EpisodeBundle } from "./types";
import { getEpisodeOverview } from "./copy";
import {
  discoverAnime,
  getShow,
  getSeason,
  getTitleLogo,
  getAggregateCredits,
  tmdbImage,
} from "./tmdb";

export const CARTOON_KEYWORDS = [
  "doraemon", "shin-chan", "shinchan", "anpanman", "maruko", "sazae", "peppa",
  "ben 10", "ben-10", "avatar", "tom and jerry", "tom-and-jerry", "mickey", "disney", "pixar",
  "sponge", "paw patrol", "simpsons", "family guy", "futurama", "rick and morty", "rick-and-morty",
  "south park", "adventure time", "adventure-time", "regular show", "gumball", "teen titans",
  "teen-titans", "batman", "spider-man", "invincible", "arcane", "gravity falls",
  "phineas", "scooby", "looney tunes", "courage the cowardly dog", "dexter", "powerpuff",
  "chhota bheem", "motu patlu", "oggy"
];

export function isCartoon(item: { title: string; slug: string; genres?: string[]; category?: string }): boolean {
  if (item.category === "cartoon") return true;
  const s = item.slug.toLowerCase();
  const t = item.title.toLowerCase();
  return CARTOON_KEYWORDS.some((kw) => s.includes(kw) || t.includes(kw));
}

const allSeed = [
  ...initialCatalog.map((s) => ({ ...s, category: "anime" as const })),
  ...cartoonsCatalog.map((s) => ({ ...s, category: "cartoon" as const })),
];

// In-memory data store for the application
export let animeList: AnimeItem[] = allSeed.map((s) => ({
  id: s.id,
  tmdbId: s.tmdbId,
  anilistId: s.anilistId,
  slug: s.slug,
  title: s.title,
  japaneseTitle: s.jp,
  synopsis: s.synopsis,
  coverImage: s.cover,
  posterImage: s.poster,
  logoImage: s.logo,
  rating: s.rating,
  year: s.year,
  status: s.status,
  type: s.type,
  studio: s.studio,
  genres: s.genres,
  totalEpisodes: s.episodeTitles.length,
  seasonCount: 1,
  views: s.views,
  featured: s.category === "anime" ? s.featured : false,
  trendRank: s.trend,
  category: s.category,
}));

// Build seasons and episodes map
const seasonStore: Record<number, SeasonItem[]> = {};
const episodeStore: Record<number, EpisodeItem[]> = {};
const castStore: Record<number, CastItem[]> = {};

allSeed.forEach((s) => {
  seasonStore[s.id] = [
    {
      id: s.id * 10 + 1,
      animeId: s.id,
      number: 1,
      name: s.type === "Movie" ? "Movie" : "Season 1",
      poster: s.poster,
      episodeCount: s.episodeTitles.length,
      year: s.year,
    },
  ];

  episodeStore[s.id] = s.episodeTitles.map((title, i) => ({
    id: s.id * 100 + i + 1,
    animeId: s.id,
    season: 1,
    number: i + 1,
    title,
    overview: getEpisodeOverview(s.slug, i + 1) || `Episode ${i + 1} of ${s.title}`,
    thumb: s.cover,
    videoUrl: VIDEOS[i % VIDEOS.length],
    duration: DURATIONS[i % DURATIONS.length],
  }));

  castStore[s.id] = [
    {
      id: s.id * 1000 + 1,
      animeId: s.id,
      tmdbPersonId: 101,
      name: "Natsuki Hanae",
      character: "Lead Protagonist",
      profileImage: "https://image.tmdb.org/t/p/w185/8Z7tC2lCcltPz0a7pW1f4T0N0k.jpg",
      sortOrder: 1,
      episodeCount: s.episodeTitles.length,
      role: "cast",
      job: "",
    },
    {
      id: s.id * 1000 + 2,
      animeId: s.id,
      tmdbPersonId: 102,
      name: "Akari Kito",
      character: "Supporting Cast",
      profileImage: "https://image.tmdb.org/t/p/w185/f5s8z9o0b3Z2rT4y1U8p0k7j4M.jpg",
      sortOrder: 2,
      episodeCount: s.episodeTitles.length,
      role: "cast",
      job: "",
    },
    {
      id: s.id * 1000 + 3,
      animeId: s.id,
      tmdbPersonId: 103,
      name: "Haruo Sotozaki",
      character: "",
      profileImage: "",
      sortOrder: 10,
      episodeCount: s.episodeTitles.length,
      role: "crew",
      job: "Director",
    },
  ];
});

// Preload transparent title logos (text without background) from TMDB
for (const a of animeList) {
  if (a.tmdbId && !a.logoImage) {
    getTitleLogo(a.tmdbId, a.type === "Movie" ? "movie" : "tv")
      .then((logo) => {
        if (logo) a.logoImage = logo;
      })
      .catch(() => {});
  }
}

let liveTmdbLoaded = false;
let liveTmdbLoading = false;

/**
 * Fetch live anime and transparent title logos (text without background) from TMDB API
 */
export async function loadLiveAniMovieTmdbCatalog(force = false): Promise<boolean> {
  if (liveTmdbLoading) return false;
  if (liveTmdbLoaded && !force) return true;
  liveTmdbLoading = true;

  try {
    // 1. Fetch live popular, top-rated, and trending anime from TMDB API in parallel
    const [popularAnime, topVotedAnime, topRatedAnime] = await Promise.allSettled([
      discoverAnime("tv", "popularity.desc", 1),
      discoverAnime("tv", "vote_count.desc", 1),
      discoverAnime("tv", "vote_average.desc", 1),
    ]);

    const liveItems: any[] = [];
    const seenIds = new Set<number>();

    const addItems = (res: PromiseSettledResult<any[]>) => {
      if (res.status === "fulfilled" && Array.isArray(res.value)) {
        for (const item of res.value) {
          if (item && item.id && !seenIds.has(item.id) && (item.poster_path || item.backdrop_path)) {
            seenIds.add(item.id);
            liveItems.push(item);
          }
        }
      }
    };

    addItems(popularAnime);
    addItems(topVotedAnime);
    addItems(topRatedAnime);

    if (liveItems.length === 0) {
      liveTmdbLoading = false;
      return false;
    }

    // 2. Fetch transparent title logos (text without background) in PARALLEL for the top 8 anime
    const topFeatured = liveItems.slice(0, 8);
    const logoResults = await Promise.allSettled(
      topFeatured.map((item) => getTitleLogo(item.id, "tv"))
    );
    const logoMap = new Map<number, string>();
    logoResults.forEach((res, idx) => {
      if (res.status === "fulfilled" && res.value) {
        logoMap.set(topFeatured[idx].id, res.value);
      }
    });

    // Reset featured flags on existing items so live TMDB items take priority!
    for (const a of animeList) {
      a.featured = false;
    }

    // 3. Process all live TMDB anime into the catalog
    for (let i = 0; i < liveItems.length; i++) {
      const item = liveItems[i];
      const title = item.name || item.title || "";
      if (!title) continue;

      const slug = title
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const logoUrl = logoMap.get(item.id) || "";
      const existingIndex = animeList.findIndex(
        (a) => a.tmdbId === item.id || a.slug === slug
      );

      const year = Number((item.first_air_date || item.release_date || "2024").split("-")[0]) || 2024;
      const rating = Math.round((item.vote_average || 8.0) * 10) / 10;
      const views = Math.round((item.vote_count || 100) * 250 + (item.popularity || 50) * 500);

      const isItemCartoon = isCartoon({ title, slug });

      if (existingIndex >= 0) {
        const current = animeList[existingIndex];
        current.title = title;
        current.japaneseTitle = item.original_name || item.original_title || current.japaneseTitle || title;
        if (item.overview) current.synopsis = item.overview;
        if (item.backdrop_path) current.coverImage = tmdbImage(item.backdrop_path, "w1280");
        if (item.poster_path) current.posterImage = tmdbImage(item.poster_path, "w500");
        if (logoUrl) current.logoImage = logoUrl;
        current.rating = rating;
        current.year = year;
        current.views = views;
        current.category = isItemCartoon ? "cartoon" : "anime";
        current.featured = !isItemCartoon && i < 6;
        current.trendRank = i + 1;
      } else {
        const newId = animeList.length + 500 + i;
        const newAnimeItem: AnimeItem = {
          id: newId,
          tmdbId: item.id,
          anilistId: 0,
          slug,
          title,
          japaneseTitle: item.original_name || item.original_title || title,
          synopsis: item.overview || `Watch ${title} in ultra HD on ANIVERSE.`,
          coverImage: tmdbImage(item.backdrop_path || item.poster_path, "w1280"),
          posterImage: tmdbImage(item.poster_path || item.backdrop_path, "w500"),
          logoImage: logoUrl,
          rating,
          year,
          status: "Ongoing",
          type: "TV",
          studio: "Anime Studio",
          genres: ["Animation", "Action", "Fantasy"],
          totalEpisodes: 24,
          seasonCount: 1,
          views,
          category: isItemCartoon ? "cartoon" : "anime",
          featured: !isItemCartoon && i < 6,
          trendRank: i + 1,
        };

        seasonStore[newId] = [
          {
            id: newId * 10 + 1,
            animeId: newId,
            number: 1,
            name: "Season 1",
            poster: newAnimeItem.posterImage,
            episodeCount: 12,
            year: newAnimeItem.year,
          },
        ];

        episodeStore[newId] = Array.from({ length: 12 }, (_, j) => ({
          id: newId * 100 + j + 1,
          animeId: newId,
          season: 1,
          number: j + 1,
          title: `Episode ${j + 1}`,
          overview: `Episode ${j + 1} of ${title}. Streaming in 1080p high quality with Japanese audio and subtitles.`,
          thumb: newAnimeItem.coverImage,
          videoUrl: VIDEOS[j % VIDEOS.length],
          duration: DURATIONS[j % DURATIONS.length],
        }));

        castStore[newId] = [
          {
            id: newId * 1000 + 1,
            animeId: newId,
            tmdbPersonId: item.id,
            name: "Voice Cast",
            character: "Lead",
            profileImage: newAnimeItem.posterImage,
            sortOrder: 1,
            episodeCount: 12,
            role: "cast",
            job: "",
          },
        ];

        animeList.unshift(newAnimeItem);
      }
    }

    liveTmdbLoaded = true;
    liveTmdbLoading = false;

    // Notify React app that live TMDB catalog is ready!
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("aniverse:catalog-updated", { detail: { count: animeList.length } }));
    }

    // 4. Background fetch remaining logos asynchronously for cards and details
    setTimeout(async () => {
      const remainingItems = liveItems.slice(8, 25);
      let updatedAny = false;
      for (const it of remainingItems) {
        const found = animeList.find((a) => a.tmdbId === it.id);
        if (found && !found.logoImage) {
          try {
            const logo = await getTitleLogo(it.id, "tv");
            if (logo) {
              found.logoImage = logo;
              updatedAny = true;
            }
          } catch {}
        }
      }
      if (updatedAny && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("aniverse:catalog-updated", { detail: { count: animeList.length } }));
      }
    }, 100);

    return true;
  } catch (err) {
    console.warn("Could not load live TMDB anime catalog:", err);
    liveTmdbLoading = false;
    return false;
  }
}

// Background initial trigger
if (typeof window !== "undefined") {
  setTimeout(() => loadLiveAniMovieTmdbCatalog(), 50);
}

export function isTmdbLiveLoaded() {
  return liveTmdbLoaded;
}

export function getFeatured(): AnimeItem[] {
  // STRICTLY PURE ANIME ONLY! NEVER CARTOONS ON HERO!
  const list = animeList
    .filter((a) => a.featured && !isCartoon(a))
    .sort((a, b) => a.trendRank - b.trendRank);

  if (list.length >= 3) return list;

  // Fallback to iconic pure anime titles
  return animeList
    .filter((a) => !isCartoon(a) && a.type !== "Movie")
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 6);
}

export function getCartoons(limit = 20): AnimeItem[] {
  return animeList.filter((a) => isCartoon(a)).slice(0, limit);
}

export function getTrending(limit = 12): AnimeItem[] {
  // Pure anime trending
  return [...animeList]
    .filter((a) => !isCartoon(a))
    .sort((a, b) => a.trendRank - b.trendRank)
    .slice(0, limit);
}

export function getTopRated(limit = 10): AnimeItem[] {
  // Pure anime top rated
  return [...animeList]
    .filter((a) => !isCartoon(a))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function getLatestEpisodes(limit = 12) {
  const latest: Array<{
    id: number;
    season: number;
    number: number;
    title: string;
    duration: number;
    slug: string;
    animeTitle: string;
    cover: string;
    thumb: string;
  }> = [];

  for (const a of animeList) {
    const eps = episodeStore[a.id] || [];
    for (const ep of eps) {
      latest.push({
        id: ep.id,
        season: ep.season,
        number: ep.number,
        title: ep.title,
        duration: ep.duration,
        slug: a.slug,
        animeTitle: a.title,
        cover: a.coverImage,
        thumb: ep.thumb,
      });
      if (latest.length >= limit) break;
    }
    if (latest.length >= limit) break;
  }
  return latest;
}

export function getAllAnime(opts: { genre?: string; sort?: string; q?: string; limit?: number } = {}): AnimeItem[] {
  let list = [...animeList];

  if (opts.genre && opts.genre !== "All") {
    list = list.filter((a) => a.genres.includes(opts.genre!));
  }

  if (opts.q) {
    const q = opts.q.toLowerCase().trim();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.japaneseTitle.toLowerCase().includes(q) ||
        a.synopsis.toLowerCase().includes(q) ||
        a.genres.some((g) => g.toLowerCase().includes(q))
    );
  }

  switch (opts.sort) {
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      list.sort((a, b) => b.year - a.year);
      break;
    case "oldest":
      list.sort((a, b) => a.year - b.year);
      break;
    case "az":
      list.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      list.sort((a, b) => b.views - a.views);
  }

  return list.slice(0, opts.limit ?? 200);
}

export function getGenres(): string[] {
  return Array.from(new Set(animeList.flatMap((a) => a.genres))).sort();
}

export function findAnime(slugOrId: string): AnimeItem | null {
  if (!slugOrId) return null;
  const clean = slugOrId
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  const rawId = clean.replace(/^(tv|movie)-?/, "");

  return (
    animeList.find(
      (a) =>
        a.slug === clean ||
        String(a.tmdbId) === rawId ||
        String(a.id) === rawId ||
        a.slug === rawId ||
        a.slug.replace(/-/g, "") === clean.replace(/-/g, "") ||
        a.title
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") === clean ||
        a.title.toLowerCase() === clean
    ) || null
  );
}

export function getAnimeBySlug(slugOrId: string): AnimeBundle | null {
  const series = findAnime(slugOrId);
  if (!series) return null;

  // Asynchronously resolve TMDB transparent title logo if not yet populated
  if (series.tmdbId && !series.logoImage) {
    getTitleLogo(series.tmdbId, series.type === "Movie" ? "movie" : "tv")
      .then((logo) => {
        if (logo) series.logoImage = logo;
      })
      .catch(() => {});
  }

  // Ensure seasons and episodes exist for this series
  if (!seasonStore[series.id]) {
    seasonStore[series.id] = [
      {
        id: series.id * 10 + 1,
        animeId: series.id,
        number: 1,
        name: "Season 1",
        poster: series.posterImage,
        episodeCount: series.totalEpisodes || 12,
        year: series.year,
      },
    ];
  }

  if (!episodeStore[series.id] || episodeStore[series.id].length === 0) {
    const count = series.totalEpisodes || 12;
    episodeStore[series.id] = Array.from({ length: count }, (_, j) => ({
      id: series.id * 100 + j + 1,
      animeId: series.id,
      season: 1,
      number: j + 1,
      title: `Episode ${j + 1}`,
      overview: `Episode ${j + 1} of ${series.title}. Streaming in high quality.`,
      thumb: series.coverImage,
      videoUrl: VIDEOS[j % VIDEOS.length],
      duration: DURATIONS[j % DURATIONS.length],
    }));
  }

  if (!castStore[series.id]) {
    castStore[series.id] = [
      {
        id: series.id * 1000 + 1,
        animeId: series.id,
        tmdbPersonId: series.tmdbId,
        name: "Voice Cast",
        character: "Lead",
        profileImage: series.posterImage,
        sortOrder: 1,
        episodeCount: series.totalEpisodes || 12,
        role: "cast",
        job: "",
      },
    ];
  }

  return {
    series,
    seasons: seasonStore[series.id] || [],
    episodes: episodeStore[series.id] || [],
    cast: castStore[series.id] || [],
  };
}

export function getEpisodeBundle(slug: string, season: number, episodeNumber: number): EpisodeBundle | null {
  const bundle = getAnimeBySlug(slug);
  if (!bundle) return null;

  const inSeason = bundle.episodes.filter((e) => e.season === season);
  const episode = inSeason.find((e) => e.number === episodeNumber) || inSeason[0];
  if (!episode) return null;

  const idx = inSeason.findIndex((e) => e.number === episode.number);
  const prev = inSeason[idx - 1] ?? null;
  const next = inSeason[idx + 1] ?? null;

  return {
    series: bundle.series,
    seasons: bundle.seasons,
    episode,
    episodes: inSeason,
    allEpisodes: bundle.episodes,
    prev,
    next,
  };
}

export function getSimilar(series: AnimeItem, limit = 8): AnimeItem[] {
  return animeList
    .filter((a) => a.id !== series.id)
    .map((a) => ({
      a,
      score: a.genres.filter((g) => series.genres.includes(g)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score || y.a.rating - x.a.rating)
    .slice(0, limit)
    .map((x) => x.a);
}

export function getRandomSlug(): string {
  const random = animeList[Math.floor(Math.random() * animeList.length)];
  return random.slug;
}

export function getStats() {
  const totalEpisodes = Object.values(episodeStore).reduce((acc, eps) => acc + eps.length, 0);
  return {
    series: animeList.length,
    episodes: totalEpisodes,
  };
}

/** Dynamic seeding when a user clicks on an unseeded TMDB or AniList title */
export function seedAnimeFromExternal(item: {
  title: string;
  poster: string;
  backdrop?: string;
  year?: number;
  rating?: number;
  type?: string;
  overview?: string;
  tmdbId?: number;
  anilistId?: number;
}): string {
  const slug = item.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const existing = animeList.find((a) => a.slug === slug || (item.tmdbId && a.tmdbId === item.tmdbId));
  if (existing) return existing.slug;

  const newId = animeList.length + 100;
  const newAnime: AnimeItem = {
    id: newId,
    tmdbId: item.tmdbId || 0,
    anilistId: item.anilistId || 0,
    slug,
    title: item.title,
    japaneseTitle: item.title,
    synopsis: item.overview || "Stream full episodes in HD on ANIVERSE.",
    coverImage: item.backdrop || item.poster,
    posterImage: item.poster,
    logoImage: "",
    rating: item.rating || 8.0,
    year: item.year || new Date().getFullYear(),
    status: "Completed",
    type: item.type || "TV",
    studio: "Animation Studio",
    genres: ["Action", "Adventure", "Fantasy"],
    totalEpisodes: 12,
    seasonCount: 1,
    views: 120000,
    featured: false,
    trendRank: 999,
  };

  if (item.tmdbId) {
    getTitleLogo(item.tmdbId, item.type === "Movie" ? "movie" : "tv")
      .then((logo) => {
        if (logo) {
          newAnime.logoImage = logo;
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("aniverse:catalog-updated"));
          }
        }
      })
      .catch(() => {});
  }

  animeList.push(newAnime);

  seasonStore[newId] = [
    {
      id: newId * 10 + 1,
      animeId: newId,
      number: 1,
      name: newAnime.type === "Movie" ? "Movie" : "Season 1",
      poster: newAnime.posterImage,
      episodeCount: newAnime.type === "Movie" ? 1 : 12,
      year: newAnime.year,
    },
  ];

  const epCount = newAnime.type === "Movie" ? 1 : 12;
  episodeStore[newId] = Array.from({ length: epCount }, (_, i) => ({
    id: newId * 100 + i + 1,
    animeId: newId,
    season: 1,
    number: i + 1,
    title: newAnime.type === "Movie" ? newAnime.title : `Episode ${i + 1}`,
    overview: `Episode ${i + 1} overview for ${newAnime.title}.`,
    thumb: newAnime.coverImage,
    videoUrl: VIDEOS[i % VIDEOS.length],
    duration: DURATIONS[i % DURATIONS.length],
  }));

  castStore[newId] = [
    {
      id: newId * 1000 + 1,
      animeId: newId,
      tmdbPersonId: 101,
      name: "Voice Actor",
      character: "Main Character",
      profileImage: "",
      sortOrder: 1,
      episodeCount: epCount,
      role: "cast",
      job: "",
    },
  ];

  return slug;
}
