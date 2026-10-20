// Client-side watch progress and user watchlist stored in localStorage.
export type ProgressEntry = {
  slug: string;
  title: string;
  cover: string;
  season: number;
  ep: number;
  epTitle: string;
  /** current position, seconds */
  t: number;
  /** duration, seconds */
  d: number;
  /** last updated, epoch ms */
  at: number;
};

export const PROGRESS_KEY = "aniverse:progress";
export const WATCHED_KEY = "aniverse:watched";
export const AUTONEXT_KEY = "aniverse:autonext";
export const LIST_KEY = "aniverse:list";
export const LIST_EVENT = "aniverse:list-changed";
export const PROGRESS_EVENT = "aniverse:progress-changed";

function hasWindow(): boolean {
  return typeof window !== "undefined";
}

export function readProgressMap(): Record<string, ProgressEntry> {
  if (!hasWindow()) return {};
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writeProgressEntry(entry: ProgressEntry) {
  if (!hasWindow()) return;
  try {
    const map = readProgressMap();
    map[`${entry.slug}:s${entry.season}:e${entry.ep}`] = entry;
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  } catch {
    /* storage full */
  }
}

export function removeProgressEntry(storageKey: string) {
  if (!hasWindow()) return;
  try {
    const map = readProgressMap();
    delete map[storageKey];
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  } catch {
    /* noop */
  }
}

export function readWatched(): string[] {
  if (!hasWindow()) return [];
  try {
    const raw = window.localStorage.getItem(WATCHED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function markWatched(storageKey: string) {
  if (!hasWindow()) return;
  try {
    const list = readWatched();
    if (!list.includes(storageKey)) {
      list.push(storageKey);
      window.localStorage.setItem(WATCHED_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event("aniverse:watched-changed"));
    }
  } catch {
    /* noop */
  }
}

/* --------------------------------- my list -------------------------------- */

export type ListItem = {
  slug: string;
  title: string;
  cover: string;
  year: number;
  rating: number;
  type: string;
  totalEpisodes: number;
  genres: string[];
};

export function readListItems(): ListItem[] {
  if (!hasWindow()) return [];
  try {
    const raw = window.localStorage.getItem(LIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is ListItem => x && typeof x === "object" && typeof x.slug === "string",
    );
  } catch {
    return [];
  }
}

export function writeListItems(items: ListItem[]) {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(LIST_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(LIST_EVENT));
  } catch {
    /* noop */
  }
}

export function isListed(slug: string): boolean {
  return readListItems().some((x) => x.slug === slug);
}

/** Returns the new listed state. */
export function toggleListItem(item: ListItem): boolean {
  const items = readListItems();
  const exists = items.some((x) => x.slug === item.slug);
  writeListItems(
    exists ? items.filter((x) => x.slug !== item.slug) : [item, ...items],
  );
  return !exists;
}

export function removeFromList(slug: string) {
  writeListItems(readListItems().filter((x) => x.slug !== slug));
}
