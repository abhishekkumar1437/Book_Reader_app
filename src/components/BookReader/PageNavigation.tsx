"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";

interface PageNavigationProps {
  visible: boolean;
  currentPage: number;
  numPages: number;
  /** Text like "12–13" describing the open spread. */
  spreadLabel: string;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (page: number) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  /** Extra controls rendered on the right (zoom). */
  children?: ReactNode;
}

export function PageNavigation({
  visible,
  currentPage,
  numPages,
  spreadLabel,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onGoTo,
  onPointerEnter,
  onPointerLeave,
  children,
}: PageNavigationProps) {
  const [draft, setDraft] = useState(String(currentPage));
  const [scrub, setScrub] = useState<number | null>(null);
  const [syncedPage, setSyncedPage] = useState(currentPage);

  // Keep the input in step with the book when the page changes from elsewhere.
  if (syncedPage !== currentPage) {
    setSyncedPage(currentPage);
    setDraft(String(currentPage));
  }

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const page = Number.parseInt(draft, 10);
    if (Number.isFinite(page) && page >= 1 && page <= numPages) onGoTo(page);
    else setDraft(String(currentPage));
  };

  const sliderValue = scrub ?? currentPage;
  const progress = numPages > 1 ? ((sliderValue - 1) / (numPages - 1)) * 100 : 100;

  const commitScrub = () => {
    if (scrub !== null && scrub !== currentPage) onGoTo(scrub);
    setScrub(null);
  };

  return (
    <footer
      className={`chrome is-bottom ${visible ? "" : "is-hidden"}`}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <div className="glass mx-auto mb-2 w-[calc(100%-16px)] max-w-3xl rounded-2xl px-3 pt-2 pb-2">
        <div className="flex items-center gap-2 px-1 pb-2">
          <input
            type="range"
            className="slider"
            style={{ "--progress": `${progress}%` } as React.CSSProperties}
            min={1}
            max={numPages}
            value={sliderValue}
            onChange={(e) => setScrub(Number(e.target.value))}
            onPointerUp={commitScrub}
            onKeyUp={commitScrub}
            onTouchEnd={commitScrub}
            onBlur={commitScrub}
            aria-label="Reading progress"
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center">
            <button
              type="button"
              className="icon-btn"
              onClick={onPrev}
              disabled={!canPrev}
              aria-label="Previous page"
              title="Previous (←)"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={onNext}
              disabled={!canNext}
              aria-label="Next page"
              title="Next (→)"
            >
              <ChevronRight />
            </button>
          </div>

          <form onSubmit={submit} className="flex items-center gap-2 text-sm text-fg-muted">
            <span className="hidden sm:inline">Page</span>
            <input
              className="w-14 rounded-md border border-line bg-black/30 px-2 py-1 text-center font-mono text-xs text-fg tabular-nums outline-none focus:border-accent"
              value={draft}
              inputMode="numeric"
              onChange={(e) => setDraft(e.target.value.replace(/[^\d]/g, ""))}
              onFocus={(e) => e.target.select()}
              onBlur={submit}
              aria-label="Go to page"
            />
            <span className="font-mono text-xs tabular-nums">/ {numPages}</span>
            <span className="hidden font-serif text-xs text-fg-muted/80 md:inline">
              {scrub !== null ? `Page ${scrub}` : spreadLabel}
            </span>
          </form>

          <div className="flex items-center">{children}</div>
        </div>
      </div>
    </footer>
  );
}
