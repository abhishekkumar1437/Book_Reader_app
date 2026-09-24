"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check, ChevronRight, Clock } from "@/components/ui/icons";
import { chapterKey, interviewStore } from "@/lib/interview/storage";
import type { BookMeta, ChapterMeta } from "@/lib/interview/types";

export function ChapterList({ book, chapters }: { book: BookMeta; chapters: ChapterMeta[] }) {
  const [done, setDone] = useState<string[]>([]);
  const [last, setLast] = useState<string | null>(null);

  useEffect(() => {
    const load = () => {
      setDone(interviewStore.getDone());
      setLast(interviewStore.getLastSlug(book.slug));
    };
    const id = window.setTimeout(load, 0);
    window.addEventListener("focus", load);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("focus", load);
    };
  }, [book.slug]);

  const parts = useMemo(() => {
    const map = new Map<string, ChapterMeta[]>();
    for (const c of chapters) map.set(c.part, [...(map.get(c.part) ?? []), c]);
    return [...map.entries()];
  }, [chapters]);

  const isDone = (c: ChapterMeta) => done.includes(chapterKey(book.slug, c.slug));
  const doneCount = chapters.filter(isDone).length;
  const lastChapter = chapters.find((c) => c.slug === last);
  const nextUnread = chapters.find((c) => !isDone(c));
  const resume = lastChapter && !isDone(lastChapter) ? lastChapter : nextUnread;
  const href = (c: ChapterMeta) => `/interview/${encodeURIComponent(book.slug)}/${encodeURIComponent(c.slug)}`;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <nav className="mt-6 flex items-center gap-2 text-sm text-fg-muted" aria-label="Breadcrumb">
        <Link href="/interview" className="hover:text-fg">
          All books
        </Link>
        <ChevronRight size={14} />
        <span className="text-fg">{book.title}</span>
      </nav>

      <section className="mt-4 grid gap-4 rounded-2xl border border-line bg-bg-2/80 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <h2 className="font-serif text-2xl text-fg">{book.title}</h2>
          {book.subtitle && <p className="mt-0.5 text-sm text-fg-muted">{book.subtitle}</p>}
          <p className="mt-2 text-sm text-fg-muted">
            {chapters.length} chapters · about {Math.max(1, Math.round(book.minutes / 60))} hours of reading · {doneCount} read
          </p>
          <div className="mt-3 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-accent transition-[width]"
              style={{ width: `${chapters.length ? (doneCount / chapters.length) * 100 : 0}%` }}
            />
          </div>
        </div>
        {resume && (
          <Link
            href={href(resume)}
            className="flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-ink transition hover:bg-accent-2"
          >
            {resume === lastChapter ? "Continue" : "Start"}: Chapter {resume.order}
            <ChevronRight size={16} />
          </Link>
        )}
      </section>

      {chapters.length === 0 && (
        <p className="mt-10 py-12 text-center text-sm text-fg-muted">This book has no chapters yet.</p>
      )}

      {parts.map(([part, own]) => (
        <section key={part} className="mt-10">
          <h3 className="mb-3 font-serif text-xl text-fg">{part}</h3>
          <ol className="overflow-hidden rounded-2xl border border-line bg-bg-2/60">
            {own.map((c) => {
              const read = isDone(c);
              return (
                <li key={c.slug} className="border-b border-line last:border-b-0">
                  <Link href={href(c)} className="group flex items-center gap-4 px-4 py-3.5 transition hover:bg-white/5 sm:px-5">
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl font-serif text-sm ${
                        read ? "bg-accent text-ink" : "bg-accent/15 text-accent"
                      }`}
                    >
                      {read ? <Check size={16} /> : c.order}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif text-lg leading-snug text-fg">{c.title}</span>
                      {c.summary && <span className="mt-0.5 line-clamp-2 block text-sm text-fg-muted">{c.summary}</span>}
                    </span>
                    <span className="hidden shrink-0 items-center gap-1 text-xs text-fg-muted sm:flex">
                      <Clock size={12} /> {c.minutes} min
                    </span>
                    <ChevronRight className="shrink-0 text-fg-muted transition group-hover:text-fg" />
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
