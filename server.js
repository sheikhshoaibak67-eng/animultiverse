import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { resolveAnimeSaltEpisode } from './src/lib/animesalt.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

const distPath = path.resolve(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

// Health check endpoint for Cloud Run and load balancers
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

// AnimeSalt episode source resolution API
app.get('/api/anime-source/animesalt', async (req, res) => {
  try {
    const title = String(req.query.title || '');
    const season = Number(req.query.season) || 1;
    const episode = Number(req.query.episode) || 1;
    const tmdbId = req.query.tmdbId ? Number(req.query.tmdbId) : undefined;
    const type = req.query.type ? String(req.query.type) : undefined;

    if (!title) {
      res.status(400).json({
        success: false,
        provider: 'AnimeSalt',
        error: 'Query parameter "title" is required.',
        fallbackNeeded: true,
      });
      return;
    }

    const result = await resolveAnimeSaltEpisode({
      title,
      season,
      episode,
      tmdbId,
      type,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      provider: 'AnimeSalt',
      error: err?.message || 'Internal server error while resolving episode',
      fallbackNeeded: true,
    });
  }
});

// Serve static assets from dist
app.use(express.static(distPath));

// Fallback to index.html for SPA client-side routing
app.use((_req, res) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('ANIVERSE is running. Build in progress or starting up...');
  }
});

const server = app.listen(PORT, HOST, () => {
  console.log(`ANIVERSE server listening on http://${HOST}:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
