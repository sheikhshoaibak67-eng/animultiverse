import { resolveAnimeSaltEpisode } from '../../src/lib/animesalt.ts';

/**
 * Netlify Serverless Function for resolving AnimeSalt episode streams.
 * Deployed automatically by Netlify when committed to git repository.
 */
export const handler = async (event: any) => {
  const params = event.queryStringParameters || {};
  const title = String(params.title || '');
  const season = Number(params.season) || 1;
  const episode = Number(params.episode) || 1;
  const tmdbId = params.tmdbId ? Number(params.tmdbId) : undefined;
  const type = params.type ? String(params.type) : undefined;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'public, max-age=300',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (!title) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        success: false,
        provider: 'AnimeSalt',
        error: 'Query parameter "title" is required.',
        fallbackNeeded: true,
      }),
    };
  }

  try {
    const result = await resolveAnimeSaltEpisode({
      title,
      season,
      episode,
      tmdbId,
      type,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        provider: 'AnimeSalt',
        error: err?.message || 'Internal server error while resolving episode',
        fallbackNeeded: true,
      }),
    };
  }
};
