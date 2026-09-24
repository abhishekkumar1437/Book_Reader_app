import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChapterReader } from "@/components/Interview/ChapterReader";
import { Markdown } from "@/components/Interview/Markdown";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { getBook, getChapter } from "@/lib/interview/server";

type Props = { params: Promise<{ book: string; slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { book, slug } = await params;
  const chapter = await getChapter(decodeURIComponent(book), decodeURIComponent(slug));
  return { title: chapter ? `${chapter.title} · Interview Prep` : "Interview Prep · Book Reader" };
}

export default async function ChapterPage({ params }: Props) {
  const { book: bookParam, slug } = await params;
  const bookSlug = decodeURIComponent(bookParam);
  const [book, chapter] = await Promise.all([getBook(bookSlug), getChapter(bookSlug, decodeURIComponent(slug))]);
  if (!book || !chapter) notFound();
  const { body, ...meta } = chapter;

  return (
    <main className="min-h-full">
      <SiteHeader subtitle={`${book.title} · ${chapter.part}`} />
      <ChapterReader book={book} chapter={meta}>
        <Markdown source={body} />
      </ChapterReader>
    </main>
  );
}
