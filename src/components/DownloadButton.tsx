import React, { useState } from "react";
import { Download, Loader2, Check } from "lucide-react";
import { cn } from "../lib/utils";

type Props = {
  tmdbId: number;
  title: string;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
};

export default function DownloadButton({
  title,
  season = 1,
  episode = 1,
}: Props) {
  const [state, setState] = useState<"idle" | "downloading" | "done">("idle");

  const handleDownload = () => {
    if (state === "downloading") return;
    setState("downloading");

    // Clean direct download
    setTimeout(() => {
      const a = document.createElement("a");
      a.href = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
      a.download = `${title.replace(/[^a-zA-Z0-9\s-]/g, "")}_S${season}E${episode}_1080p.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setState("done");
      setTimeout(() => setState("idle"), 3500);
    }, 700);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={state === "downloading"}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all duration-300 active:scale-95 sm:text-sm",
        state === "done"
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
          : "border-white/10 bg-white/5 text-zinc-200 hover:border-white/25 hover:bg-white/10",
        state === "downloading" && "cursor-wait opacity-70"
      )}
    >
      {state === "downloading" ? (
        <Loader2 className="h-4 w-4 animate-spin text-brand" />
      ) : state === "done" ? (
        <Check className="h-4 w-4 text-emerald-400" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {state === "downloading"
        ? "Starting Download..."
        : state === "done"
        ? "Download Started!"
        : "Download MP4"}
    </button>
  );
}
