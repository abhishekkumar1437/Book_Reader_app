import type { Metadata } from "next";
import { StoryShelf } from "@/components/Story/StoryShelf";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { listStories } from "@/lib/story/server";

export const metadata: Metadata = { title: "Stories · Book Reader" };
// Stories are folders on disk that can change at any time, so never cache this page.
export const dynamic = "force-dynamic";

export default async function StoryPage() {
  const stories = await listStories();
  return (
    <main className="min-h-full">
      <SiteHeader subtitle="Stories to read chapter by chapter." />
      <StoryShelf stories={stories} />
    </main>
  );
}
