/**
 * AnimeSalt Episode Source Resolver
 * 
 * Workflow:
 * 1. Takes anime title, season, episode, and optional TMDB ID / media type.
 * 2. Searches AnimeSalt using `https://animesalt.cx/?s={encoded_title}`.
 * 3. Finds matching anime series/movie page, selects the requested season & episode.
 * 4. Extracts the publicly available iframe embed player URL (e.g., https://ravok.buzz/video/{video_id}).
 * 5. Returns authorized embed URL or helpful status for manual fallback.
 */

export interface AnimeSaltResolveResult {
  success: boolean;
  provider: "AnimeSalt";
  title: string;
  season: number;
  episode: number;
  seriesUrl?: string;
  episodeUrl?: string;
  embedUrl?: string;
  server?: string;
  error?: string;
  fallbackNeeded?: boolean;
}

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const HEADERS = {
  "User-Agent": USER_AGENT,
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

function normalizeSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Extracts iframe embed URL from episode or movie HTML page
 */
export function extractEmbedUrl(html: string): string | null {
  // 1. Direct Ravok player iframe: src="https://ravok.buzz/video/..." or data-src
  const ravokMatch =
    html.match(/src=["'](https:\/\/ravok\.buzz\/video\/[a-zA-Z0-9_-]+)["']/i) ||
    html.match(/data-src=["'](https:\/\/ravok\.buzz\/video\/[a-zA-Z0-9_-]+)["']/i);
  if (ravokMatch && ravokMatch[1]) {
    return ravokMatch[1];
  }

  // 2. Look for iframe inside video-player or video container
  const playerIframeMatch =
    html.match(/<aside[^>]*class=["'][^"']*video-player[^"']*["'][^>]*>[\s\S]*?<iframe[^>]+src=["'](https?:\/\/[^"']+)["']/i) ||
    html.match(/<div[^>]*class=["'][^"']*video[^"']*["'][^>]*>[\s\S]*?<iframe[^>]+src=["'](https?:\/\/[^"']+)["']/i) ||
    html.match(/<iframe[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*class=["'][^"']*video-player[^"']*["']/i) ||
    html.match(/<iframe[^>]+data-src=["'](https?:\/\/[^"']+)["']/i);

  if (playerIframeMatch && playerIframeMatch[1]) {
    const candidate = playerIframeMatch[1];
    // Ignore analytics / tracking iframes
    if (!candidate.includes("googletagmanager") && !candidate.includes("doubleclick") && !candidate.includes("google.com")) {
      return candidate;
    }
  }

  // 3. Fallback: check for ravok.buzz URL string anywhere in page scripts
  const ravokGeneric = html.match(/https:\/\/ravok\.buzz\/video\/[a-zA-Z0-9_-]+/i);
  if (ravokGeneric) {
    return ravokGeneric[0];
  }

  return null;
}

export async function resolveAnimeSaltEpisode(params: {
  title: string;
  season?: number;
  episode?: number;
  tmdbId?: number;
  type?: string;
}): Promise<AnimeSaltResolveResult> {
  const title = (params.title || "").trim();
  const season = Math.max(1, Number(params.season) || 1);
  const episode = Math.max(1, Number(params.episode) || 1);
  const isMovie = params.type === "Movie" || params.type === "movie";

  if (!title) {
    return {
      success: false,
      provider: "AnimeSalt",
      title: "",
      season,
      episode,
      error: "Anime title is required",
      fallbackNeeded: true,
    };
  }

  const cleanTitle = title.replace(/\([^)]*\)/g, "").trim();
  const baseTitle = cleanTitle.split(":")[0].split(" - ")[0].trim();

  // Search variants to try: base title first (e.g. "Demon Slayer"), then clean title
  const searchQueries = [baseTitle, cleanTitle].filter(
    (v, i, self) => v.length > 1 && self.indexOf(v) === i
  );

  let seriesSlug: string | null = null;
  let seriesUrl: string | null = null;
  let movieUrl: string | null = null;
  let postId: string | null = null;

  // Step 1: Search AnimeSalt using https://animesalt.cx/?s={encoded_title}
  for (const query of searchQueries) {
    try {
      const searchUrl = `https://animesalt.cx/?s=${encodeURIComponent(query)}`;
      const res = await fetch(searchUrl, {
        headers: HEADERS,
        signal: AbortSignal.timeout(6000),
      });

      if (!res.ok) continue;

      const html = await res.text();

      // Find series & movie links in search results
      const seriesMatches = [
        ...html.matchAll(/href=["'](https:\/\/animesalt\.cx\/series\/([^"'/]+)\/?)["']/gi),
      ];
      const movieMatches = [
        ...html.matchAll(/href=["'](https:\/\/animesalt\.cx\/movies\/([^"'/]+)\/?)["']/gi),
      ];

      if (isMovie && movieMatches.length > 0) {
        movieUrl = movieMatches[0][1];
        break;
      }

      if (seriesMatches.length > 0) {
        // Prioritize exact slug match or closest match
        const targetSlug = normalizeSlug(query);
        let best = seriesMatches[0];
        for (const m of seriesMatches) {
          const s = m[2].toLowerCase();
          if (s === targetSlug) {
            best = m;
            break;
          }
        }
        seriesUrl = best[1];
        seriesSlug = best[2];
        break;
      }

      if (movieMatches.length > 0 && !movieUrl) {
        movieUrl = movieMatches[0][1];
      }
    } catch {
      // Continue to next query
    }
  }

  // Handle Movie mode
  if (isMovie && movieUrl) {
    try {
      const movieRes = await fetch(movieUrl, {
        headers: HEADERS,
        signal: AbortSignal.timeout(6000),
      });
      if (movieRes.ok) {
        const movieHtml = await movieRes.text();
        const embedUrl = extractEmbedUrl(movieHtml);
        if (embedUrl) {
          return {
            success: true,
            provider: "AnimeSalt",
            title,
            season: 1,
            episode: 1,
            seriesUrl: movieUrl,
            episodeUrl: movieUrl,
            embedUrl,
            server: "ravok",
          };
        }
      }
    } catch {
      // Continue
    }
  }

  // Fallback slug if search didn't return series link
  if (!seriesSlug) {
    seriesSlug = normalizeSlug(baseTitle);
    seriesUrl = `https://animesalt.cx/series/${seriesSlug}/`;
  }

  // Step 2: Attempt direct episode URL (fast path)
  // AnimeSalt canonical format: /episode/{series-slug}-{season}x{episode}/
  const directEpisodeUrls = [
    `https://animesalt.cx/episode/${seriesSlug}-${season}x${episode}/`,
    `https://animesalt.cx/episode/${seriesSlug}-season-${season}-episode-${episode}/`,
  ];

  for (const epUrl of directEpisodeUrls) {
    try {
      const epRes = await fetch(epUrl, {
        headers: HEADERS,
        signal: AbortSignal.timeout(6000),
      });

      if (epRes.ok) {
        const epHtml = await epRes.text();
        const embedUrl = extractEmbedUrl(epHtml);
        if (embedUrl) {
          return {
            success: true,
            provider: "AnimeSalt",
            title,
            season,
            episode,
            seriesUrl: seriesUrl || undefined,
            episodeUrl: epUrl,
            embedUrl,
            server: "ravok",
          };
        }
      }
    } catch {
      // Continue
    }
  }

  // Step 3: Open matching anime page, select correct season and locate episode
  try {
    if (seriesUrl) {
      const seriesRes = await fetch(seriesUrl, {
        headers: HEADERS,
        signal: AbortSignal.timeout(7000),
      });

      if (seriesRes.ok) {
        const seriesHtml = await seriesRes.text();

        // Extract post ID
        const postIdMatch =
          seriesHtml.match(/postid-(\d+)/) ||
          seriesHtml.match(/data-post=["'](\d+)["']/);
        if (postIdMatch) {
          postId = postIdMatch[1];
        }

        let episodeLinksHtml = seriesHtml;

        // If requested season > 1, fetch season episodes via Torofilm AJAX
        if (season > 1 && postId) {
          try {
            const ajaxUrl = `https://animesalt.cx/wp-admin/admin-ajax.php?action=action_select_season&season=${season}&post=${postId}`;
            const ajaxRes = await fetch(ajaxUrl, {
              headers: HEADERS,
              signal: AbortSignal.timeout(6000),
            });
            if (ajaxRes.ok) {
              episodeLinksHtml = await ajaxRes.text();
            }
          } catch {
            // Keep seriesHtml
          }
        }

        // Locate episode URL in episodeLinksHtml
        const epRegex = new RegExp(
          `href=["'](https:\\/\\/animesalt\\.cx\\/episode\\/[^"']*(?:${season}x${episode}|s0?${season}e0?${episode})[^"']*)["']`,
          "i"
        );
        const match = episodeLinksHtml.match(epRegex);

        if (match && match[1]) {
          const foundEpUrl = match[1];
          const epRes = await fetch(foundEpUrl, {
            headers: HEADERS,
            signal: AbortSignal.timeout(6000),
          });

          if (epRes.ok) {
            const epHtml = await epRes.text();
            const embedUrl = extractEmbedUrl(epHtml);
            if (embedUrl) {
              return {
                success: true,
                provider: "AnimeSalt",
                title,
                season,
                episode,
                seriesUrl,
                episodeUrl: foundEpUrl,
                embedUrl,
                server: "ravok",
              };
            }
          }
        }
      }
    }
  } catch (err: any) {
    return {
      success: false,
      provider: "AnimeSalt",
      title,
      season,
      episode,
      error: `Failed to query AnimeSalt: ${err?.message || String(err)}`,
      fallbackNeeded: true,
    };
  }

  // If automated retrieval could not find the episode or provider restricted
  return {
    success: false,
    provider: "AnimeSalt",
    title,
    season,
    episode,
    seriesUrl: seriesUrl || undefined,
    error: `Episode S${season}:E${episode} not found on AnimeSalt.`,
    fallbackNeeded: true,
  };
}
