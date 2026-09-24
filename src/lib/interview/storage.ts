/**
 * Reading progress for the interview-prep shelf, kept in localStorage like the
 * reader and quiz state: which chapters are marked read, where you left off in
 * each book, and the preferred text size. Chapters are keyed as "book/slug".
 */

export type ProseSize = "s" | "m" | "l" | "xl";

const PREFIX = "book-reader:interview:";

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
    if (value === null) window.localStorage.removeItem(PREFIX + key);
    else window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export function chapterKey(book: string, slug: string): string {
  return `${book}/${slug}`;
}

export const interviewStore = {
  /** All chapters marked read, as "book/slug" keys. */
  getDone(): string[] {
    return read<string[]>("done") ?? [];
  },
  setDone(book: string, slug: string, done: boolean): string[] {
    const set = new Set(this.getDone());
    const key = chapterKey(book, slug);
    if (done) set.add(key);
    else set.delete(key);
    const next = [...set];
    write("done", next);
    return next;
  },
  getLastSlug(book: string): string | null {
    return read<string>(`last:${book}`);
  },
  setLastSlug(book: string, slug: string): void {
    write(`last:${book}`, slug);
  },
  getScroll(book: string, slug: string): number {
    return read<number>(`scroll:${chapterKey(book, slug)}`) ?? 0;
  },
  setScroll(book: string, slug: string, y: number): void {
    write(`scroll:${chapterKey(book, slug)}`, Math.round(y));
  },
  getSize(): ProseSize {
    return read<ProseSize>("size") ?? "m";
  },
  setSize(size: ProseSize): void {
    write("size", size);
  },
};
