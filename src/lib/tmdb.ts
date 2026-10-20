// AniMovie (github.com/Parthakashyap/AniMovie) TMDB API Engine
// Requests are proxied through the /api/tmdb Netlify Function so no API key ships to the browser.

const API = "/api/tmdb";
const IMG = "https://image.tmdb.org/t/p";

export function tmdbImage(path: string | null | undefined, size = "w500"): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${IMG}/${size}${path}`;
}

/**
 * Thumbnail URL helpers for TMDB
 * w1280: high-resolution landscape backdrop for hero/banner
 * w500: vertical poster / thumbnail for cards
 * w300: compact thumbnail
 * original: uncompressed transparent title logos and backdrops
 */
export function tmdbBackdrop(path: string | null | undefined): string {
  return tmdbImage(path, "w1280");
}

export function tmdbPoster(path: string | null | undefined): string {
  return tmdbImage(path, "w500");
}

export function tmdbLogo(path: string | null | undefined): string {
  return tmdbImage(path, "w500");
}

export async function tmdbGet<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const qs = new URLSearchParams(params);
  const res = await fetch(`${API}${path}?${qs}`, {
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    throw new Error(`TMDB HTTP ${res.status} for ${path}`);
  }
  return (await res.json()) as T;
}

/* --------------------------------- Types --------------------------------- */

export type TmdbDiscoverItem = {
  id: number;
  name?: string;
  title?: string;
  original_name?: string;
  original_title?: string;
  original_language: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  first_air_date?: string;
  release_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  media_type?: string;
};

export type TmdbShowDetail = {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  tagline?: string;
  backdrop_path: string | null;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  status: string;
  number_of_episodes: number;
  episode_run_time: number[];
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string }[];
  networks: { id: number; name: string }[];
  seasons: Array<{
    season_number: number;
    name: string;
    episode_count: number;
    poster_path: string | null;
    air_date: string | null;
  }>;
};

export type TmdbMovieDetail = {
  id: number;
  title: string;
  original_title: string;
  original_language: string;
  overview: string;
  tagline?: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  status: string;
  runtime: number | null;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string }[];
};

export type TmdbEpisode = {
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  runtime: number | null;
};

export type TmdbSeason = {
  episodes: TmdbEpisode[];
};

export type TmdbAggregateCredits = {
  cast: Array<{
    id: number;
    name: string;
    profile_path: string | null;
    roles?: { character: string; episode_count: number }[];
    character?: string;
    total_episode_count: number;
    order: number;
  }>;
  crew: Array<{
    id: number;
    name: string;
    profile_path: string | null;
    jobs?: { job: string; episode_count: number }[];
    job?: string;
    department?: string;
    total_episode_count: number;
  }>;
};

export type TmdbSearchResult = TmdbDiscoverItem;

/* --------------------------- AniMovie Endpoints -------------------------- */

/**
 * AniMovie Discover Anime query:
 * with_genres=16 (Animation), without_genres=10762,10751 (No Kids/Family), with_original_language=ja
 */
export async function discoverAnime(
  type: "tv" | "movie" = "tv",
  sortBy = "popularity.desc",
  page = 1
): Promise<TmdbDiscoverItem[]> {
  const params: Record<string, string> = {
    with_genres: "16",
    with_original_language: "ja",
    sort_by: sortBy,
    page: String(page),
  };

  if (sortBy.includes("vote_average")) {
    params["vote_count.gte"] = "100";
  }

  const data = await tmdbGet<{ results: TmdbDiscoverItem[] }>(`/discover/${type}`, params);
  return (data.results || []).map((r) => ({ ...r, media_type: type }));
}

export async function discoverAnimePopularity(page = 1) {
  return discoverAnime("tv", "popularity.desc", page);
}

export async function discoverAnimeTopRated(page = 1) {
  return discoverAnime("tv", "vote_average.desc", page);
}

export async function discoverAnimeTrending(page = 1) {
  return discoverAnime("tv", "vote_count.desc", page);
}

export async function getShow(id: number): Promise<TmdbShowDetail> {
  return tmdbGet<TmdbShowDetail>(`/tv/${id}`);
}

export async function getMovie(id: number): Promise<TmdbMovieDetail> {
  return tmdbGet<TmdbMovieDetail>(`/movie/${id}`);
}

export async function getSeason(id: number, seasonNumber: number): Promise<TmdbSeason> {
  return tmdbGet<TmdbSeason>(`/tv/${id}/season/${seasonNumber}`);
}

export async function getAggregateCredits(id: number, type: "tv" | "movie" = "tv"): Promise<TmdbAggregateCredits> {
  if (type === "movie") {
    const data = await tmdbGet<{ cast: any[]; crew: any[] }>(`/movie/${id}/credits`);
    return {
      cast: (data.cast || []).map((c) => ({
        id: c.id,
        name: c.name,
        profile_path: c.profile_path,
        roles: [{ character: c.character || "", episode_count: 1 }],
        character: c.character || "",
        total_episode_count: 1,
        order: c.order || 0,
      })),
      crew: (data.crew || []).map((c) => ({
        id: c.id,
        name: c.name,
        profile_path: c.profile_path,
        jobs: [{ job: c.job || "", episode_count: 1 }],
        job: c.job || "",
        department: c.department || "",
        total_episode_count: 1,
      })),
    };
  }
  return tmdbGet<TmdbAggregateCredits>(`/tv/${id}/aggregate_credits`);
}

/**
 * AniMovie transparent title logo fetcher:
 * Extracts high-resolution English/Japanese PNG logos (text without background) for overlay on hero backdrops.
 */
export async function getTitleLogo(id: number, type: "tv" | "movie" = "tv"): Promise<string | null> {
  try {
    const data = await tmdbGet<{
      logos: Array<{
        file_path: string;
        width: number;
        height: number;
        iso_639_1: string | null;
      }>;
    }>(`/${type}/${id}/images`);

    const validLogos = (data.logos || []).filter((l) => Boolean(l.file_path));
    if (validLogos.length === 0) return null;

    validLogos.sort((a, b) => {
      const langOrder = (lang: string | null) =>
        lang === "en" ? 0 : lang === null ? 1 : lang === "ja" ? 2 : 3;
      const ld = langOrder(a.iso_639_1) - langOrder(b.iso_639_1);
      if (ld !== 0) return ld;
      return (b.width || 0) - (a.width || 0);
    });

    const best = validLogos[0];
    return best?.file_path ? `https://image.tmdb.org/t/p/original${best.file_path}` : null;
  } catch {
    return null;
  }
}

/**
 * Search TMDB for Anime, TV, and Movies matching AniMovie query filters
 */
export async function searchTmdb(query: string, page = 1): Promise<TmdbSearchResult[]> {
  try {
    const data = await tmdbGet<{
      results: (TmdbDiscoverItem & { media_type?: string })[];
    }>("/search/multi", {
      query,
      page: String(page),
      include_adult: "false",
    });

    return (data.results || []).filter(
      (r) =>
        r.poster_path &&
        (r.media_type === "tv" || r.media_type === "movie" || !r.media_type)
    );
  } catch {
    return [];
  }
}
