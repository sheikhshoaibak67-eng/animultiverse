export type AnimeItem = {
  id: number;
  tmdbId: number;
  anilistId: number;
  slug: string;
  title: string;
  japaneseTitle: string;
  synopsis: string;
  coverImage: string;
  posterImage: string;
  logoImage?: string;
  rating: number;
  year: number;
  status: "Ongoing" | "Completed" | string;
  type: "TV" | "Movie" | "Manga" | string;
  studio: string;
  genres: string[];
  totalEpisodes: number;
  seasonCount: number;
  views: number;
  featured: boolean;
  trendRank: number;
  category?: "anime" | "cartoon";
};

export type SeasonItem = {
  id: number;
  animeId: number;
  number: number;
  name: string;
  poster: string;
  episodeCount: number;
  year: number;
};

export type EpisodeItem = {
  id: number;
  animeId: number;
  season: number;
  number: number;
  title: string;
  overview: string;
  thumb: string;
  videoUrl: string;
  duration: number; // in seconds
};

export type CastItem = {
  id: number;
  animeId: number;
  tmdbPersonId: number;
  name: string;
  character: string;
  profileImage: string;
  sortOrder: number;
  episodeCount: number;
  role: "cast" | "crew";
  job: string;
};

export type AnimeBundle = {
  series: AnimeItem;
  seasons: SeasonItem[];
  episodes: EpisodeItem[];
  cast: CastItem[];
};

export type EpisodeBundle = {
  series: AnimeItem;
  seasons: SeasonItem[];
  episode: EpisodeItem;
  episodes: EpisodeItem[];
  allEpisodes: EpisodeItem[];
  prev: EpisodeItem | null;
  next: EpisodeItem | null;
};
