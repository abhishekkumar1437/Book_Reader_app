"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight } from "@/components/ui/icons";
import { interviewStore } from "@/lib/interview/storage";
import type { BookMeta } from "@/lib/interview/types";

function hours(minutes: number): string {
  const h = minutes / 60;
  return h < 1 ? `${minutes} min` : `${h < 10 ? h.toFixed(1).replace(/\.0$/, "") : Math.round(h)} h`;
}

function BookCard({ book, readCount, started }: { book: BookMeta; readCount: number; started: boolean }) {
  const progress = book.chapterCount ? Math.round((readCount / book.chapterCount) * 100) : 0;
  const href = `/interview/${encodeURIComponent(book.slug)}`;
  return (
    <article className="card group flex flex-col rounded-2xl border border-line bg-bg-2/80 p-3">
      <Link href={href} className="block" aria-label={`Open ${book.title}`}>
        <div className="cover">
          <div className="flex h-full flex-col justify-between p-5 pl-7">
            <span className="text-[10px] tracking-[0.25em] text-ink/50 uppercase">Interview Prep</span>
            <span>
              <span className="block font-serif text-2xl leading-tight text-ink">{book.title}</span>
              {book.subtitle && <span className="mt-2 block text-sm text-ink/70">{book.subtitle}</span>}
            </span>
            <span className="text-[11px] text-ink/50">
              {book.chapterCount} chapters · {hours(book.minutes)}
            </span>
          </div>
          {progress > 0 && (
            <div className="absolute right-0 bottom-0 left-0 z-10 h-1 bg-black/30">
              <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      </Link>

      <div className="mt-3 min-w-0 flex-1">
        <h3 className="font-serif text-[15px] leading-snug text-fg">{book.title}</h3>
        {book.description && <p className="mt-1 line-clamp-3 text-xs text-fg-muted">{book.description}</p>}
        <p className="mt-2 text-xs text-fg-muted">
          {readCount > 0 ? `${readCount} of ${book.chapterCount} chapters read` : "Not started"}
        </p>
      </div>

      <Link
        href={href}
        className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm font-medium text-ink transition hover:bg-accent-2"
      >
        {started ? "Continue reading" : "Open book"}
        <ChevronRight size={16} />
      </Link>
    </article>
  );
}

export function BookShelf({ books }: { books: BookMeta[] }) {
  const [done, setDone] = useState<string[]>([]);
  const [started, setStarted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = () => {
      setDone(interviewStore.getDone());
      setStarted(Object.fromEntries(books.map((b) => [b.slug, interviewStore.getLastSlug(b.slug) !== null])));
    };
    const id = window.setTimeout(load, 0);
    window.addEventListener("focus", load);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("focus", load);
    };
  }, [books]);

  if (books.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mt-10 rounded-2xl border border-dashed border-line px-6 py-16 text-center text-fg-muted">
          <p className="font-serif text-lg text-fg">No books yet</p>
          <p className="mt-2 text-sm">Add a folder of Markdown chapters under the interview folder to see it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <section className="mt-8">
        <h2 className="mb-4 font-serif text-2xl text-fg">Books</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <BookCard
              key={book.slug}
              book={book}
              readCount={done.filter((k) => k.startsWith(`${book.slug}/`)).length}
              started={started[book.slug] ?? false}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
