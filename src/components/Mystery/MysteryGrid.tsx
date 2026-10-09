import Link from "next/link";
import { ChevronRight } from "@/components/ui/icons";
import type { MysteryPage } from "@/lib/mystery/server";

function pageHref(page: MysteryPage): string {
  return `/mystery/${page.id.split("/").map(encodeURIComponent).join("/")}`;
}

function MysteryCard({ page }: { page: MysteryPage }) {
  const href = pageHref(page);
  return (
    <article className="card group flex flex-col rounded-2xl border border-line bg-bg-2/80 p-2.5 sm:p-3">
      <Link href={href} className="block" aria-label={`Open ${page.title}`}>
        <div className="cover">
          <div className="flex h-full flex-col justify-between p-3 pl-5 sm:p-5 sm:pl-7">
            <span className="text-[9px] tracking-[0.2em] text-ink/50 uppercase sm:text-[10px] sm:tracking-[0.25em]">Unsolved Mystery</span>
            <span>
              <span className="block font-serif text-lg leading-tight text-ink sm:text-2xl">{page.title}</span>
              {page.group && <span className="mt-1 line-clamp-2 block text-xs text-ink/70 sm:mt-2 sm:text-sm">{page.group}</span>}
            </span>
            <span className="text-[10px] text-ink/50 sm:text-[11px]">Interactive page</span>
          </div>
        </div>
      </Link>

      <div className="mt-3 min-w-0 flex-1">
        <h3 className="font-serif text-[15px] leading-snug text-fg">{page.title}</h3>
        {page.group && <p className="mt-0.5 text-xs text-fg-muted">{page.group}</p>}
        {page.description && <p className="mt-1.5 line-clamp-3 text-xs text-fg-muted">{page.description}</p>}
      </div>

      <Link
        href={href}
        className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-accent px-2 py-2 text-sm font-medium text-ink transition hover:bg-accent-2 sm:px-3"
      >
        Open page
        <ChevronRight size={16} />
      </Link>
    </article>
  );
}

export function MysteryGrid({ pages }: { pages: MysteryPage[] }) {
  if (pages.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mt-10 rounded-2xl border border-dashed border-line px-6 py-16 text-center text-fg-muted">
          <p className="font-serif text-lg text-fg">No pages yet</p>
          <p className="mt-2 text-sm">Add an HTML file under the unsolved_mysteries folder to see it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <section className="mt-8">
        <h2 className="mb-4 font-serif text-2xl text-fg">Unsolved Mysteries</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {pages.map((page) => (
            <MysteryCard key={page.id} page={page} />
          ))}
        </div>
      </section>
    </div>
  );
}
