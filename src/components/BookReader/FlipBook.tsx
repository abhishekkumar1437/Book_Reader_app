"use client";

import { memo, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, type Ref } from "react";
import HTMLFlipBook from "react-pageflip";
import type { PageCache } from "@/lib/pdf/pageCache";
import { BookPage } from "./BookPage";

export type FlipState = "user_fold" | "fold_corner" | "flipping" | "read";

export interface FlipBookHandle {
  next(): void;
  prev(): void;
  /** Animated turn to a 1-based page. */
  goTo(page: number): void;
  /** Instant jump to a 1-based page. */
  jumpTo(page: number): void;
  currentPage(): number;
}

interface PageFlipApi {
  flipNext(corner?: "top" | "bottom"): void;
  flipPrev(corner?: "top" | "bottom"): void;
  flip(pageIndex: number, corner?: "top" | "bottom"): void;
  turnToPage(pageIndex: number): void;
  getCurrentPageIndex(): number;
  getState(): FlipState;
  destroy(): void;
}

interface FlipBookProps {
  numPages: number;
  pageWidth: number;
  pageHeight: number;
  portrait: boolean;
  /** 1-based page to open on mount. */
  startPage: number;
  flipDuration: number;
  cache: PageCache | null;
  showNumbers: boolean;
  onFlip: (page: number) => void;
  onStateChange: (state: FlipState) => void;
  ref?: Ref<FlipBookHandle>;
}

/**
 * Wraps react-pageflip. The children array is memoized so the library never rebuilds
 * its page collection while bitmaps stream in; each page updates itself instead.
 * Size and orientation changes are handled by the parent remounting this component.
 */
function FlipBookInner({
  numPages,
  pageWidth,
  pageHeight,
  portrait,
  startPage,
  flipDuration,
  cache,
  showNumbers,
  onFlip,
  onStateChange,
  ref,
}: FlipBookProps) {
  const bookRef = useRef<{ pageFlip: () => PageFlipApi | undefined } | null>(null);
  const onFlipRef = useRef(onFlip);
  const onStateRef = useRef(onStateChange);
  useLayoutEffect(() => {
    onFlipRef.current = onFlip;
    onStateRef.current = onStateChange;
  }, [onFlip, onStateChange]);

  const api = () => bookRef.current?.pageFlip();

  useImperativeHandle(
    ref,
    () => ({
      next: () => api()?.flipNext(),
      prev: () => api()?.flipPrev(),
      goTo: (page) => {
        const flip = api();
        if (!flip) return;
        const target = Math.min(Math.max(page, 1), numPages) - 1;
        const current = flip.getCurrentPageIndex();
        // Animate a single turn for nearby pages; jump for long distances so the
        // book does not appear to flip through hundreds of sheets.
        if (Math.abs(target - current) <= 2) flip.flip(target);
        else flip.turnToPage(target);
      },
      jumpTo: (page) => api()?.turnToPage(Math.min(Math.max(page, 1), numPages) - 1),
      currentPage: () => (api()?.getCurrentPageIndex() ?? 0) + 1,
    }),
    [numPages],
  );

  useEffect(() => {
    const book = bookRef;
    return () => {
      try {
        book.current?.pageFlip()?.destroy();
      } catch {
        /* the library may already have torn itself down */
      }
    };
  }, []);

  const pages = useMemo(
    () =>
      Array.from({ length: numPages }, (_, i) => (
        <BookPage key={i} index={i} numPages={numPages} cache={cache} showNumber={showNumbers} />
      )),
    [numPages, cache, showNumbers],
  );

  const handlers = useMemo(
    () => ({
      onFlip: (e: { data: number }) => onFlipRef.current(e.data + 1),
      onChangeState: (e: { data: FlipState }) => onStateRef.current(e.data),
    }),
    [],
  );

  return (
    <HTMLFlipBook
      ref={bookRef}
      className="book-flip"
      style={{}}
      width={pageWidth}
      height={pageHeight}
      size="fixed"
      minWidth={pageWidth}
      maxWidth={pageWidth}
      minHeight={pageHeight}
      maxHeight={pageHeight}
      startPage={Math.min(Math.max(startPage, 1), numPages) - 1}
      drawShadow
      maxShadowOpacity={0.55}
      flippingTime={flipDuration}
      usePortrait={portrait}
      startZIndex={0}
      autoSize={false}
      showCover
      mobileScrollSupport={false}
      clickEventForward
      useMouseEvents
      swipeDistance={30}
      showPageCorners
      disableFlipByClick={false}
      onFlip={handlers.onFlip}
      onChangeState={handlers.onChangeState}
    >
      {pages}
    </HTMLFlipBook>
  );
}

export const FlipBook = memo(FlipBookInner);
