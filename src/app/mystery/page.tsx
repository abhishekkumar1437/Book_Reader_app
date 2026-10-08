import type { Metadata } from "next";
import { MysteryGrid } from "@/components/Mystery/MysteryGrid";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { listMysteries } from "@/lib/mystery/server";

export const metadata: Metadata = { title: "Unsolved Mystery · Book Reader" };
// Pages are files on disk that can change at any time, so never cache this page.
export const dynamic = "force-dynamic";

export default async function MysteryPage() {
  const pages = await listMysteries();
  return (
    <main className="min-h-full">
      <SiteHeader subtitle="Open problems and puzzles nobody has cracked yet." />
      <MysteryGrid pages={pages} />
    </main>
  );
}
