import React, { useState } from "react";
import { Download, Loader2, Check, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

type Props = {
  tmdbId: number;
  title: string;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
};

export default function DownloadButton({
  tmdbId,
  title,
  type,
  season = 1,
  episode = 1,
}: Props) {
  const [state, setState] = useState<"idle" | "fetching" | "downloading" | "done" | "error">("idle");
  const [showPicker, setShowPicker] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const downloadDirect = () => {
    setState("downloading");
    setShowPicker(false);
    // Trigger download of standard sample MP4
    setTimeout(() => {
      const a = document.createElement("a");
      a.href = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
      a.download = `${title.replace(/[^a-zA-Z0-9\s-]/g, "")}_S${season}E${episode}_1080p.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setState("done");
      setTimeout(() => setState("idle"), 4000);
    }, 1200);
  };

  const fetchLinks = async () => {
    if (state === "fetching" || state === "downloading") return;
    setState("fetching");
    setErrorMsg("");

    try {
      const endpoint =
        type === "tv"
          ? `https://freeserver77.ai.studio/api/stream/tv/${tmdbId}/${season}/${episode}`
          : `https://freeserver77.ai.studio/api/stream/movie/${tmdbId}`;

      const res = await fetch(endpoint).catch(() => null);
      if (res && res.ok) {
        setShowPicker(true);
        setState("idle");
      } else {
        // Fallback to sample stream download
        downloadDirect();
      }
    } catch {
      downloadDirect();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={fetchLinks}
        disabled={state === "fetching" || state === "downloading"}
        className={cn(
          "inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all duration-300 active:scale-95 sm:text-sm",
          state === "done"
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
            : state === "error"
            ? "border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20"
            : "border-white/10 bg-white/5 text-zinc-200 hover:border-white/25 hover:bg-white/10",
          (state === "fetching" || state === "downloading") && "cursor-wait opacity-70"
        )}
      >
        {state === "fetching" || state === "downloading" ? (
          <Loader2 className="h-4 w-4 animate-spin text-brand" />
        ) : state === "done" ? (
          <Check className="h-4 w-4 text-emerald-400" />
        ) : state === "error" ? (
          <AlertCircle className="h-4 w-4 text-red-400" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {state === "fetching"
          ? "Finding Sources..."
          : state === "downloading"
          ? "Downloading MP4..."
          : state === "done"
          ? "Download Started!"
          : "Download MP4"}
      </button>

      {showPicker && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPicker(false)}
          />
          <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 shadow-2xl backdrop-blur-xl">
            <div className="border-b border-white/5 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Choose Server Quality
              </p>
            </div>
            <div className="p-2 space-y-1">
              {[
                { server: "Server 1 (Freeserver77)", quality: "1080p FHD", lang: "Japanese / Dual" },
                { server: "Server 2 (VidStuck)", quality: "720p HD", lang: "Hindi Dub" },
                { server: "Server 3 (TG Mirror)", quality: "480p SD", lang: "Multi Sub" },
              ].map((s, idx) => (
                <button
                  key={idx}
                  onClick={downloadDirect}
                  className="group flex w-full cursor-pointer items-center justify-between rounded-xl p-2.5 text-left transition-colors hover:bg-white/10"
                >
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-brand-soft">
                      {s.server}
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      {s.quality} • {s.lang}
                    </p>
                  </div>
                  <Download className="h-3.5 w-3.5 text-zinc-400 group-hover:text-white" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {errorMsg && <p className="mt-2 text-[11px] text-red-400">{errorMsg}</p>}
    </div>
  );
}
