import React, { useState } from "react";
import { MonitorPlay, Zap, ExternalLink } from "lucide-react";
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
  embedTg,
  embedVidstuck,
  embedVidsrcIcu,
  embedVidsrcSbs,
  embedVidsrcMe,
  embedAutoembed,
  demo,
}: {
  embedTg?: string | null;
  embedVidstuck?: string | null;
  embedVidsrcIcu?: string | null;
  embedVidsrcSbs?: string | null;
  embedVidsrcMe?: string | null;
  embedAutoembed?: string | null;
  demo: DemoProps;
}) {
  const servers = [
    ...(embedVidsrcIcu ? [{ id: "vidsrc-icu", label: "Server 1 (AniMovie)", tag: "VidSrc ICU • Sub/Dub HD" }] : []),
    ...(embedVidsrcSbs ? [{ id: "vidsrc-sbs", label: "Server 2 (VidSrc SBS)", tag: "VidSrc SBS • Multi-Server" }] : []),
    ...(embedVidsrcMe ? [{ id: "vidsrc-me", label: "Server 3 (VidSrc Me)", tag: "VidSrc Me • High Speed" }] : []),
    ...(embedVidstuck ? [{ id: "vidstuck", label: "Server 4 (Hindi Dub)", tag: "VidStuck • Hindi Audio" }] : []),
    ...(embedTg ? [{ id: "tg", label: "Server 5 (TG)", tag: "TG Direct Embed" }] : []),
    ...(embedAutoembed ? [{ id: "autoembed", label: "Server 6 (AutoEmbed)", tag: "AutoEmbed Stream" }] : []),
    { id: "demo", label: "Backup Player", tag: "High-Speed Demo Stream" },
  ];

  const [active, setActive] = useState(servers[0]?.id || "demo");

  const embedUrl = (() => {
    switch (active) {
      case "vidsrc-icu":
        return embedVidsrcIcu;
      case "vidsrc-sbs":
        return embedVidsrcSbs;
      case "vidsrc-me":
        return embedVidsrcMe;
      case "vidstuck":
        return embedVidstuck;
      case "tg":
        return embedTg;
      case "autoembed":
        return embedAutoembed;
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

          <div className="flex flex-wrap gap-2">
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
          </div>
        </div>

        {active !== "demo" && (
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-zinc-500">
            <span>
              Streaming via AniMovie external mirror{" "}
              {active === "vidstuck" ? "(Hindi Dubbed Available)" : ""}. If an embed has ad-block restrictions, switch to Backup Player.
            </span>
            {embedUrl && (
              <a
                href={embedUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-zinc-400 hover:text-white"
              >
                <ExternalLink className="h-3 w-3" />
                Open Source
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
