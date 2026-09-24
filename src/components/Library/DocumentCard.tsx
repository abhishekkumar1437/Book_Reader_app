"use client";

import Link from "next/link";
import { BookOpen, Download, Trash } from "@/components/ui/icons";
import type { BookInfo, LibraryProvider } from "@/lib/library/types";
import type { ReadingPosition } from "@/lib/storage/readerState";
import { useBookMeta } from "./useBookMeta";

interface DocumentCardProps {
  book: BookInfo;
  position: ReadingPosition | null;
  library: LibraryProvider;
  onDelete: (book: BookInfo) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function DocumentCard({ book, position, library, onDelete }: DocumentCardProps) {
  const fileUrl = library.fileUrl(book.id);
  const { meta, failed } = useBookMeta(book, fileUrl);

  const pages = meta?.pages ?? null;
  const lastPage = position?.lastPage ?? null;
  const started = lastPage !== null && lastPage > 1;
  const progress = pages && lastPage ? Math.min(100, Math.round((lastPage / pages) * 100)) : 0;
  const readHref = `/read/${encodeURIComponent(book.id)}`;

  return (
    <article className="card group flex flex-col rounded-2xl border border-line bg-bg-2/80 p-3">
      <Link href={readHref} className="block" aria-label={`Open ${book.name}`}>
        <div className="cover">
          {meta?.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={meta.cover}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
              {failed ? (
                <span className="text-xs text-red-300">Couldn&apos;t read this PDF</span>
              ) : (
                <>
                  <div className="spinner" />
                  <span className="text-[11px] tracking-widest text-ink/50 uppercase">Preparing cover</span>
                </>
              )}
            </div>
          )}
          {progress > 0 && (
            <div className="absolute right-0 bottom-0 left-0 z-10 h-1 bg-black/30">
              <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      </Link>

      <div className="mt-3 min-w-0 flex-1">
        <h3 className="truncate font-serif text-[15px] leading-snug text-fg" title={book.name}>
          {book.name}
        </h3>
        <p className="mt-1 text-xs text-fg-muted">
          {pages !== null ? `${pages} page${pages === 1 ? "" : "s"}` : formatSize(book.size)}
          {" · "}
          {formatDate(book.addedAt)}
        </p>
        <p className="mt-1 text-xs text-fg-muted">
          {started && pages ? `Page ${lastPage} / ${pages}` : started ? `Page ${lastPage}` : "Not started"}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-1">
        <Link
          href={readHref}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm font-medium text-ink transition hover:bg-accent-2"
        >
          <BookOpen size={16} />
          {started ? "Continue" : "Read"}
        </Link>
        <a
          href={library.downloadUrl(book.id)}
          download
          className="icon-btn"
          aria-label={`Download ${book.name}`}
          title="Download"
        >
          <Download size={18} />
        </a>
        <button
          type="button"
          className="icon-btn hover:text-red-300"
          onClick={() => onDelete(book)}
          aria-label={`Delete ${book.name}`}
          title="Delete"
        >
          <Trash size={18} />
        </button>
      </div>
    </article>
  );
}
