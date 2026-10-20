export type ZipFileEntry = {
  path: string;
  category: "Frontend View" | "Frontend Component" | "Backend API" | "Database & Schema" | "Scripts & Tools" | "Config & Deployment" | "Documentation";
  description: string;
  lines: number;
  tags: string[];
  code: string;
};

export const zipFiles: ZipFileEntry[] = [
  {
    path: "src/app/page.tsx",
    category: "Frontend View",
    description: "Next.js 16 App Router homepage with dynamic Hero banner, Discover chips, Continue Watching, My List rail, Trending marquee, Top Rated anime with rank badges, New Simulcasts, and CTA.",
    lines: 198,
    tags: ["React 19", "Next.js 16", "Server Component", "Framer Motion"],
    code: `import Image from "next/image";
import Link from "next/link";
import { Flame, Library, Radio, Sparkles, Trophy, TrendingUp } from "lucide-react";
import Hero from "@/components/Hero";
import TrendingMarquee from "@/components/TrendingMarquee";
import SectionHeader from "@/components/SectionHeader";
import PosterCard from "@/components/PosterCard";
import PosterRow from "@/components/PosterRow";
import ContinueWatching from "@/components/ContinueWatching";
import MyListRail from "@/components/MyListRail";
import DiscoverChips from "@/components/DiscoverChips";
import GenreCards from "@/components/GenreCards";
import { getFeatured, getGenres, getLatestEpisodes, getStats, getTopRated, getTrending, getAllAnime } from "@/lib/data";
import { formatDuration } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, trending, topRated, latest, stats, newest, genres] = await Promise.all([
    getFeatured(),
    getTrending(24),
    getTopRated(20),
    getLatestEpisodes(12),
    getStats(),
    getAllAnime({ sort: "newest", limit: 20 }),
    getGenres(),
  ]);
  const heroItems = featured.slice(0, 5);

  return (
    <main className="relative z-10 flex min-h-screen w-full flex-col select-none pb-20 md:pb-10">
      {heroItems.length > 0 && <Hero items={heroItems} />}
      <DiscoverChips />
      <div className="mt-4"><GenreCards genres={genres} /></div>
      <ContinueWatching />
      <MyListRail />
      <div className="mt-6">
        <SectionHeader title="Trending Anime" badge="Live Trending" badgeColor="bg-brand" subtitle="Most popular anime streaming right now" icon={Flame} viewMorePath="/browse" />
        <TrendingMarquee items={trending.map(toPosterItem)} />
      </div>
      <div className="mt-4">
        <SectionHeader title="Top Rated Anime" badge="Top 10" badgeColor="bg-amber-600" subtitle="Highest rated anime of all time" icon={Trophy} viewMorePath="/browse?sort=rating" />
        <PosterRow>
          {topRated.map((a, i) => (
            <div key={a.slug} className="relative w-[140px] shrink-0 sm:w-[155px] md:w-[170px]">
              <span className="absolute -left-1 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-lg bg-black/80 text-xs font-black text-white ring-1 ring-white/20">{i + 1}</span>
              <PosterCard item={toPosterItem(a)} eager={i < 6} className="w-full" />
            </div>
          ))}
        </PosterRow>
      </div>
      {/* Additional sections: New Episodes, Recently Added, All Anime grid, and CTA */}
    </main>
  );
}`
  },
  {
    path: "src/app/watch/[slug]/[number]/page.tsx",
    category: "Frontend View",
    description: "Multi-server watch screen with WatchPlayer (5 servers: TG Server, VidStuck Hindi, VidSrc ICU, VidSrc SBS, AnimeWorld India + Backup Demo), episode sidebar navigator, MP4 download, and breadcrumb navigation.",
    lines: 195,
    tags: ["Streaming", "Multi-Server", "Embed Player", "HTML5 Video"],
    code: `import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import WatchPlayer from "@/components/WatchPlayer";
import EpisodeNav from "@/components/EpisodeNav";
import DownloadButton from "@/components/DownloadButton";
import { episodeIdFor } from "@/lib/animeWorldIndia";
import { getEpisodeBundle, getSimilar } from "@/lib/data";

export default async function WatchPage({ params, searchParams }: any) {
  const [{ slug, number }, { s }] = await Promise.all([params, searchParams]);
  const bundle = await getEpisodeBundle(slug, Number(s || 1), Number(number));
  if (!bundle) notFound();

  const isMovie = bundle.series.type === "Movie";
  const embedTg = bundle.series.tmdbId ? (isMovie ? \`https://freeserver77.ai.studio/embed/tg/movie/\${bundle.series.tmdbId}\` : \`https://freeserver77.ai.studio/embed/tg/tv/\${bundle.series.tmdbId}/\${bundle.episode.season}/\${bundle.episode.number}\`) : null;
  const embedVidstuck = bundle.series.tmdbId ? \`https://freeserver77.ai.studio/embed/vidstuck/tv/\${bundle.series.tmdbId}/\${bundle.episode.season}/\${bundle.episode.number}?lang=hin\` : null;
  const embedVidsrcIcu = bundle.series.tmdbId ? \`https://vidsrc.icu/embed/anime/\${bundle.series.tmdbId}/\${bundle.episode.number}/0\` : null;
  const embedVidsrcSbs = bundle.series.tmdbId ? \`https://vidsrc.sbs/embed/tv/\${bundle.series.tmdbId}/\${bundle.episode.season}/\${bundle.episode.number}\` : null;
  const embedAwi = \`/api/anime-world-india/v1/embed.php?episodeId=\${encodeURIComponent(episodeIdFor(bundle.series.slug, bundle.episode.season, bundle.episode.number))}\`;

  return (
    <main className="mx-auto max-w-[92rem] px-4 pt-24 sm:px-6 lg:px-10">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <WatchPlayer embedTg={embedTg} embedVidstuck={embedVidstuck} embedVidsrcIcu={embedVidsrcIcu} embedVidsrcSbs={embedVidsrcSbs} embedAwi={embedAwi} demo={{ src: bundle.episode.videoUrl, poster: bundle.episode.thumb, storageKey: \`\${bundle.series.slug}:s\${bundle.episode.season}:e\${bundle.episode.number}\`, meta: { slug: bundle.series.slug, title: bundle.series.title, cover: bundle.series.coverImage, season: bundle.episode.season, ep: bundle.episode.number, epTitle: bundle.episode.title }, animeHref: \`/anime/\${bundle.series.slug}\`, nextHref: null, nextLabel: null, prevHref: null }} />
          <div className="glass rounded-2xl p-6">
            <h1 className="text-2xl font-bold text-white">{bundle.series.title} S{bundle.episode.season} E{bundle.episode.number}</h1>
            <p className="mt-2 text-sm text-zinc-400">{bundle.episode.overview}</p>
            <div className="mt-6 flex gap-3"><DownloadButton tmdbId={bundle.series.tmdbId} title={bundle.series.title} type="tv" season={bundle.episode.season} episode={bundle.episode.number} /></div>
          </div>
        </div>
        <EpisodeNav slug={bundle.series.slug} cover={bundle.series.coverImage} title={bundle.series.title} current={bundle.episode.number} currentSeason={bundle.episode.season} seasons={bundle.seasons} episodes={bundle.episodes} />
      </div>
    </main>
  );
}`
  },
  {
    path: "src/app/anime/[slug]/page.tsx",
    category: "Frontend View",
    description: "Anime detail view displaying cinematic Ken Burns cover, transparent logo or typography, status, score, release year, runtime, seasons, synopsis, interactive SeasonBrowser with episode cards, and Cast & Crew section.",
    lines: 182,
    tags: ["Detail View", "Season Browser", "Cast Section", "Metadata"],
    code: `export default async function AnimePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getAnimeBySlug(slug);
  if (!data) notFound();
  const { series, episodes, seasons, cast } = data;
  const similar = await getSimilar(series);
  const tagline = getTagline(slug);

  return (
    <main className="flex min-h-screen w-full flex-col select-none text-white pb-20 md:pb-0">
      <section className="relative flex min-h-[max(80svh,680px)] w-full flex-col overflow-hidden">
        {/* Hero banner with ambient veil, transparent logo, ratings, and DetailActions */}
      </section>
      <SeasonBrowser slug={series.slug} cover={series.coverImage} seasons={seasons} episodes={episodes} />
      {cast.length > 0 && <CastSection cast={cast} />}
    </main>
  );
}`
  },
  {
    path: "src/app/search/page.tsx",
    category: "Frontend View",
    description: "Search page rendering SearchExperience component which performs parallel queries to local database, TMDB multi-search, and AniList GraphQL, split into Anime, Manga, Movies, and TV Shows tabs.",
    lines: 70,
    tags: ["Search", "TMDB", "AniList", "Discovery"],
    code: `export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const [genres, recommended, initialLocal, initialTmdbRaw, initialAnilist] = await Promise.all([
    getGenres(),
    getTrending(28),
    query ? getAllAnime({ q: query, limit: 60 }) : Promise.resolve([]),
    query ? searchTmdb(query).catch(() => []) : Promise.resolve([]),
    query ? fetchFromAniList({ search: query, perPage: 12 }).catch(() => []) : Promise.resolve([]),
  ]);
  return <SearchExperience initialQuery={query} initialLocal={initialLocal} initialTmdb={initialTmdb} initialAnilist={initialAnilist} genres={genres} recommendedA={posters.slice(0, 14)} recommendedB={posters.slice(14, 28)} />;
}`
  },
  {
    path: "src/app/browse/page.tsx",
    category: "Frontend View",
    description: "Catalog browsing view with genre pills, sort by dropdown (Most Popular, Top Rated, Newest, Oldest, A-Z), and responsive poster grid.",
    lines: 60,
    tags: ["Browse", "Filter", "Sort", "Responsive Grid"],
    code: `export default async function BrowsePage({ searchParams }: { searchParams: Promise<{ genre?: string; sort?: string }> }) {
  const { genre, sort } = await searchParams;
  const [genres, items] = await Promise.all([getGenres(), getAllAnime({ genre, sort })]);
  return (
    <main className="mx-auto min-h-screen max-w-[92rem] px-4 pb-20 pt-28 sm:px-6 md:pb-10 lg:px-10">
      <header className="mb-8 flex items-center gap-3">
        <h1 className="text-3xl font-bold text-white">Browse Anime</h1>
        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold">{items.length} series</span>
      </header>
      <BrowseFilters genres={genres} genre={genre ?? ""} sort={sort ?? ""} />
      <div className="mt-10 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
        {items.map((a) => <PosterCard key={a.slug} item={toPosterItem(a)} className="w-full" />)}
      </div>
    </main>
  );
}`
  },
  {
    path: "src/app/my-list/page.tsx",
    category: "Frontend View",
    description: "My List page rendering personal saved watchlist stored client-side in localStorage with remove buttons and clear all history.",
    lines: 70,
    tags: ["Client Component", "localStorage", "Watchlist"],
    code: `"use client";
import { useEffect, useState } from "react";
import BannerCard from "@/components/BannerCard";
import { LIST_EVENT, LIST_KEY, readListItems, removeFromList, type ListItem } from "@/lib/progress";

export default function MyListPage() {
  const [items, setItems] = useState<ListItem[] | null>(null);
  useEffect(() => {
    const sync = () => setItems(readListItems());
    sync();
    window.addEventListener(LIST_EVENT, sync);
    return () => window.removeEventListener(LIST_EVENT, sync);
  }, []);
  return (
    <main className="mx-auto min-h-screen max-w-[92rem] px-4 pb-20 pt-28 sm:px-6 md:pb-10 lg:px-10">
      <h1 className="text-3xl font-bold text-white">My List</h1>
      {items && items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item) => (
            <BannerCard key={item.slug} className="w-full" href={\`/anime/\${item.slug}\`} item={item} onRemove={() => removeFromList(item.slug)} />
          ))}
        </div>
      ) : <p className="text-zinc-500">Your list is empty.</p>}
    </main>
  );
}`
  },
  {
    path: "src/components/WatchPlayer.tsx",
    category: "Frontend Component",
    description: "Multi-server player switcher managing 5 external streaming providers (TG Server, VidStuck Hindi, VidSrc ICU, VidSrc SBS, AnimeWorld India) with fallback to custom VideoPlayer HTML5 engine.",
    lines: 95,
    tags: ["Player Switcher", "iFrame", "Fallback"],
    code: `"use client";
import { useState } from "react";
import { MonitorPlay, Zap } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import { cn } from "@/lib/utils";

export default function WatchPlayer({ embedTg, embedVidstuck, embedVidsrcIcu, embedVidsrcSbs, embedAwi, demo }: any) {
  const servers = [
    ...(embedTg ? [{ id: "tg", label: "Server 1", tag: "TG Server • HD • Ad-free" }] : []),
    ...(embedVidstuck ? [{ id: "vidstuck", label: "Server 2", tag: "VidStuck • Hindi" }] : []),
    ...(embedVidsrcIcu ? [{ id: "vidsrc-icu", label: "Server 3", tag: "VidSrc ICU • Sub/Dub" }] : []),
    ...(embedVidsrcSbs ? [{ id: "vidsrc-sbs", label: "Server 4", tag: "VidSrc SBS • HD" }] : []),
    ...(embedAwi ? [{ id: "awi", label: "Server 5", tag: "AnimeWorld India • Hindi" }] : []),
    { id: "demo", label: "Backup", tag: "Demo stream" },
  ];
  const [active, setActive] = useState(servers[0]?.id || "demo");
  return (
    <div className="space-y-4">
      {/* Server selector buttons and embed iframe */}
    </div>
  );
}`
  },
  {
    path: "src/components/VideoPlayer.tsx",
    category: "Frontend Component",
    description: "Custom HTML5 video player component with play/pause, seek slider, 10s skip/rewind, volume slider, playback rate switcher (0.5x to 2x), auto-next countdown, PiP, fullscreen, and localStorage resume timestamp.",
    lines: 485,
    tags: ["HTML5 Video", "Keyboard Shortcuts", "Resume", "PiP", "Custom Controls"],
    code: `"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { FastForward, Maximize, Pause, PictureInPicture2, Play, Rewind, SkipForward, Volume2, VolumeX } from "lucide-react";
import { cn, formatTime } from "@/lib/utils";
import { readProgressMap, writeProgressEntry, markWatched } from "@/lib/progress";

export default function VideoPlayer({ src, poster, storageKey, meta, animeHref, nextHref }: any) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // Full player engine implementation...
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
      <video ref={videoRef} src={src} poster={poster} className="h-full w-full object-cover" />
      {/* Interactive HUD chrome, Seek bar, Buttons */}
    </div>
  );
}`
  },
  {
    path: "src/components/DownloadButton.tsx",
    category: "Frontend Component",
    description: "Downloader component that queries freeserver77 API for direct MP4 video streams, shows server/language picker, and downloads the MP4 blob to the user's disk.",
    lines: 180,
    tags: ["MP4 Download", "Stream Resolver", "Blob"],
    code: `"use client";
import { useState } from "react";
import { Download, Loader2, Check, AlertCircle } from "lucide-react";

export default function DownloadButton({ tmdbId, title, type, season = 1, episode = 1 }: any) {
  const [state, setState] = useState("idle");
  const fetchLinks = async () => {
    setState("fetching");
    const endpoint = type === "tv"
      ? \`https://freeserver77.ai.studio/api/stream/tv/\${tmdbId}/\${season}/\${episode}\`
      : \`https://freeserver77.ai.studio/api/stream/movie/\${tmdbId}\`;
    const res = await fetch(endpoint);
    const data = await res.json();
    // Parse links, trigger MP4 download blob
  };
  return <button onClick={fetchLinks} className="btn">Download MP4</button>;
}`
  },
  {
    path: "src/components/Hero.tsx",
    category: "Frontend Component",
    description: "Responsive desktop and mobile hero carousel with Ken Burns ambient background blur, official transparent title logo, star rating, genre tags, Play CTA, and My List quick action.",
    lines: 320,
    tags: ["Hero", "Carousel", "Framer Motion", "Logo Treatment"],
    code: `"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Bookmark, Star } from "lucide-react";

export default function Hero({ items }: { items: any[] }) {
  const [idx, setIdx] = useState(0);
  const cur = items[idx];
  return (
    <section className="relative w-full select-none">
      {/* Ambient backdrop blur and desktop / mobile responsive cards */}
    </section>
  );
}`
  },
  {
    path: "src/db/schema.ts",
    category: "Database & Schema",
    description: "PostgreSQL database schema defined with Drizzle ORM: anime, seasons, episodes, cast_members, and meta tables with cascade foreign keys and unique indexes.",
    lines: 95,
    tags: ["PostgreSQL", "Drizzle ORM", "Relations", "Indexes"],
    code: `import { boolean, integer, pgTable, real, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const anime = pgTable("anime", {
  id: serial("id").primaryKey(),
  tmdbId: integer("tmdb_id").notNull().default(0),
  anilistId: integer("anilist_id").notNull().default(0),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  japaneseTitle: varchar("japanese_title", { length: 255 }).notNull(),
  synopsis: text("synopsis").notNull(),
  coverImage: text("cover_image").notNull(),
  posterImage: text("poster_image").notNull().default(""),
  logoImage: text("logo_image").notNull().default(""),
  rating: real("rating").notNull(),
  year: integer("year").notNull(),
  status: varchar("status", { length: 24 }).notNull(),
  type: varchar("type", { length: 24 }).notNull(),
  studio: varchar("studio", { length: 140 }).notNull(),
  genres: text("genres").array().notNull(),
  totalEpisodes: integer("total_episodes").notNull(),
  seasonCount: integer("season_count").notNull().default(1),
  views: integer("views").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  trendRank: integer("trend_rank").notNull().default(999),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const seasons = pgTable("seasons", {
  id: serial("id").primaryKey(),
  animeId: integer("anime_id").notNull().references(() => anime.id, { onDelete: "cascade" }),
  number: integer("number").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  poster: text("poster").notNull().default(""),
  episodeCount: integer("episode_count").notNull().default(0),
  year: integer("year").notNull().default(0),
}, (t) => [uniqueIndex("seasons_anime_number_unique").on(t.animeId, t.number)]);

export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  animeId: integer("anime_id").notNull().references(() => anime.id, { onDelete: "cascade" }),
  season: integer("season").notNull().default(1),
  number: integer("number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  overview: text("overview").notNull().default(""),
  thumb: text("thumb").notNull().default(""),
  videoUrl: text("video_url").notNull(),
  duration: integer("duration").notNull(),
}, (t) => [uniqueIndex("episodes_anime_season_number_unique").on(t.animeId, t.season, t.number)]);

export const castMembers = pgTable("cast_members", {
  id: serial("id").primaryKey(),
  animeId: integer("anime_id").notNull().references(() => anime.id, { onDelete: "cascade" }),
  tmdbPersonId: integer("tmdb_person_id").notNull().default(0),
  name: varchar("name", { length: 255 }).notNull(),
  character: varchar("character", { length: 255 }).notNull().default(""),
  profileImage: text("profile_image").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  episodeCount: integer("episode_count").notNull().default(0),
  role: varchar("role", { length: 24 }).notNull().default("cast"),
  job: varchar("job", { length: 120 }).notNull().default(""),
}, (t) => [uniqueIndex("cast_anime_person_role_unique").on(t.animeId, t.tmdbPersonId, t.role)]);

export const meta = pgTable("meta", {
  key: varchar("key", { length: 64 }).primaryKey(),
  value: text("value").notNull(),
});`
  },
  {
    path: "src/db/index.ts",
    category: "Database & Schema",
    description: "Database connection initializer creating a pg.Pool instance with process.env.DATABASE_URL and exporting Drizzle ORM instance.",
    lines: 18,
    tags: ["PostgreSQL Pool", "Connection Singleton"],
    code: `import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool);`
  },
  {
    path: "scripts/migrate.ts",
    category: "Scripts & Tools",
    description: "Production migration script that creates all PostgreSQL tables, adds missing columns idempotently, and reports status.",
    lines: 90,
    tags: ["Migration", "DDL", "PostgreSQL DDL"],
    code: `import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  console.log("Connecting to database...");
  await pool.query("SELECT 1");
  const ddl = \`
    CREATE TABLE IF NOT EXISTS anime (...);
    CREATE TABLE IF NOT EXISTS seasons (...);
    CREATE TABLE IF NOT EXISTS episodes (...);
    CREATE TABLE IF NOT EXISTS cast_members (...);
    CREATE TABLE IF NOT EXISTS meta (...);
  \`;
  await pool.query(ddl);
  console.log("Migration complete.");
  await pool.end();
}
migrate().catch(console.error);`
  },
  {
    path: "src/app/api/search/route.ts",
    category: "Backend API",
    description: "Search API endpoint querying local database, TMDB search API, and AniList GraphQL in parallel and returning normalized results.",
    lines: 45,
    tags: ["Backend Route", "Parallel Fetch", "TMDB", "AniList"],
    code: `import { NextResponse, type NextRequest } from "next/server";
import { searchAnime } from "@/lib/data";
import { searchTmdb, tmdbImage } from "@/lib/tmdb";
import { fetchFromAniList } from "@/lib/anilist";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (!q.trim()) return NextResponse.json({ results: [], tmdb: [], anilist: [] });

  const [local, tmdbResults, anilistResults] = await Promise.all([
    searchAnime(q, 10),
    searchTmdb(q).catch(() => []),
    fetchFromAniList({ search: q, perPage: 12 }).catch(() => []),
  ]);

  const tmdb = tmdbResults.filter((r) => r.poster_path).slice(0, 12).map((r) => ({
    tmdbId: r.id,
    title: r.name || r.title || "",
    poster: tmdbImage(r.poster_path, "w500"),
    backdrop: tmdbImage(r.backdrop_path, "w780"),
    year: Number((r.first_air_date || r.release_date || "").split("-")[0]) || 0,
    rating: Math.round(r.vote_average * 10) / 10,
    type: r.media_type === "movie" ? "Movie" : "TV",
    overview: r.overview?.slice(0, 120) || "",
  }));

  const anilist = anilistResults.map((r) => ({
    anilistId: r.id,
    title: r.title.english || r.title.romaji,
    poster: r.coverImage.large,
    year: r.startDate?.year || 0,
    rating: Math.round((r.averageScore / 10) * 10) / 10,
    type: r.type === "ANIME" ? "Anime" : "Manga",
    overview: r.description?.slice(0, 120) || "",
  }));

  return NextResponse.json({ results: local, tmdb, anilist });
}`
  },
  {
    path: "src/app/api/seed-show/route.ts",
    category: "Backend API",
    description: "Auto-seeding backend endpoint that takes a tmdbId or anilistId, queries TMDB for full season breakdown, episode runtimes, logos, and cast credits, and inserts them into PostgreSQL.",
    lines: 165,
    tags: ["Auto-Seed", "Database Insert", "Credits", "Logos"],
    code: `export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tmdbId, anilistId, type = "tv" } = body;
  // Check if show already exists in DB
  const existing = await db.select({ slug: anime.slug }).from(anime).where(cond).limit(1);
  if (existing[0]) return NextResponse.json({ slug: existing[0].slug });

  // Fetch from TMDB, create anime row, season rows, episode rows, and cast credits
  const show = await getShow(finalTmdbId);
  const [row] = await db.insert(anime).values({...}).returning({ id: anime.id });
  await db.insert(seasons).values(...);
  await db.insert(episodes).values(...);
  await db.insert(castMembers).values(...);
  return NextResponse.json({ slug });
}`
  },
  {
    path: "src/app/api/anime-world-india/v1/stream.php/route.ts",
    category: "Backend API",
    description: "Compatibility endpoint for AnimeWorld India Hindi stream resolver, finding Hindi audio dubs and episode metadata.",
    lines: 30,
    tags: ["Hindi Dubs", "Streaming API", "AWI"],
    code: `import { NextResponse, type NextRequest } from "next/server";
import { awiStream } from "@/lib/animeWorldIndia";

export async function GET(req: NextRequest) {
  const episodeId = req.nextUrl.searchParams.get("episodeId")?.trim();
  const movieId = req.nextUrl.searchParams.get("movieId")?.trim();
  const data = await awiStream({ episodeId, movieId });
  return NextResponse.json(data);
}`
  },
  {
    path: "src/lib/tmdb.ts",
    category: "Scripts & Tools",
    description: "TMDB API client featuring an automated rotating pool of 18 public API keys from freekeys package, automatic fallback upon rate-limits, and helpers for shows, movies, seasons, logos, and credits.",
    lines: 165,
    tags: ["TMDB Client", "Key Rotation", "freekeys", "Rate-limit handling"],
    code: `const TMDB_KEYS = [
  "e547e17d4e91f3e62a571655cd1ccaff",
  "fb7bb23f03b6994dafc674c074d01761",
  "e55425032d3d0f371fc776f302e7c09b",
  "8301a21598f8b45668d5711a814f01f6",
  "8cf43ad9c085135b9479ad5cf6bbcbda",
  "da63548086e399ffc910fbc08526df05",
];
// Key rotation logic and API helpers...`
  },
  {
    path: "src/lib/animeWorldIndia.ts",
    category: "Scripts & Tools",
    description: "AnimeWorld India compatibility layer formatting season, episode, and stream models with Hindi language streams and episode mapping.",
    lines: 160,
    tags: ["Hindi Dubs", "AWI Protocol", "ID Parsing"],
    code: `export function episodeIdFor(slug: string, season: number, episode: number) {
  return \`\${slug}-season-\${season}-episode-\${episode}\`;
}
export async function awiStream({ episodeId }: any) {
  // Parse episodeId, look up bundle, and return stream link
}`
  },
  {
    path: "src/lib/progress.ts",
    category: "Scripts & Tools",
    description: "Client-side progress store using localStorage and custom Window events (aniverse:watched-changed, aniverse:list-changed) to sync playback progress, watched badges, and bookmarking across components.",
    lines: 110,
    tags: ["State Sync", "localStorage", "Event Dispatcher"],
    code: `export const PROGRESS_KEY = "aniverse:progress";
export const WATCHED_KEY = "aniverse:watched";
export const LIST_KEY = "aniverse:list";
// Watch progress map & bookmark toggling methods...`
  },
  {
    path: "package.json",
    category: "Config & Deployment",
    description: "Next.js 16 package.json with dependencies for Drizzle ORM, PostgreSQL driver (pg), Framer Motion, Lucide icons, Tailwind CSS 4, and migration scripts.",
    lines: 40,
    tags: ["Next.js 16", "Drizzle", "PostgreSQL", "Tailwind 4"],
    code: `{
  "name": "nextjs-postgresql-template",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "migrate": "npx tsx scripts/migrate.ts",
    "db:push": "npx drizzle-kit push --force"
  },
  "dependencies": {
    "dotenv": "17.3.1",
    "drizzle-orm": "0.45.2",
    "framer-motion": "^14.3.0",
    "lucide-react": "^1.59.0",
    "next": "16.2.6",
    "pg": "8.20.0",
    "react": "19.2.6",
    "react-dom": "19.2.6"
  }
}`
  },
  {
    path: "Dockerfile",
    category: "Config & Deployment",
    description: "Multi-stage Dockerfile using Alpine Linux Node 20 base, deps caching, Next.js standalone build stage, and hardened non-root runner user on port 3000.",
    lines: 36,
    tags: ["Docker", "Multi-stage", "Standalone Next.js", "Production"],
    code: `FROM node:20-alpine AS base
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

FROM base AS runner
WORKDIR /app
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]`
  },
  {
    path: "railway.json",
    category: "Config & Deployment",
    description: "Railway deployment configuration using NIXPACKS builder, automatic health check path at /api/health, and failure restart policies.",
    lines: 15,
    tags: ["Railway", "Nixpacks", "Health Check"],
    code: `{
  "$schema": "https://railway.app/railway.schema.json",
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "npm run start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 120,
    "restartPolicyType": "ON_FAILURE"
  }
}`
  },
  {
    path: "vercel.json",
    category: "Config & Deployment",
    description: "Vercel deployment configuration with 60s max execution duration for all serverless API functions and strict security headers.",
    lines: 20,
    tags: ["Vercel", "Serverless", "Security Headers"],
    code: `{
  "version": 2,
  "framework": "nextjs",
  "functions": {
    "src/app/api/**": { "maxDuration": 60 }
  },
  "headers": [
    { "source": "/(.*)", "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "X-Frame-Options", "value": "SAMEORIGIN" }
    ]}
  ]
}`
  },
  {
    path: "README.md",
    category: "Documentation",
    description: "Complete ANIVERSE project documentation with deployment guides for Neon PostgreSQL, Vercel, Railway, Docker, and API overview.",
    lines: 140,
    tags: ["Documentation", "Deploy Guide", "Neon", "Railway"],
    code: `# ANIVERSE — Free Anime Streaming Platform
A full-stack anime streaming website built with Next.js 16, PostgreSQL (via Drizzle ORM), TMDB API, AniList GraphQL, and multiple streaming servers (TG Server, VidSrc, VidStuck).

Features:
• 47+ anime series and movies with real TMDB metadata
• Multi-server streaming (TG, VidSrc ICU, VidSrc SBS, VidStuck, AnimeWorld India)
• MP4 download via freeserver77 API
• Live search across TMDB + AniList with auto-seeding
• Continue Watching & My List (localStorage)
• Season browser with episode grid`
  }
];
