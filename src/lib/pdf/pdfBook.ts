import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

export interface OutlineEntry {
  title: string;
  /** 1-based page number, or null when the destination could not be resolved. */
  page: number | null;
  children: OutlineEntry[];
}

export interface RenderedPage {
  /** Object URL of the rendered bitmap. Call URL.revokeObjectURL when discarding. */
  url: string;
  /** Width in device pixels the bitmap was rendered at. */
  widthPx: number;
  /** Encoded size in bytes, used for the cache's memory budget. */
  bytes: number;
}

export class PdfLoadError extends Error {
  constructor(message: string, public kind: "invalid" | "network" | "missing" | "password" | "unknown") {
    super(message);
  }
}

/** Largest bitmap edge we ever render; keeps memory and encode time bounded on deep zooms. */
const MAX_BITMAP_EDGE = 3000;

/**
 * Thin wrapper around a PDF.js document: page rendering to bitmaps, text extraction
 * and outline resolution. Pages are fetched on demand; nothing is rendered eagerly.
 */
export class PdfBook {
  private readonly pageCache = new Map<number, Promise<PDFPageProxy>>();
  private readonly textCache = new Map<number, Promise<string>>();

  private constructor(
    private readonly doc: PDFDocumentProxy,
    public readonly numPages: number,
    /** Width / height of the first page, used for the book's fixed page shape. */
    public readonly pageAspect: number,
  ) {}

  static async load(url: string): Promise<PdfBook> {
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
    try {
      const doc = await pdfjs.getDocument({
        url,
        rangeChunkSize: 256 * 1024,
        standardFontDataUrl: "/pdfjs/standard_fonts/",
        cMapUrl: "/pdfjs/cmaps/",
        iccUrl: "/pdfjs/iccs/",
        wasmUrl: "/pdfjs/wasm/",
      }).promise;
      if (doc.numPages < 1) throw new PdfLoadError("This PDF has no pages", "invalid");
      const first = await doc.getPage(1);
      const viewport = first.getViewport({ scale: 1 });
      const aspect = viewport.width > 0 && viewport.height > 0 ? viewport.width / viewport.height : 0.7;
      return new PdfBook(doc, doc.numPages, aspect);
    } catch (err) {
      throw PdfBook.toLoadError(err);
    }
  }

  private static toLoadError(err: unknown): PdfLoadError {
    if (err instanceof PdfLoadError) return err;
    const name = (err as { name?: string })?.name ?? "";
    const message = (err as { message?: string })?.message ?? "";
    if (name === "InvalidPDFException") {
      return new PdfLoadError("This file is not a valid PDF or is corrupted", "invalid");
    }
    if (name === "PasswordException") {
      return new PdfLoadError("This PDF is password protected", "password");
    }
    if (name === "MissingPDFException") {
      return new PdfLoadError("The document could not be found", "missing");
    }
    if (name === "UnexpectedResponseException" || /fetch|network/i.test(message)) {
      return new PdfLoadError("Network error while loading the document", "network");
    }
    return new PdfLoadError(message || "The document could not be opened", "unknown");
  }

  private getPage(pageNumber: number): Promise<PDFPageProxy> {
    let promise = this.pageCache.get(pageNumber);
    if (!promise) {
      promise = this.doc.getPage(pageNumber);
      promise.catch(() => this.pageCache.delete(pageNumber));
      this.pageCache.set(pageNumber, promise);
    }
    return promise;
  }

  /**
   * Renders one page so that its width is `targetWidthPx` device pixels.
   * The result is an object URL of a compressed bitmap so the DOM can hold it
   * without keeping a large canvas alive.
   */
  async renderPage(pageNumber: number, targetWidthPx: number): Promise<RenderedPage> {
    const page = await this.getPage(pageNumber);
    const base = page.getViewport({ scale: 1 });
    let scale = targetWidthPx / base.width;
    const longest = Math.max(base.width, base.height) * scale;
    if (longest > MAX_BITMAP_EDGE) scale *= MAX_BITMAP_EDGE / longest;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Canvas is not available");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, canvas, viewport, background: "#ffffff" }).promise;

    // Lossless PNG keeps small text crisp; lossy formats visibly smear glyph edges.
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    canvas.width = 0;
    canvas.height = 0;
    if (!blob) throw new Error("Could not encode page bitmap");
    return { url: URL.createObjectURL(blob), widthPx: Math.ceil(viewport.width), bytes: blob.size };
  }

  /** Plain text of a page, cached after the first extraction. */
  getPageText(pageNumber: number): Promise<string> {
    let promise = this.textCache.get(pageNumber);
    if (!promise) {
      promise = this.getPage(pageNumber).then(async (page) => {
        const content = await page.getTextContent();
        let text = "";
        for (const item of content.items) {
          if ("str" in item) {
            text += item.str;
            text += item.hasEOL ? "\n" : " ";
          }
        }
        return text.replace(/[ \t]+/g, " ");
      });
      promise.catch(() => this.textCache.delete(pageNumber));
      this.textCache.set(pageNumber, promise);
    }
    return promise;
  }

  async getOutline(): Promise<OutlineEntry[]> {
    const outline = await this.doc.getOutline();
    if (!outline) return [];

    const resolve = async (item: (typeof outline)[number]): Promise<OutlineEntry> => {
      let page: number | null = null;
      try {
        const dest =
          typeof item.dest === "string" ? await this.doc.getDestination(item.dest) : item.dest;
        const ref = dest?.[0];
        if (ref && typeof ref === "object") {
          page = (await this.doc.getPageIndex(ref)) + 1;
        } else if (typeof ref === "number") {
          page = ref + 1;
        }
      } catch {
        page = null;
      }
      const children = await Promise.all((item.items ?? []).map(resolve));
      return { title: item.title?.trim() || "Untitled", page, children };
    };

    return Promise.all(outline.map(resolve));
  }

  destroy(): void {
    this.pageCache.clear();
    this.textCache.clear();
    void this.doc.loadingTask.destroy();
  }
}
