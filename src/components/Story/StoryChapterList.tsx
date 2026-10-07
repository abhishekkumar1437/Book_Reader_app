"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check, ChevronRight, Clock } from "@/components/ui/icons";
import { chapterKey, storyStore } from "@/lib/story/storage";
import type { StoryChapterMeta, StoryMeta } from "@/lib/story/types";

/** Long stories are split into blocks of this many chapters so the list stays scannable. */
const GROUP_SIZE = 50;

function hours(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = minutes / 60;
  return `${h < 10 ? h.toFixed(1).replace(/\.0$/, "") : Math.round(h)} hours`;
}

export function StoryChapterList({ story, chapters }: { story: StoryMeta; chapters: StoryChapterMeta[] }) {
  const [done, setDone] = useState<string[]>([]);
  const [last, setLast] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const load = () => {
      setDone(storyStore.getDone());
      setLast(storyStore.getLastSlug(story.slug));
    };
    const id = window.setTimeout(load, 0);
    window.addEventListener("focus", load);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("focus", load);
    };
  }, [story.slug]);

  const doneSet = useMemo(() => new Set(done), [done]);
  const isDone = (c: StoryChapterMeta) => doneSet.has(chapterKey(story.slug, c.slug));
  const doneCount = chapters.filter(isDone).length;
  const lastChapter = chapters.find((c) => c.slug === last);
  const nextUnread = chapters.find((c) => !isDone(c));
  const resume = lastChapter && !isDone(lastChapter) ? lastChapter : nextUnread;
  const href = (c: StoryChapterMeta) => `/story/${encodeURIComponent(story.slug)}/${encodeURIComponent(c.slug)}`;

  const query = filter.trim().toLowerCase();
  const visible = query
    ? chapters.filter((c) => String(c.order) === query || c.title.toLowerCase().includes(query))
    : chapters;

  const groups = useMemo(() => {
    if (query || visible.length <= GROUP_SIZE) return [{ label: "", items: visible }];
    const out: { label: string; items: StoryChapterMeta[] }[] = [];
    for (let i = 0; i < visible.length; i += GROUP_SIZE) {
      const items = visible.slice(i, i + GROUP_SIZE);
      out.push({ label: `Chapters ${items[0].order} – ${items[items.length - 1].order}`, items });
    }
    return out;
  }, [visible, query]);

  const row = (c: StoryChapterMeta) => {
    const read = isDone(c);
    const current = c.slug === last;
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
            <span className="block font-serif text-lg leading-snug text-fg">{c.name}</span>
            {current && !read && <span className="mt-0.5 block text-xs text-accent">Last opened</span>}
          </span>
          <span className="hidden shrink-0 items-center gap-1 text-xs text-fg-muted sm:flex">
            <Clock size={12} /> {c.minutes} min
          </span>
          <ChevronRight className="shrink-0 text-fg-muted transition group-hover:text-fg" />
        </Link>
      </li>
    );
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <nav className="mt-6 flex items-center gap-2 text-sm text-fg-muted" aria-label="Breadcrumb">
        <Link href="/story" className="hover:text-fg">
          All stories
        </Link>
        <ChevronRight size={14} />
        <span className="text-fg">{story.title}</span>
      </nav>

      <section className="mt-4 grid gap-4 rounded-2xl border border-line bg-bg-2/80 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-[11px] tracking-widest text-accent uppercase">{story.genre}</p>
          <h2 className="mt-1 font-serif text-2xl text-fg">{story.title}</h2>
          {story.description && <p className="mt-1 max-w-2xl text-sm text-fg-muted">{story.description}</p>}
          <p className="mt-2 text-sm text-fg-muted">
            {chapters.length} chapters · about {hours(story.minutes)} of reading · {doneCount} read
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
        <p className="mt-10 py-12 text-center text-sm text-fg-muted">This story has no chapters yet.</p>
      )}

      {chapters.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <h3 className="font-serif text-xl text-fg">Chapters</h3>
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Chapter number or title"
            aria-label="Find a chapter"
            className="ml-auto w-full rounded-xl border border-line bg-white/5 px-3 py-1.5 text-sm text-fg placeholder:text-fg-muted focus:border-accent focus:outline-none sm:w-64"
          />
        </div>
      )}

      {visible.length === 0 && chapters.length > 0 && (
        <p className="mt-6 text-sm text-fg-muted">No chapter matches “{filter}”.</p>
      )}

      {groups.map((g, i) => {
        if (!g.label) {
          return (
            <ol key="all" className="mt-3 overflow-hidden rounded-2xl border border-line bg-bg-2/60">
              {g.items.map(row)}
            </ol>
          );
        }
        const holdsResume = resume ? g.items.includes(resume) : i === 0;
        return (
          <details key={g.label} className="group/block mt-3" open={holdsResume}>
            <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl border border-line bg-bg-2/80 px-4 py-3 text-fg transition hover:bg-white/5 sm:px-5">
              <ChevronRight size={16} className="text-fg-muted transition group-open/block:rotate-90" />
              <span className="font-serif text-lg">{g.label}</span>
              <span className="ml-auto text-xs text-fg-muted">
                {g.items.filter(isDone).length} / {g.items.length} read
              </span>
            </summary>
            <ol className="mt-2 overflow-hidden rounded-2xl border border-line bg-bg-2/60">{g.items.map(row)}</ol>
          </details>
        );
      })}
    </div>
  );
}
