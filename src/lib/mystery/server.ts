import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * The Unsolved Mystery shelf: self-contained HTML pages kept on disk.
 *
 *   unsolved_mysteries/
 *     Millennium Problems/
 *       millennium-problems.html     one card per .html file; the folder name is the card's label
 *       figure.png                   any other file in the folder is served next to the page
 *     Voynich Manuscript/
 *       voynich-regenerated.html
 *     loose-page.html                a page directly in the root is fine too
 *
 * Pages are served verbatim through /api/mysteries/<path>, so their own styles,
 * scripts and relative assets keep working, and shown inside the app in a frame.
 */
export const MYSTERIES_DIR = path.join(process.cwd(), "unsolved_mysteries");

export interface MysteryPage {
  /** Path relative to the shelf, forward slashes, without `.html`. Used in URLs. */
  id: string;
  /** Same path with the `.html` extension, for the file-serving route. */
  file: string;
  title: string;
  /** Folder the page sits in, or "" for a page in the shelf root. */
  group: string;
  description: string;
}

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".wasm": "application/wasm",
};

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(s: string): string {
  return decodeEntities(s.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
}

/** Pulls a title and a one-paragraph description out of the page's own markup. */
function describe(html: string, fallbackTitle: string): { title: string; description: string } {
  const head = html.slice(0, 200_000);
  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(head)?.[1];
  const meta = /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i.exec(head)?.[1];
  const lede =
    /<p[^>]*class=["'][^"']*\blede\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i.exec(head)?.[1] ??
    /<header[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i.exec(head)?.[1] ??
    /<p[^>]*>([\s\S]*?)<\/p>/i.exec(head)?.[1];
  const description = stripTags(meta ?? lede ?? "");
  return {
    title: stripTags(title ?? "") || fallbackTitle,
    description: description.length > 280 ? `${description.slice(0, 277).trimEnd()}…` : description,
  };
}

/** Resolves a shelf-relative path to an absolute file inside the shelf, or null if it escapes it. */
export function resolveMysteryFile(relPath: string): string | null {
  const parts = relPath.split("/").filter(Boolean);
  if (parts.length === 0 || parts.some((p) => p === "." || p === ".." || p.startsWith("."))) return null;
  const abs = path.resolve(MYSTERIES_DIR, ...parts);
  const root = path.resolve(MYSTERIES_DIR) + path.sep;
  return abs.startsWith(root) ? abs : null;
}

export function contentTypeFor(file: string): string {
  return CONTENT_TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream";
}

async function readPage(rel: string): Promise<MysteryPage | null> {
  const abs = resolveMysteryFile(rel);
  if (!abs) return null;
  try {
    const html = await fs.readFile(abs, "utf8");
    const base = path.posix.basename(rel).replace(/\.html?$/i, "");
    const group = path.posix.dirname(rel);
    const { title, description } = describe(html, group === "." ? base.replace(/[-_]+/g, " ") : group);
    return { id: rel.replace(/\.html?$/i, ""), file: rel, title, group: group === "." ? "" : group, description };
  } catch (err) {
    console.warn(`Skipping mystery page "${rel}":`, err instanceof Error ? err.message : err);
    return null;
  }
}

/** Every .html page in the shelf root or one folder down, sorted by folder then title. */
export async function listMysteries(): Promise<MysteryPage[]> {
  await fs.mkdir(MYSTERIES_DIR, { recursive: true });
  const rels: string[] = [];
  const top = await fs.readdir(MYSTERIES_DIR, { withFileTypes: true });
  for (const entry of top) {
    if (entry.name.startsWith(".")) continue;
    if (entry.isFile() && /\.html?$/i.test(entry.name)) rels.push(entry.name);
    if (!entry.isDirectory()) continue;
    let inner: import("node:fs").Dirent[] = [];
    try {
      inner = await fs.readdir(path.join(MYSTERIES_DIR, entry.name), { withFileTypes: true });
    } catch {
      continue;
    }
    for (const f of inner) {
      if (f.isFile() && /\.html?$/i.test(f.name) && !f.name.startsWith(".")) rels.push(`${entry.name}/${f.name}`);
    }
  }
  const pages = await Promise.all(rels.map(readPage));
  return pages
    .filter((p): p is MysteryPage => p !== null)
    .sort((a, b) => a.group.localeCompare(b.group) || a.title.localeCompare(b.title));
}

export async function getMystery(id: string): Promise<MysteryPage | null> {
  const clean = id.replace(/\.html?$/i, "");
  for (const ext of [".html", ".htm"]) {
    const page = await readPage(`${clean}${ext}`);
    if (page) return page;
  }
  return null;
}
