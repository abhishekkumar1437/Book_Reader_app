import type { Metadata } from "next";
import { BookShelf } from "@/components/Interview/BookShelf";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { listShelf } from "@/lib/interview/server";

export const metadata: Metadata = { title: "Interview Prep · Book Reader" };
// Books are folders on disk that can change at any time, so never cache this page.
export const dynamic = "force-dynamic";

export default async function InterviewPage() {
  const { books, collections } = await listShelf();
  return (
    <main className="min-h-full">
      <SiteHeader subtitle="Books for interviews and competitive exams." />
      <BookShelf books={books} collections={collections} />
    </main>
  );
}
