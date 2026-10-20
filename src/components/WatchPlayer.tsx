import React, { useState } from "react";
import { MonitorPlay, Zap, ExternalLink, Plus, Check } from "lucide-react";
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
  embedTgvid,
  embedVidsrcIcu,
  embedVidsrcSbs,
  embedVidsrcMe,
  embedAutoembed,
  demo,
}: {
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

  const servers = [
    ...(embedTgvid ? [{ id: "tgvid", label: "Server 1 (TGVID)", tag: "TGVID • Ultra Fast HD Player" }] : []),
    ...(embedVidsrcIcu ? [{ id: "vidsrc-icu", label: "Server 2 (AniMovie)", tag: "VidSrc ICU • Sub/Dub HD" }] : []),
    ...(embedVidsrcSbs ? [{ id: "vidsrc-sbs", label: "Server 3 (VidSrc SBS)", tag: "VidSrc SBS • Multi-Server" }] : []),
    ...(embedVidsrcMe ? [{ id: "vidsrc-me", label: "Server 4 (VidSrc Me)", tag: "VidSrc Me • High Speed" }] : []),
    ...(embedAutoembed ? [{ id: "autoembed", label: "Server 5 (AutoEmbed)", tag: "AutoEmbed Stream" }] : []),
    ...(customServerUrl ? [{ id: "custom", label: "Custom Server", tag: "User Added Server Stream" }] : []),
    { id: "demo", label: "Backup Player", tag: "High-Speed Demo Stream" },
  ];

  const [active, setActive] = useState(servers[0]?.id || "demo");

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

  const embedUrl = (() => {
    switch (active) {
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
                  setActive("demo");
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
              Streaming via active mirror. If an embed is restricted by ad-blocker, switch to Backup Player.
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

      {/* Embed player or VideoPlayer */}
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
      ) : (
        <VideoPlayer {...demo} />
      )}
    </div>
  );
}
