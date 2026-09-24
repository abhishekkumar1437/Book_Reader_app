import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReaderShell } from "@/components/BookReader/ReaderShell";
import { localLibrary } from "@/lib/library/client";
import { getBook, LibraryError } from "@/lib/library/server";

type Props = { params: Promise<{ id: string }> };

async function load(id: string) {
  try {
    return (await getBook(id)).info;
  } catch (err) {
    if (err instanceof LibraryError) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const info = await load(id);
  return { title: info ? `${info.name} · Book Reader` : "Book Reader" };
}

export default async function ReadPage({ params }: Props) {
  const { id } = await params;
  const info = await load(id);
  if (!info) notFound();

  return (
    <ReaderShell
      id={info.id}
      name={info.name}
      fileUrl={localLibrary.fileUrl(info.id)}
      downloadUrl={localLibrary.downloadUrl(info.id)}
    />
  );
}
