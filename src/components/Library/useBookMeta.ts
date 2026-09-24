"use client";

import { useEffect, useState } from "react";
import { PdfBook } from "@/lib/pdf/pdfBook";
import { localReaderStore, type BookMeta } from "@/lib/storage/readerState";
import type { BookInfo } from "@/lib/library/types";

const COVER_WIDTH_PX = 320;

/** Serializes cover generation so a big library does not open every PDF at once. */
let queue: Promise<void> = Promise.resolve();

async function blobUrlToDataUrl(url: string): Promise<string> {
  const blob = await fetch(url).then((r) => r.blob());
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function buildMeta(fileUrl: string, size: number): Promise<BookMeta> {
  const book = await PdfBook.load(fileUrl);
  try {
    const rendered = await book.renderPage(1, COVER_WIDTH_PX);
    const cover = await blobUrlToDataUrl(rendered.url).catch(() => null);
    URL.revokeObjectURL(rendered.url);
    return { pages: book.numPages, cover, size };
  } finally {
    book.destroy();
  }
}

/** Page count and cover image for a library card, cached in local storage. */
export function useBookMeta(book: BookInfo, fileUrl: string) {
  const [meta, setMeta] = useState<BookMeta | null>(() => {
    const cached = localReaderStore.getMeta(book.id);
    return cached && cached.size === book.size ? cached : null;
  });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (meta) return;
    let cancelled = false;
    queue = queue.then(async () => {
      if (cancelled) return;
      try {
        const built = await buildMeta(fileUrl, book.size);
        localReaderStore.setMeta(book.id, built);
        if (!cancelled) setMeta(built);
      } catch {
        if (!cancelled) setFailed(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [meta, book.id, book.size, fileUrl]);

  return { meta, failed };
}
