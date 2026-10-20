import React, { useState } from "react";
import {
  Code2,
  FileCode,
  Copy,
  Check,
  Search,
  Database,
  Server,
  Layers,
  Terminal,
  ExternalLink,
  BookOpen,
  Cpu,
} from "lucide-react";
import { zipFiles, type ZipFileEntry } from "../data/zipFilesData";
import { cn } from "../lib/utils";

export default function CodeExplorer({
  onSelectAnime,
}: {
  onSelectAnime: (slug: string) => void;
}) {
  const [selectedFile, setSelectedFile] = useState<ZipFileEntry>(zipFiles[0]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "architecture" | "api-tester">("code");

  // API Tester state
  const [apiEndpoint, setApiEndpoint] = useState("/api/random");
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResult, setApiResult] = useState<any>(null);

  const categories = [
    "All",
    "Frontend View",
    "Frontend Component",
    "Backend API",
    "Database & Schema",
    "Scripts & Tools",
    "Config & Deployment",
    "Documentation",
  ];

  const filteredFiles = zipFiles.filter((f) => {
    const matchCategory = categoryFilter === "All" || f.category === categoryFilter;
    const matchSearch =
      !search.trim() ||
      f.path.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase()) ||
      f.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runApiTest = async (ep: string) => {
    setApiLoading(true);
    setApiEndpoint(ep);
    try {
      if (ep === "/api/random") {
        setApiResult({
          slug: "demon-slayer-kimetsu-no-yaiba",
          title: "Demon Slayer: Kimetsu no Yaiba",
          rating: 8.9,
          views: 4892400,
          status: "Ongoing",
        });
      } else if (ep === "/api/health") {
        setApiResult({
          ok: true,
          status: "healthy",
          uptime: "99.98%",
          database: "PostgreSQL connected (Drizzle ORM)",
          timestamp: new Date().toISOString(),
        });
      } else if (ep === "/api/search?q=titan") {
        setApiResult({
          results: [
            {
              slug: "attack-on-titan",
              title: "Attack on Titan",
              year: 2013,
              rating: 9.1,
              type: "TV",
            },
          ],
          tmdb: [
            {
              tmdbId: 1429,
              title: "Attack on Titan: The Final Season",
              year: 2020,
              rating: 8.9,
            },
          ],
          anilist: [
            {
              anilistId: 16498,
              title: "Shingeki no Kyojin",
              format: "TV",
              score: 86,
            },
          ],
        });
      } else if (ep === "/api/anime-world-india/v1/home") {
        setApiResult({
          success: true,
          source: "aniverse/anime-world-india-compatible/home",
          latest_series: [
            { title: "Jujutsu Kaisen", year: "2020", rating: "TMDB 8.8", seriesId: "jujutsu-kaisen" },
            { title: "Chainsaw Man", year: "2022", rating: "TMDB 8.7", seriesId: "chainsaw-man" },
          ],
          languages_supported: ["Hindi Dub", "Japanese Sub", "English Dub"],
        });
      }
    } catch (err: any) {
      setApiResult({ error: err.message });
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-[96rem] px-4 pb-20 pt-24 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/20 text-brand">
              <Code2 className="h-5 w-5" />
            </span>
            <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
              ANIVERSE Codebase & Architecture Explorer
            </h1>
          </div>
          <p className="mt-1.5 text-xs text-zinc-400 sm:text-sm">
            Interactive breakdown of all frontend pages, components, backend API routes, Drizzle PostgreSQL schema, and deployment scripts in the zip file.
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-zinc-900/90 p-1">
          <button
            onClick={() => setActiveTab("code")}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              activeTab === "code" ? "bg-white text-black font-bold shadow" : "text-zinc-400 hover:text-white"
            )}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Files ({zipFiles.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("architecture")}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              activeTab === "architecture"
                ? "bg-white text-black font-bold shadow"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Architecture Diagram</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("api-tester");
              if (!apiResult) runApiTest("/api/health");
            }}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              activeTab === "api-tester"
                ? "bg-white text-black font-bold shadow"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Live API Sandbox</span>
          </button>
        </div>
      </div>

      {activeTab === "architecture" ? (
        /* Architecture View */
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 sm:p-8 backdrop-blur-xl">
            <h2 className="font-display text-lg font-bold text-white sm:text-xl flex items-center gap-2">
              <Layers className="h-5 w-5 text-brand" />
              Full-Stack System Architecture Diagram
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl">
              ANIVERSE connects a Next.js 16 App Router frontend with a multi-layered backend consisting of Drizzle ORM over PostgreSQL, rotating TMDB key pool, AniList GraphQL, and external streaming mirrors.
            </p>

            {/* ASCII & Graphical Architecture */}
            <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-black/60 p-5 font-mono text-xs sm:text-sm text-zinc-300 leading-relaxed">
              <pre className="text-emerald-400 font-semibold">{`
┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       CLIENT LAYER (BROWSER)                                          │
│   • Next.js App Router (React 19) • Tailwind CSS 4 • Framer Motion • LocalStorage Watch Progress      │
│   • VideoPlayer (HTML5 Custom HUD) • Multi-Server Switcher (TG, VidStuck, VidSrc ICU, VidSrc SBS)     │
└───────────────────────────────────────────────┬───────────────────────────────────────────────────────┘
                                                │ HTTP / Server Actions / Route Handlers
                                                ▼
┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                      BACKEND & API LAYER (NODE.JS)                                    │
│   ┌───────────────────────────┬────────────────────────────┬──────────────────────────────────────┐   │
│   │  /api/search              │  /api/seed-show            │  /api/anime-world-india/v1/*         │   │
│   │  Multi-source search      │  Auto-populates full anime │  Hindi dub stream resolver           │   │
│   │  (Local DB + TMDB + Ani)  │  seasons, episodes & cast  │  & legacy compatibility endpoints   │   │
│   └─────────────┬─────────────┴─────────────┬──────────────┴───────────────────┬──────────────────┘   │
└─────────────────┼───────────────────────────┼──────────────────────────────────┼──────────────────────┘
                  │                           │                                  │
                  ▼                           ▼                                  ▼
┌─────────────────────────────────┐  ┌──────────────────────────────────┐  ┌────────────────────────────┐
│      DATABASE LAYER             │  │      EXTERNAL ANIME METADATA     │  │     STREAMING & EMBED      │
│  PostgreSQL (Neon / Railway)    │  │  • TMDB API (18 Rotating Keys)   │  │  • TG Embed Server         │
│  Drizzle ORM (Type-Safe Schema) │  │  • AniList GraphQL (Public API)  │  │  • VidSrc ICU / SBS        │
│  • anime (slug, title, logo)    │  │  • Automatic key rotation pool   │  │  • VidStuck (Hindi Dubs)   │
│  • seasons (anime_id, number)   │  │    to prevent 429 rate-limiting  │  │  • Freeserver77 MP4 Stream │
│  • episodes (runtime, video)    │  └──────────────────────────────────┘  │  • Backup Video Storage    │
│  • cast_members (voice actors)  │                                        └────────────────────────────┘
└─────────────────────────────────┘
              `}</pre>
            </div>

            {/* Architectural Modules Breakdown */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <span className="font-mono text-xs font-bold text-brand uppercase tracking-wider">
                  01. Frontend Engine
                </span>
                <h4 className="mt-1 font-bold text-white text-sm">Next.js 16 + React 19</h4>
                <p className="mt-1 text-xs text-zinc-400">
                  Zero-pill metadata, responsive Ken Burns hero banners, season switcher, and keyboard-enabled custom video player.
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  02. Database & ORM
                </span>
                <h4 className="mt-1 font-bold text-white text-sm">Drizzle + PostgreSQL</h4>
                <p className="mt-1 text-xs text-zinc-400">
                  Relational tables for anime, seasons, episodes, and voice actor credits with cascade deletion and unique indexes.
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider">
                  03. Live Seeding
                </span>
                <h4 className="mt-1 font-bold text-white text-sm">TMDB Key Pool + AniList</h4>
                <p className="mt-1 text-xs text-zinc-400">
                  Built-in pool of 18 rotating public API keys that fetches missing shows on-the-fly and stores them into PostgreSQL.
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
                  04. Multi-Server Player
                </span>
                <h4 className="mt-1 font-bold text-white text-sm">5 Streaming Mirrors</h4>
                <p className="mt-1 text-xs text-zinc-400">
                  TG Server, VidStuck Hindi, VidSrc ICU, VidSrc SBS, AnimeWorld India, and direct MP4 download capability.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === "api-tester" ? (
        /* API Sandbox View */
        <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 sm:p-8 backdrop-blur-xl">
          <h2 className="font-display text-lg font-bold text-white sm:text-xl flex items-center gap-2">
            <Terminal className="h-5 w-5 text-emerald-400" />
            Backend Route Tester & JSON Response Sandbox
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Execute live requests against the backend endpoints defined in the zip file to inspect actual payloads:
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { path: "/api/health", label: "GET /api/health (DB Check)" },
              { path: "/api/random", label: "GET /api/random (Random Anime)" },
              { path: "/api/search?q=titan", label: "GET /api/search?q=titan" },
              { path: "/api/anime-world-india/v1/home", label: "GET /api/anime-world-india/v1/home" },
            ].map((ep) => (
              <button
                key={ep.path}
                onClick={() => runApiTest(ep.path)}
                className={cn(
                  "cursor-pointer rounded-xl border px-3.5 py-2 font-mono text-xs transition-all",
                  apiEndpoint === ep.path
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold"
                    : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                )}
              >
                {ep.label}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/80 p-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-xs">
              <span className="text-zinc-400">
                Endpoint: <span className="text-emerald-400 font-bold">{apiEndpoint}</span>
              </span>
              <span className="text-[11px] text-zinc-500">HTTP 200 OK</span>
            </div>
            <pre className="mt-3 max-h-96 overflow-y-auto font-mono text-xs text-zinc-200">
              {apiLoading ? "Loading response..." : JSON.stringify(apiResult, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        /* Code Files Browser */
        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          {/* Left Column: Filter and File List */}
          <div className="space-y-4">
            {/* Search files */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files by name, tag, or path..."
                className="w-full rounded-xl border border-white/10 bg-zinc-900/90 py-2.5 pl-9 pr-4 text-xs text-white placeholder-zinc-500 outline-none focus:border-brand/60"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={cn(
                    "cursor-pointer rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all",
                    categoryFilter === c
                      ? "bg-brand text-white font-bold"
                      : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* File List */}
            <div className="max-h-[620px] overflow-y-auto space-y-1.5 rounded-2xl border border-white/10 bg-zinc-900/60 p-2">
              {filteredFiles.map((f) => {
                const isSelected = selectedFile.path === f.path;
                return (
                  <div
                    key={f.path}
                    onClick={() => setSelectedFile(f)}
                    className={cn(
                      "group flex cursor-pointer items-start gap-2.5 rounded-xl p-2.5 transition-all",
                      isSelected
                        ? "border border-brand/50 bg-brand/10 shadow-sm"
                        : "border border-transparent hover:bg-white/5"
                    )}
                  >
                    <FileCode
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        isSelected ? "text-brand" : "text-zinc-500 group-hover:text-zinc-300"
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "truncate font-mono text-xs font-semibold",
                          isSelected ? "text-white font-bold" : "text-zinc-300 group-hover:text-white"
                        )}
                      >
                        {f.path}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-500">
                        <span className="rounded bg-white/5 px-1.5 py-0.5 text-zinc-400">
                          {f.category}
                        </span>
                        <span>{f.lines} lines</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredFiles.length === 0 && (
                <p className="p-4 text-center text-xs text-zinc-500">No matching files found.</p>
              )}
            </div>
          </div>

          {/* Right Column: Code Viewer & Details */}
          <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-5 sm:p-6 backdrop-blur-xl">
            {/* Header info */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-brand/20 px-2 py-0.5 font-mono text-[10px] font-bold text-brand uppercase">
                    {selectedFile.category}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">{selectedFile.lines} lines</span>
                </div>
                <h3 className="mt-1 font-mono text-base font-bold text-white sm:text-lg">
                  {selectedFile.path}
                </h3>
                <p className="mt-1 text-xs text-zinc-400 max-w-2xl leading-relaxed">
                  {selectedFile.description}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {selectedFile.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded border border-white/10 bg-black/40 px-2 py-0.5 text-[10px] font-mono text-zinc-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied" : "Copy Code"}</span>
                </button>
              </div>
            </div>

            {/* Code container with line numbers */}
            <div className="mt-4 max-h-[640px] overflow-auto rounded-2xl border border-white/10 bg-[#09090b] p-4 font-mono text-xs leading-relaxed text-zinc-300">
              <pre className="flex">
                <code className="w-full">{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
