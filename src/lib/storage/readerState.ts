/**
 * Per-user reader state (reading position, bookmarks, settings, cover cache).
 * Backed by localStorage for the local build; the interface is small so it can be
 * re-implemented on top of Firestore or any other store later.
 */

export type ReaderTheme = "paper" | "sepia" | "night";

export interface ReadingPosition {
  lastPage: number;
  zoom: number;
  updatedAt: string;
}

/** auto: two pages when the screen is wide enough; single/spread force one or two pages. */
export type ReaderLayout = "auto" | "single" | "spread";

export interface ReaderSettings {
  theme: ReaderTheme;
  layout: ReaderLayout;
  /** Page flip duration in milliseconds. */
  flipDuration: number;
  showPageNumbers: boolean;
}

export interface BookMeta {
  pages: number;
  cover: string | null;
  /** File size the meta was computed for; used to invalidate stale entries. */
  size: number;
}

export interface ReaderStateStore {
  getPosition(bookId: string): ReadingPosition | null;
  savePosition(bookId: string, position: Omit<ReadingPosition, "updatedAt">): void;
  clearPosition(bookId: string): void;
  getBookmarks(bookId: string): number[];
  setBookmarks(bookId: string, pages: number[]): void;
  getSettings(): ReaderSettings;
  saveSettings(settings: ReaderSettings): void;
  getMeta(bookId: string): BookMeta | null;
  setMeta(bookId: string, meta: BookMeta): void;
  forget(bookId: string): void;
}

export const DEFAULT_SETTINGS: ReaderSettings = {
  theme: "paper",
  layout: "auto",
  flipDuration: 900,
  showPageNumbers: true,
};

const PREFIX = "book-reader:";

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage full or blocked: state simply is not persisted */
  }
}

function remove(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}

export const localReaderStore: ReaderStateStore = {
  getPosition: (id) => read<ReadingPosition>(`position:${id}`),
  savePosition: (id, position) =>
    write(`position:${id}`, { ...position, updatedAt: new Date().toISOString() }),
  clearPosition: (id) => remove(`position:${id}`),
  getBookmarks: (id) => read<number[]>(`bookmarks:${id}`) ?? [],
  setBookmarks: (id, pages) =>
    write(`bookmarks:${id}`, [...new Set(pages)].sort((a, b) => a - b)),
  getSettings: () => ({
    ...DEFAULT_SETTINGS,
    ...(read<Partial<ReaderSettings>>("settings") ?? {}),
  }),
  saveSettings: (settings) => write("settings", settings),
  getMeta: (id) => read<BookMeta>(`meta:${id}`),
  setMeta: (id, meta) => write(`meta:${id}`, meta),
  forget: (id) => {
    remove(`position:${id}`);
    remove(`bookmarks:${id}`);
    remove(`meta:${id}`);
  },
};
