"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, Check, ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { chapterKey, storyStore, type ProseSize } from "@/lib/story/storage";
import type { StoryChapter, StoryChapterLink, StoryMeta } from "@/lib/story/types";

const SIZES: ProseSize[] = ["s", "m", "l", "xl"];

interface StoryReaderProps {
  story: StoryMeta;
  chapter: Omit<StoryChapter, "body">;
  /** Every chapter of the story, for the jump-to menu. */
  chapters: StoryChapterLink[];
  children: ReactNode;
}

export function StoryReader({ story, chapter, chapters, children }: StoryReaderProps) {
  const router = useRouter();
  const [size, setSize] = useState<ProseSize>("m");
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const storyHref = `/story/${encodeURIComponent(story.slug)}`;
  const chapterHref = useCallback((slug: string) => `${storyHref}/${encodeURIComponent(slug)}`, [storyHref]);

  // Restore preferences and reading position once on the client (deferred so it
  // runs after hydration rather than synchronously inside the effect).
  useEffect(() => {
    const id = window.setTimeout(() => {
      setSize(storyStore.getSize());
      setDone(storyStore.getDone().includes(chapterKey(story.slug, chapter.slug)));
      storyStore.setLastSlug(story.slug, chapter.slug);
      const y = storyStore.getScroll(story.slug, chapter.slug);
      if (y > 0 && !window.location.hash) window.scrollTo({ top: y });
    }, 0);
    return () => window.clearTimeout(id);
  }, [story.slug, chapter.slug]);

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
        saveTimer = window.setTimeout(() => storyStore.setScroll(story.slug, chapter.slug, window.scrollY), 300);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(raf);
      window.clearTimeout(saveTimer);
    };
  }, [story.slug, chapter.slug]);

  // Arrow keys turn the page, like the PDF reader.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (target && /^(INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) return;
      if (e.key === "ArrowRight" && chapter.next) router.push(chapterHref(chapter.next.slug));
      else if (e.key === "ArrowLeft" && chapter.prev) router.push(chapterHref(chapter.prev.slug));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chapter.next, chapter.prev, chapterHref, router]);

  const changeSize = useCallback((dir: -1 | 1) => {
    setSize((cur) => {
      const next = SIZES[Math.min(SIZES.length - 1, Math.max(0, SIZES.indexOf(cur) + dir))];
      storyStore.setSize(next);
      return next;
    });
  }, []);

  const toggleDone = () => {
    const next = !done;
    setDone(next);
    storyStore.setDone(story.slug, chapter.slug, next);
  };

  /** Marks the chapter read and moves on; used by the big button at the end of the text. */
  const finishAndContinue = () => {
    if (!done) {
      setDone(true);
      storyStore.setDone(story.slug, chapter.slug, true);
    }
    router.push(chapter.next ? chapterHref(chapter.next.slug) : storyHref);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <div className="fixed inset-x-0 top-0 z-40 h-0.5" aria-hidden="true">
        <div className="h-full bg-accent transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="sticky top-0 z-30 -mx-4 mt-4 flex flex-wrap items-center gap-2 border-b border-line bg-bg/85 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-b-xl sm:px-3">
        <Link href={storyHref} className="flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg">
          <ArrowLeft size={16} /> <span className="hidden sm:inline">{story.title}</span>
          <span className="sm:hidden">Chapters</span>
        </Link>
        <label className="flex items-center gap-1.5 text-xs text-fg-muted">
          <span className="sr-only">Jump to chapter</span>
          <select
            value={chapter.slug}
            onChange={(e) => router.push(chapterHref(e.target.value))}
            className="max-w-[12rem] rounded-lg border border-line bg-bg-2 px-2 py-1 text-xs text-fg focus:border-accent focus:outline-none"
          >
            {chapters.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.order}. {c.name}
              </option>
            ))}
          </select>
          <span>/ {story.chapterCount}</span>
        </label>
        <div className="ml-auto flex items-center gap-1.5">
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

      <div className="mx-auto mt-10 max-w-[70ch]">
        <p className="text-center text-[11px] tracking-widest text-accent uppercase">
          {story.title} · Chapter {chapter.order} of {story.chapterCount}
        </p>
        <h1 className="mt-3 text-center font-serif text-3xl leading-tight text-fg sm:text-4xl">{chapter.title}</h1>
        <p className="mt-3 text-center text-xs text-fg-muted">About {chapter.minutes} min read</p>

        <article className="prose prose--story mx-auto mt-10" data-size={size}>
          {children}
        </article>

        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={finishAndContinue}
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-accent-2"
          >
            {chapter.next ? `Next: Chapter ${chapter.next.order}` : "Finish story"}
            <ChevronRight size={16} />
          </button>
        </div>

        <nav className="mt-8 grid gap-3 sm:grid-cols-2" aria-label="Chapter navigation">
          {chapter.prev ? (
            <Link
              href={chapterHref(chapter.prev.slug)}
              className="card flex items-center gap-3 rounded-2xl border border-line bg-bg-2/80 p-4"
            >
              <ChevronLeft className="shrink-0 text-fg-muted" />
              <span className="min-w-0">
                <span className="block text-[11px] tracking-widest text-fg-muted uppercase">Previous · {chapter.prev.order}</span>
                <span className="block truncate font-serif text-fg">{chapter.prev.name}</span>
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
                <span className="block text-[11px] tracking-widest text-fg-muted uppercase">Next · {chapter.next.order}</span>
                <span className="block truncate font-serif text-fg">{chapter.next.name}</span>
              </span>
              <ChevronRight className="shrink-0 text-fg-muted" />
            </Link>
          ) : (
            <Link
              href={storyHref}
              className="card flex items-center justify-end gap-3 rounded-2xl border border-line bg-bg-2/80 p-4 text-right"
            >
              <span>
                <span className="block text-[11px] tracking-widest text-fg-muted uppercase">End of story</span>
                <span className="block font-serif text-fg">Back to chapters</span>
              </span>
              <ChevronRight className="shrink-0 text-fg-muted" />
            </Link>
          )}
        </nav>
        <p className="mt-4 hidden text-center text-xs text-fg-muted sm:block">Use ← and → to turn chapters.</p>
      </div>
    </div>
  );
}
