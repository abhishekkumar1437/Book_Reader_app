"use client";

import { useCallback, useEffect, useState } from "react";
import { DocumentUploader } from "@/components/Upload/DocumentUploader";
import { Alert } from "@/components/ui/icons";
import { localLibrary } from "@/lib/library/client";
import type { BookInfo } from "@/lib/library/types";
import { localReaderStore, type ReadingPosition } from "@/lib/storage/readerState";
import { DocumentCard } from "./DocumentCard";

const library = localLibrary;

interface Shelf {
  books: BookInfo[];
  positions: Record<string, ReadingPosition | null>;
}

function readPositions(books: BookInfo[]): Shelf["positions"] {
  return Object.fromEntries(books.map((b) => [b.id, localReaderStore.getPosition(b.id)]));
}

export function Library() {
  const [shelf, setShelf] = useState<Shelf | null>(null);
  const [error, setError] = useState<string | null>(null);
  const books = shelf?.books ?? null;

  const refresh = useCallback(() => {
    library
      .list()
      .then((list) => {
        setShelf({ books: list, positions: readPositions(list) });
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Could not load the library");
        setShelf((prev) => prev ?? { books: [], positions: {} });
      });
  }, []);

  useEffect(() => {
    refresh();
    // Pick up PDFs copied into the books folder (and new reading positions) when the tab regains focus.
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [refresh]);

  const onUploaded = useCallback((book: BookInfo) => {
    setShelf((prev) => ({
      books: [book, ...(prev?.books ?? []).filter((b) => b.id !== book.id)],
      positions: { ...(prev?.positions ?? {}), [book.id]: null },
    }));
  }, []);

  const onDelete = useCallback(async (book: BookInfo) => {
    if (!window.confirm(`Delete "${book.name}" from your library? This removes the file from the books folder.`)) return;
    try {
      await library.remove(book.id);
      localReaderStore.forget(book.id);
      setShelf((prev) =>
        prev ? { ...prev, books: prev.books.filter((b) => b.id !== book.id) } : prev,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete the document");
    }
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <section className="mt-6">
        <DocumentUploader library={library} onUploaded={onUploaded} />
        <p className="mt-3 text-center text-xs text-fg-muted">
          You can also copy PDF files straight into the <code className="rounded bg-white/10 px-1 py-0.5">books</code> folder of this project.
        </p>
      </section>

      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          <Alert size={16} />
          <span>{error}</span>
        </div>
      )}

      <section className="mt-10">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl text-fg">My Library</h2>
          {books && books.length > 0 && (
            <span className="text-sm text-fg-muted">
              {books.length} book{books.length === 1 ? "" : "s"}
            </span>
          )}
        </div>

        {books === null && (
          <div className="flex justify-center py-16">
            <div className="spinner" />
          </div>
        )}

        {books && books.length === 0 && !error && (
          <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center text-fg-muted">
            <p className="font-serif text-lg text-fg">Your shelf is empty</p>
            <p className="mt-2 text-sm">Drop a PDF above, or copy one into the books folder, to start reading.</p>
          </div>
        )}

        {books && books.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {books.map((book) => (
              <DocumentCard
                key={book.id}
                book={book}
                position={shelf?.positions[book.id] ?? null}
                library={library}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
