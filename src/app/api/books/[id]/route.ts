import { NextResponse } from "next/server";
import { Readable } from "node:stream";
import { deleteBook, getBook, LibraryError, openBookStream } from "@/lib/library/server";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

function errorResponse(err: unknown) {
  if (err instanceof LibraryError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error(err);
  return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
}

/**
 * Streams the PDF. Supports HTTP Range requests so PDF.js can fetch only the parts of a
 * large document it needs instead of downloading the whole file up front.
 */
export async function GET(req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const { info, filePath } = await getBook(id);
    const url = new URL(req.url);
    const asDownload = url.searchParams.get("download") === "1";
    const disposition = asDownload ? "attachment" : "inline";

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, max-age=0, must-revalidate",
      "Content-Disposition": `${disposition}; filename*=UTF-8''${encodeURIComponent(info.fileName)}`,
    });

    const range = req.headers.get("range");
    const match = range ? /^bytes=(\d*)-(\d*)$/.exec(range) : null;
    if (match) {
      const total = info.size;
      let start = match[1] ? Number(match[1]) : 0;
      let end = match[2] ? Number(match[2]) : total - 1;
      if (!match[1] && match[2]) {
        start = Math.max(0, total - Number(match[2]));
        end = total - 1;
      }
      if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= total) {
        headers.set("Content-Range", `bytes */${total}`);
        return new NextResponse(null, { status: 416, headers });
      }
      end = Math.min(end, total - 1);
      headers.set("Content-Range", `bytes ${start}-${end}/${total}`);
      headers.set("Content-Length", String(end - start + 1));
      const stream = Readable.toWeb(openBookStream(filePath, start, end)) as ReadableStream;
      return new NextResponse(stream, { status: 206, headers });
    }

    headers.set("Content-Length", String(info.size));
    const stream = Readable.toWeb(openBookStream(filePath)) as ReadableStream;
    return new NextResponse(stream, { status: 200, headers });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    await deleteBook(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
