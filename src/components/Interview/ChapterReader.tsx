"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, List } from "@/components/ui/icons";
import { chapterKey, interviewStore, type ProseSize } from "@/lib/interview/storage";
import type { BookMeta, Chapter } from "@/lib/interview/types";

const SIZES: ProseSize[] = ["s", "m", "l", "xl"];

interface ChapterReaderProps {
  book: BookMeta;
  chapter: Omit<Chapter, "body">;
  children: ReactNode;
}

export function ChapterReader({ book, chapter, children }: ChapterReaderProps) {
  const [size, setSize] = useState<ProseSize>("m");
  const [done, setDone] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const bookHref = `/interview/${encodeURIComponent(book.slug)}`;
  const chapterHref = (slug: string) => `${bookHref}/${encodeURIComponent(slug)}`;

  // Restore preferences and reading position once on the client (deferred so it
  // runs after hydration rather than synchronously inside the effect).
  useEffect(() => {
    const id = window.setTimeout(() => {
      setSize(interviewStore.getSize());
      setDone(interviewStore.getDone().includes(chapterKey(book.slug, chapter.slug)));
      interviewStore.setLastSlug(book.slug, chapter.slug);
      const y = interviewStore.getScroll(book.slug, chapter.slug);
      if (y > 0 && !window.location.hash) window.scrollTo({ top: y });
    }, 0);
    return () => window.clearTimeout(id);
  }, [book.slug, chapter.slug]);

  // Scroll progress bar, and remember where the reader left off.
  useEffect(() => {
    let raf = 0;
    let saveTimer = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 1);
        window.clearTimeout(saveTimer);
        saveTimer = window.setTimeout(() => interviewStore.setScroll(book.slug, chapter.slug, window.scrollY), 300);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(raf);
      window.clearTimeout(saveTimer);
    };
  }, [book.slug, chapter.slug]);

  // Highlight the heading currently in view.
  useEffect(() => {
    if (!articleRef.current || chapter.headings.length === 0) return;
    const els = chapter.headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [chapter.headings]);

  const changeSize = useCallback((dir: -1 | 1) => {
    setSize((cur) => {
      const next = SIZES[Math.min(SIZES.length - 1, Math.max(0, SIZES.indexOf(cur) + dir))];
      interviewStore.setSize(next);
      return next;
    });
  }, []);

  const toggleDone = () => {
    const next = !done;
    setDone(next);
    interviewStore.setDone(book.slug, chapter.slug, next);
  };

  const toc = (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-2 text-[11px] tracking-widest text-fg-muted uppercase">On this page</p>
      <ul className="space-y-0.5 border-l border-line">
        {chapter.headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={() => setTocOpen(false)}
              className={`-ml-px block border-l py-1 leading-snug transition ${h.depth === 3 ? "pl-6 text-xs" : "pl-3"} ${
                activeId === h.id ? "border-accent text-accent" : "border-transparent text-fg-muted hover:text-fg"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <div className="fixed inset-x-0 top-0 z-40 h-0.5" aria-hidden="true">
        <div className="h-full bg-accent transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="sticky top-0 z-30 -mx-4 mt-4 flex flex-wrap items-center gap-2 border-b border-line bg-bg/85 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-b-xl sm:px-3">
        <Link href={bookHref} className="flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg">
          <ArrowLeft size={16} /> <span className="hidden sm:inline">{book.title}</span>
          <span className="sm:hidden">Chapters</span>
        </Link>
        <span className="text-xs text-fg-muted">
          {chapter.order} / {book.chapterCount}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTocOpen((v) => !v)}
            className="icon-btn lg:hidden"
            aria-label="Table of contents"
            aria-expanded={tocOpen}
          >
            <List size={18} />
          </button>
          <div className="flex items-center rounded-lg border border-line" role="group" aria-label="Text size">
            <button
              type="button"
              onClick={() => changeSize(-1)}
              disabled={size === "s"}
              className="px-2.5 py-1 text-xs text-fg-muted hover:text-fg disabled:opacity-40"
              aria-label="Smaller text"
            >
              A−
            </button>
            <button
              type="button"
              onClick={() => changeSize(1)}
              disabled={size === "xl"}
              className="border-l border-line px-2.5 py-1 text-sm text-fg-muted hover:text-fg disabled:opacity-40"
              aria-label="Larger text"
            >
              A+
            </button>
          </div>
          <button
            type="button"
            onClick={toggleDone}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs transition ${
              done ? "border-accent bg-accent/15 text-accent" : "border-line text-fg-muted hover:text-fg"
            }`}
            aria-pressed={done}
          >
            <Check size={14} /> {done ? "Read" : "Mark as read"}
          </button>
        </div>
      </div>

      {tocOpen && <div className="mt-3 rounded-2xl border border-line bg-bg-2/80 p-4 lg:hidden">{toc}</div>}

      <div className="mt-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-16 max-h-[calc(100vh-5rem)] overflow-y-auto pr-2">{toc}</div>
        </aside>

        <div className="min-w-0">
          <p className="text-[11px] tracking-widest text-accent uppercase">
            {chapter.part} · Chapter {chapter.order}
          </p>
          <h1 className="mt-2 font-serif text-3xl leading-tight text-fg sm:text-4xl">{chapter.title}</h1>
          {chapter.summary && <p className="mt-3 text-base text-fg-muted">{chapter.summary}</p>}
          <p className="mt-2 text-xs text-fg-muted">About {chapter.minutes} min read</p>

          <article ref={articleRef} className="prose mt-8" data-size={size}>
            {children}
          </article>

          <nav className="mt-14 grid gap-3 sm:grid-cols-2" aria-label="Chapter navigation">
            {chapter.prev ? (
              <Link
                href={chapterHref(chapter.prev.slug)}
                className="card flex items-center gap-3 rounded-2xl border border-line bg-bg-2/80 p-4"
              >
                <ChevronLeft className="shrink-0 text-fg-muted" />
                <span className="min-w-0">
                  <span className="block text-[11px] tracking-widest text-fg-muted uppercase">Previous</span>
                  <span className="block truncate font-serif text-fg">{chapter.prev.title}</span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {chapter.next ? (
              <Link
                href={chapterHref(chapter.next.slug)}
                className="card flex items-center justify-end gap-3 rounded-2xl border border-line bg-bg-2/80 p-4 text-right"
              >
                <span className="min-w-0">
                  <span className="block text-[11px] tracking-widest text-fg-muted uppercase">Next</span>
                  <span className="block truncate font-serif text-fg">{chapter.next.title}</span>
                </span>
                <ChevronRight className="shrink-0 text-fg-muted" />
              </Link>
            ) : (
              <Link
                href={bookHref}
                className="card flex items-center justify-end gap-3 rounded-2xl border border-line bg-bg-2/80 p-4 text-right"
              >
                <span>
                  <span className="block text-[11px] tracking-widest text-fg-muted uppercase">End of book</span>
                  <span className="block font-serif text-fg">Back to chapters</span>
                </span>
                <ChevronRight className="shrink-0 text-fg-muted" />
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
