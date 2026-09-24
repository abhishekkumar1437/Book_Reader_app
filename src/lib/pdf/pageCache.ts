import { useSyncExternalStore } from "react";
import type { PdfBook, RenderedPage } from "./pdfBook";

interface CacheOptions {
  /** Pages to render on each side of the current spread. */
  preload: number;
  /** Distance beyond which rendered pages are released. */
  keep: number;
  /** Simultaneous render jobs. */
  concurrency: number;
}

const DEFAULTS: CacheOptions = { preload: 3, keep: 8, concurrency: 2 };

/** Upper bound on encoded bitmap bytes held at once; farthest pages are dropped first. */
const BYTE_BUDGET = 160 * 1024 * 1024;

/** Re-render when the existing bitmap is narrower than this fraction of what is needed. */
const UPSCALE_TOLERANCE = 0.85;

/**
 * Keeps rendered bitmaps for the pages around the reader's current position and
 * drops the ones that drift too far away. Pages subscribe to their own slot so only
 * the affected <img> re-renders when a bitmap arrives or is replaced.
 */
export class PageCache {
  private entries = new Map<number, RenderedPage>();
  private listeners = new Map<number, Set<() => void>>();
  private inFlight = new Set<number>();
  private current = 1;
  private targetWidthPx = 0;
  private disposed = false;
  private readonly opts: CacheOptions;

  constructor(
    private readonly book: PdfBook,
    opts: Partial<CacheOptions> = {},
  ) {
    this.opts = { ...DEFAULTS, ...opts };
  }

  get numPages(): number {
    return this.book.numPages;
  }

  subscribe(page: number, listener: () => void): () => void {
    let set = this.listeners.get(page);
    if (!set) {
      set = new Set();
      this.listeners.set(page, set);
    }
    set.add(listener);
    return () => {
      set.delete(listener);
      if (set.size === 0) this.listeners.delete(page);
    };
  }

  get(page: number): RenderedPage | undefined {
    return this.entries.get(page);
  }

  /** Updates the reader position and the bitmap width needed for crisp display. */
  setViewport(currentPage: number, targetWidthPx: number): void {
    const widthChanged = Math.abs(targetWidthPx - this.targetWidthPx) > 1;
    const pageChanged = currentPage !== this.current;
    this.current = currentPage;
    this.targetWidthPx = Math.max(1, Math.round(targetWidthPx));
    if (widthChanged || pageChanged) this.schedule();
  }

  private notify(page: number): void {
    this.listeners.get(page)?.forEach((fn) => fn());
  }

  private needsRender(page: number): boolean {
    if (this.inFlight.has(page)) return false;
    const entry = this.entries.get(page);
    return !entry || entry.widthPx < this.targetWidthPx * UPSCALE_TOLERANCE;
  }

  private schedule(): void {
    if (this.disposed || this.targetWidthPx <= 0) return;
    const { preload, keep, concurrency } = this.opts;
    const total = this.book.numPages;

    // Release bitmaps that are far from the current spread.
    for (const [page, entry] of this.entries) {
      if (Math.abs(page - this.current) > keep) this.evict(page, entry);
    }

    // Then trim the farthest pages outside the preload window until we fit the byte budget.
    let bytes = 0;
    for (const entry of this.entries.values()) bytes += entry.bytes;
    if (bytes > BYTE_BUDGET) {
      const candidates = [...this.entries.keys()]
        .filter((p) => Math.abs(p - this.current) > preload)
        .sort((a, b) => this.distance(b) - this.distance(a));
      for (const page of candidates) {
        if (bytes <= BYTE_BUDGET) break;
        const entry = this.entries.get(page);
        if (!entry) continue;
        bytes -= entry.bytes;
        this.evict(page, entry);
      }
    }

    const wanted: number[] = [];
    const lo = Math.max(1, this.current - preload);
    const hi = Math.min(total, this.current + preload + 1);
    for (let p = lo; p <= hi; p++) if (this.needsRender(p)) wanted.push(p);
    // Nearest pages first; the visible spread is [current, current + 1].
    wanted.sort((a, b) => this.distance(a) - this.distance(b));

    for (const page of wanted) {
      if (this.inFlight.size >= concurrency) break;
      void this.render(page);
    }
  }

  private evict(page: number, entry: RenderedPage): void {
    this.entries.delete(page);
    URL.revokeObjectURL(entry.url);
    this.notify(page);
  }

  private distance(page: number): number {
    if (page === this.current || page === this.current + 1) return 0;
    return Math.min(Math.abs(page - this.current), Math.abs(page - this.current - 1));
  }

  private async render(page: number): Promise<void> {
    this.inFlight.add(page);
    const width = this.targetWidthPx;
    try {
      const rendered = await this.book.renderPage(page, width);
      if (this.disposed) {
        URL.revokeObjectURL(rendered.url);
        return;
      }
      const previous = this.entries.get(page);
      this.entries.set(page, rendered);
      this.notify(page);
      // Give the <img> a moment to swap before the old bitmap disappears.
      if (previous) setTimeout(() => URL.revokeObjectURL(previous.url), 1500);
    } catch (err) {
      console.error(`Failed to render page ${page}`, err);
    } finally {
      this.inFlight.delete(page);
      if (!this.disposed) this.schedule();
    }
  }

  dispose(): void {
    this.disposed = true;
    for (const entry of this.entries.values()) URL.revokeObjectURL(entry.url);
    this.entries.clear();
    this.listeners.clear();
  }
}

const EMPTY = () => () => {};

/** Subscribes a component to one page's bitmap. */
export function usePageBitmap(cache: PageCache | null, page: number): RenderedPage | undefined {
  return useSyncExternalStore(
    cache ? (cb) => cache.subscribe(page, cb) : EMPTY,
    () => cache?.get(page),
    () => undefined,
  );
}
