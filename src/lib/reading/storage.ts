/**
 * Reading progress for chapter-based shelves (interview prep, stories), kept in
 * localStorage like the reader and quiz state: which chapters are marked read,
 * where you left off in each book, and the preferred text size. Chapters are
 * keyed as "book/slug". Each shelf gets its own key prefix so progress never mixes.
 */

export type ProseSize = "s" | "m" | "l" | "xl";

export function chapterKey(book: string, slug: string): string {
  return `${book}/${slug}`;
}

export function createReadingStore(prefix: string) {
  function read<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(prefix + key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  function write(key: string, value: unknown): void {
    if (typeof window === "undefined") return;
    try {
      if (value === null) window.localStorage.removeItem(prefix + key);
      else window.localStorage.setItem(prefix + key, JSON.stringify(value));
    } catch {
      /* storage unavailable */
    }
  }

  return {
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
}

export type ReadingStore = ReturnType<typeof createReadingStore>;
