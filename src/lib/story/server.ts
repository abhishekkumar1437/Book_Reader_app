import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { StoryChapter, StoryChapterLink, StoryChapterMeta, StoryMeta } from "./types";

/**
 * The story shelf lives here: one sub-folder per story. The folder name is the
 * story's name (underscores read as spaces) unless `story.md` overrides it.
 *
 *   stories/
 *     The_gods_who_never_born/
 *       story.md             optional: title, genre, description, order
 *       chapters/
 *         adhyay-001.md      chapters: any `.md` with a number in its name; the number orders them
 *         adhyay-002.md
 *     सप्तलोक संग्राम/
 *       chapters/ch01.md
 *
 * A chapter's title is its first `# ` heading. Other Markdown files in the story
 * folder (story bible, character notes, ...) are ignored.
 */
export const STORIES_DIR = path.join(process.cwd(), "stories");

const STORY_FILE = "story.md";
const BIBLE_FILE = "STORY_BIBLE.md";
const CHAPTERS_SUBDIR = "chapters";
const CHAPTER_FILE_PATTERN = /^(?=.*\d)[^/\\]+\.md$/i;
const TITLE_PREFIX_PATTERN = /^\s*(?:अध्याय|adhyay|chapter|ch)\s*[\d०-९]+\s*(?:[—–:.|-]\s*)?/iu;
const WORDS_PER_MINUTE = 180;

/** Folder names are used in URLs; refuse anything that could escape the shelf. */
function isSafeSlug(slug: string): boolean {
  return slug.length > 0 && !slug.startsWith(".") && !/[/\\]/.test(slug) && !slug.includes("..");
}

function parseFrontMatter(text: string): Record<string, string> {
  const normalized = text.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) return {};
  const end = normalized.indexOf("\n---", 4);
  if (end === -1) return {};
  const meta: Record<string, string> = {};
  for (const line of normalized.slice(4, end).split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return meta;
}

