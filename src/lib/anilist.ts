const ANILIST_API_URL = "https://graphql.anilist.co";

const MEDIA_QUERY = `
  query ($search: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(search: $search, sort: POPULARITY_DESC) {
        id
        type
        format
        status
        title {
          romaji
          english
          native
        }
        coverImage {
          extraLarge
          large
        }
        bannerImage
        episodes
        chapters
        description(asHtml: false)
        startDate {
          year
        }
        genres
        averageScore
      }
    }
  }
`;

export type AnilistItem = {
  id: number;
  type: "ANIME" | "MANGA";
  format: string;
  status: string;
  title: {
    romaji: string;
    english: string | null;
    native: string | null;
  };
  coverImage: {
    extraLarge: string;
    large: string;
  };
  bannerImage: string | null;
  episodes: number | null;
  chapters: number | null;
  description: string | null;
  startDate: {
    year: number;
  } | null;
  genres: string[];
  averageScore: number;
};

export async function fetchFromAniList(search: string, perPage = 12): Promise<AnilistItem[]> {
  try {
    const res = await fetch(ANILIST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: MEDIA_QUERY,
        variables: { search, page: 1, perPage },
      }),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.Page?.media || [];
  } catch {
    return [];
  }
}
