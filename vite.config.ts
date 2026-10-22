import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

import { resolveAnimeSaltEpisode } from './src/lib/animesalt';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-anime-source',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (
              req.url &&
              (req.url.startsWith('/api/anime-source/animesalt') ||
                req.url.startsWith('/.netlify/functions/animesalt'))
            ) {
              try {
                const parsedUrl = new URL(req.url, 'http://localhost:3000');
                const title = parsedUrl.searchParams.get('title') || '';
                const season = Number(parsedUrl.searchParams.get('season')) || 1;
                const episode = Number(parsedUrl.searchParams.get('episode')) || 1;
                const tmdbId = parsedUrl.searchParams.get('tmdbId')
                  ? Number(parsedUrl.searchParams.get('tmdbId'))
                  : undefined;
                const type = parsedUrl.searchParams.get('type') || undefined;

                if (!title) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(
                    JSON.stringify({
                      success: false,
                      provider: 'AnimeSalt',
                      error: 'Query parameter "title" is required.',
                      fallbackNeeded: true,
                    })
                  );
                  return;
                }

                const result = await resolveAnimeSaltEpisode({
                  title,
                  season,
                  episode,
                  tmdbId,
                  type,
                });

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result));
                return;
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    success: false,
                    provider: 'AnimeSalt',
                    error: err?.message || 'Resolution failed',
                    fallbackNeeded: true,
                  })
                );
                return;
              }
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': rootDir,
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
