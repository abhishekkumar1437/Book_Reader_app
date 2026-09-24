import type { BookInfo, LibraryProvider } from "./types";

async function readError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    if (body.error) return body.error;
  } catch {
    /* fall through */
  }
  return `${res.status} ${res.statusText}`;
}

/** LibraryProvider backed by the local `books/` folder via the /api/books routes. */
export const localLibrary: LibraryProvider = {
  async list() {
    const res = await fetch("/api/books", { cache: "no-store" });
    if (!res.ok) throw new Error(await readError(res));
    return ((await res.json()) as { books: BookInfo[] }).books;
  },

  upload(file, onProgress) {
    return new Promise<BookInfo>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/books");
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress?.(e.loaded / e.total);
      };
      xhr.onerror = () => reject(new Error("Network error while uploading"));
      xhr.onload = () => {
        try {
          const body = JSON.parse(xhr.responseText) as { book?: BookInfo; error?: string };
          if (xhr.status >= 200 && xhr.status < 300 && body.book) resolve(body.book);
          else reject(new Error(body.error ?? `Upload failed (${xhr.status})`));
        } catch {
          reject(new Error(`Upload failed (${xhr.status})`));
        }
      };
      const form = new FormData();
      form.append("file", file, file.name);
      xhr.send(form);
    });
  },

  async remove(id) {
    const res = await fetch(`/api/books/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await readError(res));
  },

  fileUrl(id) {
    return `/api/books/${encodeURIComponent(id)}`;
  },

  downloadUrl(id) {
    return `/api/books/${encodeURIComponent(id)}?download=1`;
  },
};
