import { NextResponse } from "next/server";
import { LibraryError, listBooks, saveUploadedPdf } from "@/lib/library/server";
import { MAX_UPLOAD_BYTES } from "@/lib/library/types";

export const runtime = "nodejs";

function errorResponse(err: unknown) {
  if (err instanceof LibraryError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error(err);
  return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
}

export async function GET() {
  try {
    return NextResponse.json({ books: await listBooks() });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new LibraryError("No file received", 400);
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      throw new LibraryError("Only PDF files are supported right now", 415);
    }
    if (file.size === 0) throw new LibraryError("The file is empty", 400);
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new LibraryError("File is larger than the 200 MB limit", 413);
    }
    return NextResponse.json({ book: await saveUploadedPdf(file) }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
