import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import type { BookMeta, Chapter, ChapterHeading, ChapterMeta } from "./types";

/**
 * The interview-prep shelf lives here: one sub-folder per book.
 *
 *   interview/
 *     dsa-python/
 *       book.md            title, subtitle, description, order
 *       01-intro.md        chapters: `NN-slug.md`, prefix orders them, the rest is the URL slug
 *       02-arrays.md
 *     system-design/
 *       ...
 *
 * Every Markdown file starts with a small front matter block of `key: value` lines.
 */
export const INTERVIEW_DIR = path.join(process.cwd(), "interview");

const BOOK_FILE = "book.md";
const BOOK_SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/i;
const CHAPTER_FILE_PATTERN = /^(\d+)-([a-z0-9][a-z0-9-]*)\.md$/i;
const WORDS_PER_MINUTE = 180;

interface ParsedFile {
  meta: Record<string, string>;
  body: string;
}

function parseFrontMatter(text: string): ParsedFile {
  const normalized = text.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) return { meta: {}, body: normalized };
  const end = normalized.indexOf("\n---", 4);
  if (end === -1) return { meta: {}, body: normalized };
  const meta: Record<string, string> = {};
  for (const line of normalized.slice(4, end).split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { meta, body: normalized.slice(end + 4).replace(/^\n+/, "") };
}

/** Collects `##` / `###` headings outside code fences. Ids match what rehype-slug produces. */
function extractHeadings(body: string): ChapterHeading[] {
  const slugger = new GithubSlugger();
  const headings: ChapterHeading[] = [];
  let inFence = false;
  for (const line of body.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(##|###)\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/[`*_]/g, "");
    headings.push({ depth: m[1].length as 2 | 3, text, id: slugger.slug(text) });
  }
  return headings;
}

function estimateMinutes(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

type LoadedChapter = ChapterMeta & { body: string };

async function readChapterFile(book: string, fileName: string): Promise<LoadedChapter | null> {
  const m = CHAPTER_FILE_PATTERN.exec(fileName);
  if (!m) return null;
  try {
    const text = await fs.readFile(path.join(INTERVIEW_DIR, book, fileName), "utf8");
    const { meta, body } = parseFrontMatter(text);
    const slug = m[2].toLowerCase();
    return {
      book,
      slug,
      order: Number(m[1]),
      title: meta.title || slug,
      part: meta.part || "Chapters",
      summary: meta.summary || "",
      minutes: estimateMinutes(body),
      headings: extractHeadings(body),
      body,
    };
  } catch (err) {
    console.warn(`Skipping chapter "${book}/${fileName}":`, err instanceof Error ? err.message : err);
    return null;
  }
}

async function readAllChapters(book: string): Promise<LoadedChapter[]> {
  let names: string[];
  try {
    names = (await fs.readdir(path.join(INTERVIEW_DIR, book))).filter((n) => CHAPTER_FILE_PATTERN.test(n));
  } catch {
    return [];
  }
  const chapters = await Promise.all(names.map((n) => readChapterFile(book, n)));
  return chapters.filter((c): c is LoadedChapter => c !== null).sort((a, b) => a.order - b.order);
}

function stripBody({ book, slug, order, title, part, summary, minutes, headings }: LoadedChapter): ChapterMeta {
  return { book, slug, order, title, part, summary, minutes, headings };
}

async function readBook(slug: string): Promise<BookMeta | null> {
  if (!BOOK_SLUG_PATTERN.test(slug)) return null;
  let meta: Record<string, string> = {};
  try {
    const stat = await fs.stat(path.join(INTERVIEW_DIR, slug));
    if (!stat.isDirectory()) return null;
    meta = parseFrontMatter(await fs.readFile(path.join(INTERVIEW_DIR, slug, BOOK_FILE), "utf8")).meta;
  } catch {
    // A folder without book.md is still a book; it just uses defaults.
  }
  const chapters = await readAllChapters(slug);
  if (chapters.length === 0) return null;
  return {
    slug,
    title: meta.title || slug,
    subtitle: meta.subtitle || "",
    description: meta.description || "",
    order: Number(meta.order) || Number.MAX_SAFE_INTEGER,
    chapterCount: chapters.length,
    minutes: chapters.reduce((sum, c) => sum + c.minutes, 0),
  };
}

export async function listBooks(): Promise<BookMeta[]> {
  await fs.mkdir(INTERVIEW_DIR, { recursive: true });
  const entries = await fs.readdir(INTERVIEW_DIR, { withFileTypes: true });
  const books = await Promise.all(entries.filter((e) => e.isDirectory()).map((e) => readBook(e.name)));
  return books
    .filter((b): b is BookMeta => b !== null)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export async function getBook(slug: string): Promise<BookMeta | null> {
  return readBook(slug.toLowerCase());
}

export async function listChapters(book: string): Promise<ChapterMeta[]> {
  if (!BOOK_SLUG_PATTERN.test(book)) return [];
  return (await readAllChapters(book.toLowerCase())).map(stripBody);
}

export async function getChapter(book: string, slug: string): Promise<Chapter | null> {
  if (!BOOK_SLUG_PATTERN.test(book)) return null;
  const all = await readAllChapters(book.toLowerCase());
  const idx = all.findIndex((c) => c.slug === slug.toLowerCase());
  if (idx === -1) return null;
  const pick = (c?: LoadedChapter) => (c ? { slug: c.slug, title: c.title } : null);
  return { ...all[idx], prev: pick(all[idx - 1]), next: pick(all[idx + 1]) };
}
