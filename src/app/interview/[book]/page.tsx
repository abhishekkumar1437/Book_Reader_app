import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChapterList } from "@/components/Interview/ChapterList";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { getBook, listChapters } from "@/lib/interview/server";

type Props = { params: Promise<{ book: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { book: slug } = await params;
  const book = await getBook(decodeURIComponent(slug));
  return { title: book ? `${book.title} · Interview Prep` : "Interview Prep · Book Reader" };
}

export default async function BookPage({ params }: Props) {
  const { book: slug } = await params;
  const bookSlug = decodeURIComponent(slug);
  const [book, chapters] = await Promise.all([getBook(bookSlug), listChapters(bookSlug)]);
  if (!book) notFound();

  return (
    <main className="min-h-full">
      <SiteHeader subtitle={book.subtitle || "Interview Prep"} />
      <ChapterList book={book} chapters={chapters} />
    </main>
  );
}
