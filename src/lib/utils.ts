export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function formatViews(v: number): string {
  if (v >= 1_000_000) return (v / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (v >= 1_000) return Math.round(v / 1e3) + "K";
  return String(v);
}

/** 1422 -> "23m" or "1h 4m" */
export function formatDuration(seconds: number): string {
  const m = Math.round(seconds / 60);
  if (m >= 60) return `${Math.floor(m / 60)}h ${m % 60}m`;
  return `${m}m`;
}

/** 1422 -> "23:42" (player clock) */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const s = Math.floor(seconds % 60);
  const m = Math.floor(seconds / 60) % 60;
  const h = Math.floor(seconds / 3600);
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
