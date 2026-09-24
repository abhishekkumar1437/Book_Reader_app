/** A document available in the library. */
export interface BookInfo {
  /** Stable identifier (the file name, URL-encoded on the wire). */
  id: string;
  /** Display name without the .pdf extension. */
  name: string;
  fileName: string;
  /** Size in bytes. */
  size: number;
  /** ISO timestamp of when the file was added to the library. */
  addedAt: string;
}

/**
 * Storage abstraction for the library. The default implementation reads and writes
 * the local `books/` folder through the Next.js API; swap it for Firebase or any
 * other backend without touching the UI.
 */
export interface LibraryProvider {
  list(): Promise<BookInfo[]>;
  upload(file: File, onProgress?: (fraction: number) => void): Promise<BookInfo>;
  remove(id: string): Promise<void>;
  /** URL the PDF engine can stream the document from (must support HTTP Range). */
  fileUrl(id: string): string;
  downloadUrl(id: string): string;
}

export const MAX_UPLOAD_BYTES = 200 * 1024 * 1024;
export const ACCEPTED_EXTENSIONS = [".pdf"];
