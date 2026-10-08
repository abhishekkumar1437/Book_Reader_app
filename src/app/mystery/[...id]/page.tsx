import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Fullscreen } from "@/components/ui/icons";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { getMystery } from "@/lib/mystery/server";

type Props = { params: Promise<{ id: string[] }> };

export const dynamic = "force-dynamic";

function decode(parts: string[]): string {
  return parts
    .map((p) => {
      try {
        return decodeURIComponent(p);
      } catch {
        return p;
      }
    })
    .join("/");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const page = await getMystery(decode(id));
  return { title: page ? `${page.title} · Unsolved Mystery` : "Unsolved Mystery · Book Reader" };
}

export default async function MysteryViewerPage({ params }: Props) {
  const { id } = await params;
  const page = await getMystery(decode(id));
  if (!page) notFound();
  const src = `/api/mysteries/${page.file.split("/").map(encodeURIComponent).join("/")}`;

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader subtitle={page.group || "Unsolved Mystery"} />
      <div className="mx-auto mt-4 flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 sm:px-6">
        <Link href="/mystery" className="flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg">
          <ArrowLeft size={16} /> All mysteries
        </Link>
        <h1 className="min-w-0 flex-1 truncate font-serif text-lg text-fg">{page.title}</h1>
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1 text-xs text-fg-muted transition hover:text-fg"
        >
          <Fullscreen size={14} /> Open in new tab
        </a>
      </div>
      <div className="mx-auto mt-3 w-full max-w-6xl flex-1 px-4 pb-6 sm:px-6">
        <iframe
          src={src}
          title={page.title}
          className="h-[calc(100vh-11rem)] min-h-[480px] w-full rounded-2xl border border-line bg-white"
          allow="fullscreen"
        />
      </div>
    </main>
  );
}
