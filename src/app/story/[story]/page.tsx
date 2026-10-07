import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryChapterList } from "@/components/Story/StoryChapterList";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { getStory, listStoryChapters } from "@/lib/story/server";
import { decodeParam } from "@/lib/story/params";

type Props = { params: Promise<{ story: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { story: slug } = await params;
  const story = await getStory(decodeParam(slug));
  return { title: story ? `${story.title} · Stories` : "Stories · Book Reader" };
}

export default async function StoryChaptersPage({ params }: Props) {
  const { story: slug } = await params;
  const storySlug = decodeParam(slug);
  const [story, chapters] = await Promise.all([getStory(storySlug), listStoryChapters(storySlug)]);
  if (!story) notFound();

  return (
    <main className="min-h-full">
      <SiteHeader subtitle={story.genre} />
      <StoryChapterList story={story} chapters={chapters} />
    </main>
  );
}
