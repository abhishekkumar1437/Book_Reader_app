import { NextResponse } from "next/server";
import { createReadStream, promises as fs } from "node:fs";
import { Readable } from "node:stream";
import { contentTypeFor, resolveMysteryFile } from "@/lib/mystery/server";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ path: string[] }> };

/** Serves a page or asset from the unsolved_mysteries folder exactly as it is on disk. */
export async function GET(_req: Request, { params }: Ctx) {
  const { path: parts } = await params;
  const rel = parts.map((p) => decodeURIComponent(p)).join("/");
  const file = resolveMysteryFile(rel);
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });
  let size: number;
  try {
    const stat = await fs.stat(file);
    if (!stat.isFile()) throw new Error("not a file");
    size = stat.size;
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const stream = Readable.toWeb(createReadStream(file)) as ReadableStream;
  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Type": contentTypeFor(file),
      "Content-Length": String(size),
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
