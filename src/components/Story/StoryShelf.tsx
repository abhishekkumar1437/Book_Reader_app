"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight } from "@/components/ui/icons";
import { storyStore } from "@/lib/story/storage";
import type { StoryMeta } from "@/lib/story/types";

function hours(minutes: number): string {
  const h = minutes / 60;
  return h < 1 ? `${minutes} min` : `${h < 10 ? h.toFixed(1).replace(/\.0$/, "") : Math.round(h)} h`;
}

function StoryCard({ story, readCount, started }: { story: StoryMeta; readCount: number; started: boolean }) {
  const progress = story.chapterCount ? Math.round((readCount / story.chapterCount) * 100) : 0;
  const href = `/story/${encodeURIComponent(story.slug)}`;
  return (
    <article className="card group flex flex-col rounded-2xl border border-line bg-bg-2/80 p-2.5 sm:p-3">
      <Link href={href} className="block" aria-label={`Open ${story.title}`}>
        <div className="cover">
          <div className="flex h-full flex-col justify-between p-3 pl-5 sm:p-5 sm:pl-7">
            <span className="line-clamp-1 text-[9px] tracking-[0.2em] text-ink/50 uppercase sm:text-[10px] sm:tracking-[0.25em]">{story.genre}</span>
            <span className="block font-serif text-lg leading-tight text-ink sm:text-2xl">{story.title}</span>
            <span className="text-[10px] text-ink/50 sm:text-[11px]">
              {story.chapterCount} chapters · {hours(story.minutes)}
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
        <h3 className="font-serif text-[15px] leading-snug text-fg">{story.title}</h3>
        <p className="mt-0.5 text-xs text-fg-muted">
          {story.genre} · {story.chapterCount} {story.chapterCount === 1 ? "chapter" : "chapters"}
        </p>
        {story.description && <p className="mt-1.5 line-clamp-3 text-xs text-fg-muted">{story.description}</p>}
        <p className="mt-2 text-xs text-fg-muted">
          {readCount > 0 ? `${readCount} of ${story.chapterCount} chapters read` : "Not started"}
        </p>
      </div>

      <Link
        href={href}
        className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-accent px-2 py-2 text-sm font-medium text-ink transition hover:bg-accent-2 sm:px-3"
      >
        <span className="sm:hidden">{started ? "Continue" : "Open"}</span>
        <span className="hidden sm:inline">{started ? "Continue reading" : "Open story"}</span>
        <ChevronRight size={16} />
      </Link>
    </article>
  );
}

export function StoryShelf({ stories }: { stories: StoryMeta[] }) {
  const [done, setDone] = useState<string[]>([]);
  const [started, setStarted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = () => {
      setDone(storyStore.getDone());
      setStarted(Object.fromEntries(stories.map((s) => [s.slug, storyStore.getLastSlug(s.slug) !== null])));
    };
    const id = window.setTimeout(load, 0);
    window.addEventListener("focus", load);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("focus", load);
    };
  }, [stories]);

  if (stories.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mt-10 rounded-2xl border border-dashed border-line px-6 py-16 text-center text-fg-muted">
          <p className="font-serif text-lg text-fg">No stories yet</p>
          <p className="mt-2 text-sm">Add a folder of chapter Markdown files under the stories folder to see it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <section className="mt-8">
        <h2 className="mb-4 font-serif text-2xl text-fg">Stories</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {stories.map((story) => (
            <StoryCard
              key={story.slug}
              story={story}
              readCount={done.filter((k) => k.startsWith(`${story.slug}/`)).length}
              started={started[story.slug] ?? false}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
