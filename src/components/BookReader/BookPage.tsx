"use client";

import { memo, useEffect, useState, type Ref } from "react";
import { usePageBitmap, type PageCache } from "@/lib/pdf/pageCache";

interface BookPageProps {
  /** 0-based index inside the flipbook. */
  index: number;
  numPages: number;
  cache: PageCache | null;
  showNumber: boolean;
  /** Attached by the flip library; must land on the root element. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * One sheet of the book. Subscribes to its own bitmap so a page only re-renders
 * when its image arrives, never when the reader's other state changes.
 */
function BookPageInner({ index, numPages, cache, showNumber, ref }: BookPageProps) {
  const pageNumber = index + 1;
  const bitmap = usePageBitmap(cache, pageNumber);
  const [shownUrl, setShownUrl] = useState<string | null>(null);
  const [trackedUrl, setTrackedUrl] = useState<string | null>(null);

  // When the cache evicts this page, drop the image immediately (its URL is revoked).
  const nextUrl = bitmap?.url ?? null;
  if (trackedUrl !== nextUrl) {
    setTrackedUrl(nextUrl);
    if (!nextUrl) setShownUrl(null);
  }

  // Decode the incoming bitmap off-screen and only then swap it in, so a page never
  // goes blank while a sharper replacement is still being decoded.
  useEffect(() => {
    const next = bitmap?.url ?? null;
    if (!next) return;
    let cancelled = false;
    const img = new Image();
    img.src = next;
    img
      .decode()
      .catch(() => undefined)
      .then(() => {
        if (!cancelled) setShownUrl(next);
      });
    return () => {
      cancelled = true;
    };
  }, [bitmap?.url]);

  // With a cover, the first page sits alone on the right; from then on odd indexes are left pages.
  const side = index % 2 === 1 ? "left" : "right";
  const isCover = index === 0 || index === numPages - 1;

  return (
    <div
      ref={ref}
      className="book-page"
      data-side={side}
      data-cover={isCover ? "true" : undefined}
      data-density={isCover ? "hard" : "soft"}
    >
      {shownUrl ? (
        // Object URLs from the render cache; next/image cannot optimize these.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="book-page__image"
          src={shownUrl}
          alt={`Page ${pageNumber}`}
          draggable={false}
        />
      ) : (
        <div className="book-page__placeholder">{pageNumber}</div>
      )}
      {showNumber && shownUrl && <span className="book-page__number">{pageNumber}</span>}
    </div>
  );
}

export const BookPage = memo(BookPageInner);
