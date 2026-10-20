import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FastForward,
  Loader2,
  Maximize,
  Minimize,
  Pause,
  PictureInPicture2,
  Play,
  Rewind,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn, formatTime } from "../lib/utils";
import { AUTONEXT_KEY, markWatched, readProgressMap, writeProgressEntry } from "../lib/progress";

type Props = {
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

const RATES = [1, 1.25, 1.5, 2, 0.5];

export default function VideoPlayer({
  src,
  poster,
  storageKey,
  meta,
  onBack,
  nextEpisode,
  prevEpisode,
  hasNext,
  hasPrev,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const hideTimer = useRef<any>(null);
  const restored = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [controls, setControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const [ended, setEnded] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [seekPct, setSeekPct] = useState<number | null>(null);
  const [hoverPct, setHoverPct] = useState<number | null>(null);
  const [autoNext, setAutoNext] = useState(true);

  const displayTime = seekPct !== null && duration ? seekPct * duration : time;

  const save = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    writeProgressEntry({
      slug: meta.slug,
      title: meta.title,
      cover: meta.cover,
      season: meta.season,
      ep: meta.ep,
      epTitle: meta.epTitle,
      t: v.currentTime,
      d: v.duration,
      at: Date.now(),
    });
  }, [meta]);

  useEffect(() => {
    const stored = window.localStorage.getItem(AUTONEXT_KEY);
    if (stored !== null) setAutoNext(stored === "1");
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(save, 5000);
    return () => clearInterval(id);
  }, [playing, save]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const poke = useCallback(() => {
    setControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      const v = videoRef.current;
      if (v && !v.paused && !v.ended) setControls(false);
    }, 2800);
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (ended) {
      v.currentTime = 0;
      setEnded(false);
      v.play().catch(() => {});
      return;
    }
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, [ended]);

  const seekBy = useCallback(
    (delta: number) => {
      const v = videoRef.current;
      if (!v) return;
      v.currentTime = Math.min(Math.max(0, v.currentTime + delta), v.duration || 0);
      poke();
    },
    [poke]
  );

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const cycleRate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const idx = RATES.indexOf(v.playbackRate);
    const next = RATES[(idx + 1) % RATES.length];
    v.playbackRate = next;
    setRate(next);
    showToast(`Speed ${next}x`);
  }, [showToast]);

  const toggleFullscreen = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen().catch(() => {});
  }, []);

  const togglePip = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await v.requestPictureInPicture();
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const onLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration || 0);
    setLoading(false);
    if (!restored.current) {
      restored.current = true;
      const entry = readProgressMap()[storageKey];
      if (entry && entry.t > 10 && (!v.duration || entry.t < v.duration - 15)) {
        v.currentTime = Math.floor(entry.t);
        showToast(`Resumed from ${formatTime(entry.t)}`);
      }
    }
    v.play().catch(() => {});
  };

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    if (seekPct === null) setTime(v.currentTime);
    if (v.duration && v.currentTime / v.duration > 0.92) markWatched(storageKey);
  };

  const onProgress = () => {
    const v = videoRef.current;
    if (!v || !v.buffered.length) return;
    setBuffered(v.buffered.end(v.buffered.length - 1));
  };

  const onEndedVideo = () => {
    setPlaying(false);
    setEnded(true);
    setControls(true);
    markWatched(storageKey);
    save();
    if (autoNext && nextEpisode && hasNext) {
      nextEpisode();
    }
  };

  const calcPct = (clientX: number) => {
    const el = barRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - r.left) / r.width));
  };

  const playedPct = duration ? (displayTime / duration) * 100 : 0;
  const bufferedPct = duration ? Math.min(100, (buffered / duration) * 100) : 0;

  const iconBtn =
    "cursor-pointer rounded-full p-2 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white";

  return (
    <div
      ref={wrapRef}
      onMouseMove={poke}
      onTouchStart={poke}
      className={cn(
        "relative aspect-video w-full select-none overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl",
        !controls && playing && "cursor-none"
      )}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onProgress={onProgress}
        onPlay={() => {
          setPlaying(true);
          poke();
        }}
        onPause={() => {
          setPlaying(false);
          setControls(true);
          save();
        }}
        onEnded={onEndedVideo}
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
      />

      {loading && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand" />
        </div>
      )}

      {/* Paused big play button */}
      {!playing && !loading && !ended && (
        <button
          onClick={togglePlay}
          aria-label="Play"
          className="absolute inset-0 grid place-items-center cursor-pointer"
        >
          <span className="relative grid place-items-center">
            <span className="glass glow-brand grid h-16 w-16 place-items-center rounded-full transition-transform hover:scale-110 sm:h-20 sm:w-20">
              <Play className="ml-1 h-8 w-8 fill-white text-white" />
            </span>
          </span>
        </button>
      )}

      {/* Replay overlay when video ended */}
      {ended && (
        <div className="absolute inset-0 grid place-items-center bg-black/80 backdrop-blur-md">
          <div className="text-center p-6">
            <h3 className="font-display text-lg font-bold text-white sm:text-xl">
              Finished Episode {meta.ep}
            </h3>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setEnded(false);
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play().catch(() => {});
                  }
                }}
                className="glass flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:border-white/30"
              >
                <RotateCcw className="h-4 w-4" /> Replay
              </button>
              {hasNext && nextEpisode && (
                <button
                  onClick={nextEpisode}
                  className="flex cursor-pointer items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-brand-deep"
                >
                  <SkipForward className="h-4 w-4 fill-white" /> Next Episode
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="glass pointer-events-none absolute left-1/2 top-10 z-20 -translate-x-1/2 rounded-full px-4 py-1.5 text-xs font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* Controls HUD */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-between transition-opacity duration-300",
          controls || !playing ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4 bg-gradient-to-b from-black/80 to-transparent p-4">
          <button
            onClick={onBack}
            className="group flex cursor-pointer items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-white"
          >
            <span className="font-semibold">{meta.title}</span>
          </button>
          <span className="rounded bg-black/60 px-2 py-0.5 font-mono text-xs uppercase text-zinc-400">
            S{meta.season}:E{meta.ep} • {meta.epTitle}
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="bg-gradient-to-t from-black/90 to-transparent px-4 pb-3 pt-8">
          {/* Seek slider */}
          <div
            ref={barRef}
            role="slider"
            aria-label="Seek"
            tabIndex={0}
            className="group/bar relative h-5 cursor-pointer touch-none"
            onPointerDown={(e) => {
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              setSeekPct(calcPct(e.clientX));
            }}
            onPointerMove={(e) => {
              if (seekPct !== null) setSeekPct(calcPct(e.clientX));
            }}
            onPointerUp={(e) => {
              const p = calcPct(e.clientX);
              const v = videoRef.current;
              if (v && duration) {
                v.currentTime = p * duration;
                setTime(p * duration);
              }
              setSeekPct(null);
            }}
            onMouseMove={(e) => setHoverPct(calcPct(e.clientX))}
            onMouseLeave={() => setHoverPct(null)}
          >
            {hoverPct !== null && duration > 0 && (
              <span
                className="pointer-events-none absolute -top-7 -translate-x-1/2 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-white"
                style={{ left: `${hoverPct * 100}%` }}
              >
                {formatTime(hoverPct * duration)}
              </span>
            )}
            <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/20 transition-all group-hover/bar:h-2">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-white/25"
                style={{ width: `${bufferedPct}%` }}
              />
              <div
                className="glow-brand absolute inset-y-0 left-0 rounded-full bg-brand"
                style={{ width: `${playedPct}%` }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-1 flex items-center gap-1.5">
            <button onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} className={iconBtn}>
              {playing ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
            </button>

            <button onClick={() => seekBy(-10)} aria-label="Back 10s" title="Back 10s" className={iconBtn}>
              <Rewind className="h-4 w-4" />
            </button>
            <button onClick={() => seekBy(10)} aria-label="Forward 10s" title="Forward 10s" className={iconBtn}>
              <FastForward className="h-4 w-4" />
            </button>

            <div className="group/vol flex items-center">
              <button onClick={toggleMute} aria-label="Mute toggle" className={iconBtn}>
                {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (videoRef.current) {
                    videoRef.current.volume = val;
                    videoRef.current.muted = false;
                  }
                  setMuted(false);
                  setVolume(val);
                }}
                className="h-1 w-0 cursor-pointer accent-brand opacity-0 transition-all group-hover/vol:w-16 group-hover/vol:opacity-100"
              />
            </div>

            <span className="ml-2 font-mono text-xs text-zinc-300">
              {formatTime(displayTime)} / {formatTime(duration)}
            </span>

            <div className="flex-1" />

            {hasPrev && prevEpisode && (
              <button onClick={prevEpisode} title="Previous Episode" className={iconBtn}>
                <SkipForward className="h-4 w-4 -scale-x-100" />
              </button>
            )}

            {hasNext && nextEpisode && (
              <button onClick={nextEpisode} title="Next Episode" className={iconBtn}>
                <SkipForward className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={cycleRate}
              title="Playback speed"
              className="rounded-full px-2 py-1 font-mono text-xs text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              {rate}x
            </button>

            <button onClick={togglePip} aria-label="Picture in picture" className={cn(iconBtn, "hidden sm:block")}>
              <PictureInPicture2 className="h-4 w-4" />
            </button>

            <button onClick={toggleFullscreen} aria-label="Fullscreen" className={iconBtn}>
              {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
