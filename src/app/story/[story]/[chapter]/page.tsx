import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/Interview/Markdown";
import { StoryReader } from "@/components/Story/StoryReader";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { getStory, getStoryChapter, listStoryChapters } from "@/lib/story/server";
import { decodeParam } from "@/lib/story/params";

type Props = { params: Promise<{ story: string; chapter: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { story, chapter } = await params;
  const c = await getStoryChapter(decodeParam(story), decodeParam(chapter));
  return { title: c ? `${c.title} · Stories` : "Stories · Book Reader" };
}

export default async function StoryChapterPage({ params }: Props) {
  const { story: storyParam, chapter: chapterParam } = await params;
  const storySlug = decodeParam(storyParam);
  const [story, chapter, all] = await Promise.all([
    getStory(storySlug),
    getStoryChapter(storySlug, decodeParam(chapterParam)),
    listStoryChapters(storySlug),
  ]);
  if (!story || !chapter) notFound();
  const { body, ...meta } = chapter;
  const links = all.map((c) => ({ slug: c.slug, name: c.name, order: c.order }));

  return (
    <main className="min-h-full">
      <SiteHeader subtitle={`${story.title} · ${story.genre}`} />
      <StoryReader story={story} chapter={meta} chapters={links}>
        <Markdown source={body} />
      </StoryReader>
    </main>
  );
}