/** Splits a chapter file into its `# ` title and the rest of the Markdown. */
function splitTitle(text: string, fallback: string): { title: string; body: string } {
  const normalized = text.replace(/\r\n/g, "\n").replace(/^﻿/, "");
  const m = /^\s*#[ \t]+(.+?)[ \t]*#*[ \t]*(?:\n|$)/.exec(normalized);
  if (!m) return { title: fallback, body: normalized.replace(/^\n+/, "") };
  return { title: m[1].replace(/[`*_]/g, "").trim(), body: normalized.slice(m[0].length).replace(/^\n+/, "") };
}

function shortName(title: string): string {
  const stripped = title.replace(TITLE_PREFIX_PATTERN, "").trim();
  return stripped || title;
}

function estimateMinutes(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function chapterOrder(fileName: string): number {
  const m = /(\d+)/.exec(fileName);
  return m ? Number(m[1]) : Number.MAX_SAFE_INTEGER;
}

/** Where a story keeps its chapters: `chapters/` when present, otherwise the story folder itself. */
async function chaptersDir(story: string): Promise<string> {
  const nested = path.join(STORIES_DIR, story, CHAPTERS_SUBDIR);
  try {
    if ((await fs.stat(nested)).isDirectory()) return nested;
  } catch {
    /* no chapters sub-folder */
  }
  return path.join(STORIES_DIR, story);
}

// Chapter metadata is cached per file and invalidated by mtime/size, so listing a
// 500-chapter story does not re-read every file on each navigation.
const metaCache = new Map<string, { stamp: string; meta: StoryChapterMeta }>();

async function readChapterMeta(story: string, dir: string, fileName: string): Promise<StoryChapterMeta | null> {
  const file = path.join(dir, fileName);
  try {
    const stat = await fs.stat(file);
    if (!stat.isFile()) return null;
    const stamp = `${stat.mtimeMs}:${stat.size}`;
    const cached = metaCache.get(file);
    if (cached && cached.stamp === stamp) return cached.meta;
    const slug = fileName.replace(/\.md$/i, "");
    const { title, body } = splitTitle(await fs.readFile(file, "utf8"), slug);
    const meta: StoryChapterMeta = {
      story,
      slug,
      order: chapterOrder(fileName),
      title,
      name: shortName(title),
      minutes: estimateMinutes(body),
    };
    metaCache.set(file, { stamp, meta });
    return meta;
  } catch (err) {
    console.warn(`Skipping chapter "${story}/${fileName}":`, err instanceof Error ? err.message : err);
    return null;
  }
}

async function readAllChapters(story: string): Promise<StoryChapterMeta[]> {
  const dir = await chaptersDir(story);
  let names: string[];
  try {
    names = (await fs.readdir(dir)).filter((n) => CHAPTER_FILE_PATTERN.test(n) && n.toLowerCase() !== STORY_FILE);
  } catch {
    return [];
  }
  const chapters = await Promise.all(names.map((n) => readChapterMeta(story, dir, n)));
  return chapters
    .filter((c): c is StoryChapterMeta => c !== null)
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}

/** Falls back to the `Genre:` line of a story bible when story.md does not name one. */
async function genreFromBible(story: string): Promise<string> {
  try {
    const text = await fs.readFile(path.join(STORIES_DIR, story, BIBLE_FILE), "utf8");
    const m = /^genre:[ 	]*(.+)$/im.exec(text);
    if (!m) return "";
    return m[1]
      .split(/[•·,|/]/)
      .map((g) => g.trim())
      .filter(Boolean)
      .slice(0, 2)
      .join(" · ");
  } catch {
    return "";
  }
}

async function readStory(slug: string): Promise<StoryMeta | null> {
  if (!isSafeSlug(slug)) return null;
  let meta: Record<string, string> = {};
  try {
    const stat = await fs.stat(path.join(STORIES_DIR, slug));
    if (!stat.isDirectory()) return null;
    meta = parseFrontMatter(await fs.readFile(path.join(STORIES_DIR, slug, STORY_FILE), "utf8"));
  } catch {
    // A folder without story.md is still a story; it just uses defaults.
  }
  const chapters = await readAllChapters(slug);
  if (chapters.length === 0) return null;
  return {
    slug,
    title: meta.title || slug.replace(/_+/g, " ").trim(),
    genre: meta.genre || (await genreFromBible(slug)) || "Story",
    description: meta.description || "",
    order: Number(meta.order) || Number.MAX_SAFE_INTEGER,
    chapterCount: chapters.length,
    minutes: chapters.reduce((sum, c) => sum + c.minutes, 0),
  };
}

export async function listStories(): Promise<StoryMeta[]> {
  await fs.mkdir(STORIES_DIR, { recursive: true });
  const entries = await fs.readdir(STORIES_DIR, { withFileTypes: true });
  const stories = await Promise.all(entries.filter((e) => e.isDirectory()).map((e) => readStory(e.name)));
  return stories
    .filter((s): s is StoryMeta => s !== null)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export async function getStory(slug: string): Promise<StoryMeta | null> {
  return readStory(slug);
}

export async function listStoryChapters(story: string): Promise<StoryChapterMeta[]> {
  if (!isSafeSlug(story)) return [];
  return readAllChapters(story);
}

export async function getStoryChapter(story: string, slug: string): Promise<StoryChapter | null> {
  if (!isSafeSlug(story) || !isSafeSlug(slug)) return null;
  const all = await readAllChapters(story);
  const idx = all.findIndex((c) => c.slug === slug);
  if (idx === -1) return null;
  const dir = await chaptersDir(story);
  let body: string;
  try {
    body = splitTitle(await fs.readFile(path.join(dir, `${slug}.md`), "utf8"), slug).body;
  } catch {
    return null;
  }
  const pick = (c?: StoryChapterMeta): StoryChapterLink | null =>
    c ? { slug: c.slug, name: c.name, order: c.order } : null;
  return { ...all[idx], body, prev: pick(all[idx - 1]), next: pick(all[idx + 1]) };
}
