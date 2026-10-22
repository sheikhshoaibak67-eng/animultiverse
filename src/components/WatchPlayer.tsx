import React, { useState, useEffect } from "react";
import { MonitorPlay, Zap, ExternalLink, Plus, Check, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import { cn } from "../lib/utils";

type DemoProps = {
  src: string;
  poster: string;
  storageKey: string;
  meta: {
    slug: string;
    title: string;
    cover: string;
    season: number;
    ep: number;
    epTitle: string;
  };
  onBack: () => void;
  nextEpisode?: () => void;
  prevEpisode?: () => void;
  hasNext: boolean;
  hasPrev: boolean;
};

export default function WatchPlayer({
  animeTitle,
  season,
  episode,
  tmdbId,
  type,
  embedAnimeSalt,
  embedTgvid,
  embedVidsrcIcu,
  embedVidsrcSbs,
  embedVidsrcMe,
  embedAutoembed,
  demo,
}: {
  animeTitle?: string;
  season?: number;
  episode?: number;
  tmdbId?: number;
  type?: string;
  embedAnimeSalt?: string | null;
  embedTgvid?: string | null;
  embedVidsrcIcu?: string | null;
  embedVidsrcSbs?: string | null;
  embedVidsrcMe?: string | null;
  embedAutoembed?: string | null;
  demo: DemoProps;
}) {
  const [customServerUrl, setCustomServerUrl] = useState<string>(() => {
    return localStorage.getItem("aniverse_custom_server") || "";
  });
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInputDraft, setCustomInputDraft] = useState(customServerUrl);

  // AnimeSalt automated resolution state
  const [animeSaltUrl, setAnimeSaltUrl] = useState<string | null>(embedAnimeSalt || null);
  const [animeSaltLoading, setAnimeSaltLoading] = useState(false);
  const [animeSaltError, setAnimeSaltError] = useState<string | null>(null);
  const [manualFallbackUrl, setManualFallbackUrl] = useState<string>("");
  const [manualFallbackDraft, setManualFallbackDraft] = useState<string>("");
  const [resolveAttempt, setResolveAttempt] = useState(0);

  // Auto-resolve AnimeSalt stream URL when anime or episode changes
  useEffect(() => {
    if (embedAnimeSalt) {
      setAnimeSaltUrl(embedAnimeSalt);
      setAnimeSaltError(null);
      setAnimeSaltLoading(false);
      return;
    }

    if (!animeTitle) return;

    let cancelled = false;
    setAnimeSaltLoading(true);
    setAnimeSaltError(null);

    const queryParams = new URLSearchParams({
      title: animeTitle,
      season: String(season || 1),
      episode: String(episode || 1),
      ...(tmdbId ? { tmdbId: String(tmdbId) } : {}),
      ...(type ? { type } : {}),
    });

    fetch(`/api/anime-source/animesalt?${queryParams}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (data.success && data.embedUrl) {
          setAnimeSaltUrl(data.embedUrl);
          setAnimeSaltError(null);
        } else {
          setAnimeSaltError(data.error || "Automated retrieval could not locate this episode on AnimeSalt.");
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setAnimeSaltError(err?.message || "Failed to connect to episode resolver.");
      })
      .finally(() => {
        if (!cancelled) setAnimeSaltLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [animeTitle, season, episode, tmdbId, type, embedAnimeSalt, resolveAttempt]);

  // Server definitions - AnimeSalt is default server
  const servers = [
    {
      id: "animesalt",
      label: "Server 1 (AnimeSalt)",
      tag: "AnimeSalt • Ravok HD Player (Default)",
    },
    ...(embedTgvid ? [{ id: "tgvid", label: "Server 2 (TGVID)", tag: "TGVID • Ultra Fast HD Player" }] : []),
    ...(embedVidsrcIcu ? [{ id: "vidsrc-icu", label: "Server 3 (AniMovie)", tag: "VidSrc ICU • Sub/Dub HD" }] : []),
    ...(embedVidsrcSbs ? [{ id: "vidsrc-sbs", label: "Server 4 (VidSrc SBS)", tag: "VidSrc SBS • Multi-Server" }] : []),
    ...(embedVidsrcMe ? [{ id: "vidsrc-me", label: "Server 5 (VidSrc Me)", tag: "VidSrc Me • High Speed" }] : []),
    ...(embedAutoembed ? [{ id: "autoembed", label: "Server 6 (AutoEmbed)", tag: "AutoEmbed Stream" }] : []),
    ...(customServerUrl ? [{ id: "custom", label: "Custom Server", tag: "User Added Server Stream" }] : []),
    { id: "demo", label: "Backup Player", tag: "High-Speed Demo Stream" },
  ];

  const [active, setActive] = useState<string>("animesalt");

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInputDraft.trim();
    setCustomServerUrl(trimmed);
    localStorage.setItem("aniverse_custom_server", trimmed);
    setShowCustomInput(false);
    if (trimmed) {
      setActive("custom");
    }
  };

  const handleManualFallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = manualFallbackDraft.trim();
    if (trimmed) {
      setManualFallbackUrl(trimmed);
      setAnimeSaltError(null);
    }
  };

  const effectiveAnimeSaltEmbed = manualFallbackUrl.trim() || animeSaltUrl;

  const embedUrl = (() => {
    switch (active) {
      case "animesalt":
        return effectiveAnimeSaltEmbed;
      case "tgvid":
        return embedTgvid;
      case "vidsrc-icu":
        return embedVidsrcIcu;
      case "vidsrc-sbs":
        return embedVidsrcSbs;
      case "vidsrc-me":
        return embedVidsrcMe;
      case "autoembed":
        return embedAutoembed;
      case "custom":
        return customServerUrl;
      default:
        return null;
    }
  })();

  return (
    <div className="space-y-4">
      {/* Server selector tabs */}
      <div className="glass rounded-2xl p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 pl-1">
            <MonitorPlay className="h-4 w-4 text-brand-soft" />
            <span className="text-xs sm:text-sm font-semibold text-white">
              {servers.find((s) => s.id === active)?.tag ?? "HD Streaming"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {servers.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                aria-pressed={s.id === active}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all",
                  s.id === active
                    ? "bg-brand text-white shadow-md font-bold"
                    : "bg-white/5 text-zinc-400 hover:text-white"
                )}
              >
                {s.id === active && <Zap className="h-3 w-3" />}
                {s.label}
              </button>
            ))}

            <button
              onClick={() => setShowCustomInput((v) => !v)}
              className="flex cursor-pointer items-center gap-1 rounded-full border border-dashed border-white/20 bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] text-zinc-400 hover:border-white/40 hover:text-white transition-colors"
              title="Add custom server URL"
            >
              <Plus className="h-3 w-3" />
              <span>{customServerUrl ? "Edit Server" : "Add Server"}</span>
            </button>
          </div>
        </div>

        {/* Custom Server Input Bar */}
        {showCustomInput && (
          <form onSubmit={handleSaveCustom} className="mt-3 flex items-center gap-2 pt-2 border-t border-white/10">
            <input
              type="url"
              placeholder="Paste embed/server URL (e.g. https://server.com/embed/...)"
              value={customInputDraft}
              onChange={(e) => setCustomInputDraft(e.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-brand focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white transition-all hover:bg-brand-deep cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" />
              Save
            </button>
            {customServerUrl && (
              <button
                type="button"
                onClick={() => {
                  setCustomServerUrl("");
                  setCustomInputDraft("");
                  localStorage.removeItem("aniverse_custom_server");
                  setShowCustomInput(false);
                  setActive("animesalt");
                }}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-400 hover:text-red-400 cursor-pointer"
              >
                Remove
              </button>
            )}
          </form>
        )}

        {active !== "demo" && (
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-zinc-500">
            <span>
              Streaming via active mirror ({active === "animesalt" ? "AnimeSalt Source" : "Direct Mirror"}).
              Switch servers if blocked or buffering.
            </span>
            {embedUrl && (
              <a
                href={embedUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-zinc-400 hover:text-white"
              >
                <ExternalLink className="h-3 w-3" />
                Open Direct
              </a>
            )}
          </div>
        )}
      </div>

      {/* ACTIVE: AnimeSalt loading state */}
      {active === "animesalt" && animeSaltLoading && !effectiveAnimeSaltEmbed && (
        <div className="relative aspect-video w-full flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-zinc-950 p-6 text-center shadow-2xl">
          <Loader2 className="h-10 w-10 animate-spin text-brand" />
          <h3 className="mt-4 font-display text-base font-bold text-white">Loading AnimeSalt Episode Source</h3>
          <p className="mt-1 text-xs text-zinc-400 max-w-sm">
            Searching AnimeSalt and extracting authorized player embed for {animeTitle || "anime"} S{season || 1}:E{episode || 1}...
          </p>
        </div>
      )}

      {/* ACTIVE: AnimeSalt error & manual fallback state */}
      {active === "animesalt" && !animeSaltLoading && !effectiveAnimeSaltEmbed && animeSaltError && (
        <div className="relative aspect-video w-full flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-zinc-950/95 p-6 text-center shadow-2xl">
          <AlertCircle className="h-10 w-10 text-amber-500 mb-2" />
          <h3 className="font-display text-base font-bold text-white">AnimeSalt Source Notice</h3>
          <p className="mt-1 max-w-md text-xs text-zinc-400">
            {animeSaltError}
          </p>

          {/* Manual Embed Fallback Form */}
          <div className="mt-4 w-full max-w-md rounded-xl border border-white/10 bg-white/[0.02] p-3 text-left">
            <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
              Manual Embed URL Fallback
            </label>
            <form onSubmit={handleManualFallbackSubmit} className="flex items-center gap-2">
              <input
                type="url"
                placeholder="e.g. https://ravok.buzz/video/..."
                value={manualFallbackDraft}
                onChange={(e) => setManualFallbackDraft(e.target.value)}
                className="flex-1 rounded-lg border border-white/15 bg-black px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-brand focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-deep cursor-pointer"
              >
                Load
              </button>
            </form>
            <span className="text-[10px] text-zinc-500 mt-1 block">
              Enter any supported embed player URL to stream this episode directly in the player.
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setResolveAttempt((v) => v + 1)}
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-zinc-300 hover:bg-white/15 cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" /> Retry Auto-Fetch
            </button>
            {embedTgvid && (
              <button
                onClick={() => setActive("tgvid")}
                className="rounded-full bg-brand px-3.5 py-1 text-xs font-bold text-white hover:bg-brand-deep cursor-pointer"
              >
                Switch to Server 2 (TGVID)
              </button>
            )}
            <button
              onClick={() => setActive("demo")}
              className="rounded-full bg-white/10 px-3.5 py-1 text-xs text-zinc-200 hover:bg-white/20 cursor-pointer"
            >
              Use Backup Player
            </button>
          </div>
        </div>
      )}

      {/* Embed player iframe or VideoPlayer */}
      {active !== "demo" && embedUrl ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
          <iframe
            key={embedUrl}
            src={embedUrl}
            width="100%"
            height="100%"
            allowFullScreen
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            title="Anime Stream Player"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      ) : active === "demo" ? (
        <VideoPlayer {...demo} />
      ) : null}
    </div>
  );
}
