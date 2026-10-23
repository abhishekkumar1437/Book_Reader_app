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
 * Every page under /interview/…; collections may sit inside one other collection:
 *   /interview/<collection>[/<collection>]                    collection shelf
 *   /interview/[<collection>/[<collection>/]]<book>            chapter list
 *   /interview/[<collection>/[<collection>/]]<book>/<chapter>  chapter
 */
async function resolve(params: Props["params"]) {
  const segments = (await params).path.map((s) => decodeURIComponent(s).toLowerCase());
  if (segments.length > 4) return null;
  const full = segments.join("/");

  const collection = segments.length <= 2 ? await getCollection(full) : null;
  if (collection) return { kind: "collection" as const, ...collection };

  const book = await getBook(full);
  if (book) return { kind: "book" as const, book, chapters: await listChapters(full) };

  if (segments.length < 2) return null;
  const bookSlug = segments.slice(0, -1).join("/");
  const [parent, chapter] = await Promise.all([getBook(bookSlug), getChapter(bookSlug, segments[segments.length - 1])]);
  return parent && chapter ? { kind: "chapter" as const, book: parent, chapter } : null;
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
    const moved = segments.length <= 3 ? await findBookInCollection(segments[0]) : null;
    if (moved) redirect(interviewHref(moved, ...segments.slice(1)));
    notFound();
  }

  if (page.kind === "collection") {
    return (
      <main className="min-h-full">
        <SiteHeader subtitle={page.collection.subtitle || page.collection.title} />
        <BookShelf books={page.books} collections={page.collections} collection={page.collection} />
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
