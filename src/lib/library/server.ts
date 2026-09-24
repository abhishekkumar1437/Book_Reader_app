import "server-only";
import { promises as fs, createReadStream } from "node:fs";
import path from "node:path";
import type { BookInfo } from "./types";

/** All PDFs live here. Drop a file into this folder and it appears in the library. */
export const BOOKS_DIR = path.join(process.cwd(), "books");

export class LibraryError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function ensureDir(): Promise<void> {
  await fs.mkdir(BOOKS_DIR, { recursive: true });
}

function isPdfName(name: string): boolean {
  return name.toLowerCase().endsWith(".pdf") && !name.startsWith(".");
}

function toBookInfo(fileName: string, size: number, mtime: Date): BookInfo {
  return {
    id: fileName,
    name: fileName.replace(/\.pdf$/i, ""),
    fileName,
    size,
    addedAt: mtime.toISOString(),
  };
}

export async function listBooks(): Promise<BookInfo[]> {
  await ensureDir();
  const names = await fs.readdir(BOOKS_DIR);
  const books: BookInfo[] = [];
  for (const name of names) {
    if (!isPdfName(name)) continue;
    const stat = await fs.stat(path.join(BOOKS_DIR, name));
    if (stat.isFile()) books.push(toBookInfo(name, stat.size, stat.mtime));
  }
  return books.sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1));
}

/** Resolves a client-supplied id to a file inside BOOKS_DIR, rejecting traversal attempts. */
export function resolveBookPath(id: string): string {
  const decoded = decodeURIComponent(id);
  const fileName = path.basename(decoded);
  if (!isPdfName(fileName) || fileName !== decoded) {
    throw new LibraryError("Invalid document id", 400);
  }
  const full = path.join(BOOKS_DIR, fileName);
  if (!full.startsWith(BOOKS_DIR + path.sep)) {
    throw new LibraryError("Invalid document id", 400);
  }
  return full;
}

export async function getBook(id: string): Promise<{ info: BookInfo; filePath: string }> {
  const filePath = resolveBookPath(id);
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) throw new LibraryError("Document not found", 404);
    return { info: toBookInfo(path.basename(filePath), stat.size, stat.mtime), filePath };
  } catch (err) {
    if (err instanceof LibraryError) throw err;
    throw new LibraryError("Document not found", 404);
  }
}

async function exists(filePath: string): Promise<boolean> {
  return fs.stat(filePath).then(
    () => true,
    () => false,
  );
}

/** Produces a safe, unique file name for an uploaded document. */
async function uniqueFileName(original: string): Promise<string> {
  const base =
    path
      .basename(original)
      .replace(/\.pdf$/i, "")
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120) || "document";
  let candidate = `${base}.pdf`;
  let counter = 2;
  while (await exists(path.join(BOOKS_DIR, candidate))) {
    candidate = `${base} (${counter++}).pdf`;
  }
  return candidate;
}

export async function saveUploadedPdf(file: File): Promise<BookInfo> {
  await ensureDir();
  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.subarray(0, 5).toString("latin1") !== "%PDF-") {
    throw new LibraryError("That file is not a valid PDF", 415);
  }
  const fileName = await uniqueFileName(file.name || "document.pdf");
  const filePath = path.join(BOOKS_DIR, fileName);
  await fs.writeFile(filePath, buffer);
  const stat = await fs.stat(filePath);
  return toBookInfo(fileName, stat.size, stat.mtime);
}

export async function deleteBook(id: string): Promise<void> {
  const { filePath } = await getBook(id);
  await fs.unlink(filePath);
}

export function openBookStream(filePath: string, start?: number, end?: number) {
  return createReadStream(filePath, start !== undefined ? { start, end } : undefined);
}
