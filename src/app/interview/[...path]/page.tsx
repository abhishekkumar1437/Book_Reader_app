import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BookShelf } from "@/components/Interview/BookShelf";
import { ChapterList } from "@/components/Interview/ChapterList";
import { ChapterReader } from "@/components/Interview/ChapterReader";
import { Markdown } from "@/components/Interview/Markdown";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { interviewHref } from "@/lib/interview/paths";
import { findBookInCollection, getBook, getChapter, getCollection, listChapters } from "@/lib/interview/server";

type Props = { params: Promise<{ path: string[] }> };

export const dynamic = "force-dynamic";

/**
 * Every page under /interview/…:
 *   /interview/<collection>                         collection shelf
 *   /interview/<book>  or  /interview/<collection>/<book>             chapter list
 *   /interview/<book>/<chapter>  or  /interview/<collection>/<book>/<chapter>  chapter
 */
async function resolve(params: Props["params"]) {
  const segments = (await params).path.map((s) => decodeURIComponent(s).toLowerCase());
  const [first, second, third] = segments;
  if (segments.length > 3) return null;
  const collection = await getCollection(first);

  if (collection && segments.length === 1) return { kind: "collection" as const, ...collection };
  const bookSlug = collection ? `${first}/${second ?? ""}` : first;
  const chapterSlug = collection ? third : second;
  if (!collection && segments.length === 3) return null;

  if (chapterSlug === undefined) {
    const [book, chapters] = await Promise.all([getBook(bookSlug), listChapters(bookSlug)]);
    return book ? { kind: "book" as const, book, chapters } : null;
  }
  const [book, chapter] = await Promise.all([getBook(bookSlug), getChapter(bookSlug, chapterSlug)]);
  return book && chapter ? { kind: "chapter" as const, book, chapter } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await resolve(params);
  if (!page) return { title: "Interview Prep · Book Reader" };
  if (page.kind === "collection") return { title: `${page.collection.title} · Interview Prep` };
  if (page.kind === "book") return { title: `${page.book.title} · Interview Prep` };
  return { title: `${page.chapter.title} · ${page.book.title}` };
}

export default async function InterviewPathPage({ params }: Props) {
  const page = await resolve(params);
  if (!page) {
    // A book that moved into a collection: send old links to its new home.
    const segments = (await params).path.map((s) => decodeURIComponent(s).toLowerCase());
    const moved = segments.length <= 2 ? await findBookInCollection(segments[0]) : null;
    if (moved) redirect(interviewHref(moved, ...segments.slice(1)));
    notFound();
  }

  if (page.kind === "collection") {
    return (
      <main className="min-h-full">
        <SiteHeader subtitle={page.collection.subtitle || page.collection.title} />
        <BookShelf books={page.books} collection={page.collection} />
      </main>
    );
  }

  if (page.kind === "book") {
    return (
      <main className="min-h-full">
        <SiteHeader subtitle={page.book.subtitle || "Interview Prep"} />
        <ChapterList book={page.book} chapters={page.chapters} />
      </main>
    );
  }

  const { body, ...meta } = page.chapter;
  return (
    <main className="min-h-full">
      <SiteHeader subtitle={`${page.book.title} · ${page.chapter.part}`} />
      <ChapterReader book={page.book} chapter={meta}>
        <Markdown source={body} />
      </ChapterReader>
    </main>
  );
}
