"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Code, Feather, Mystery, Quiz } from "@/components/ui/icons";

const NAV = [
  { href: "/", label: "Library", short: "Library", icon: <BookOpen size={16} />, match: (p: string) => p === "/" || p.startsWith("/read") },
  { href: "/quiz", label: "Quiz", short: "Quiz", icon: <Quiz size={16} />, match: (p: string) => p.startsWith("/quiz") },
  { href: "/interview", label: "Interview Prep", short: "Interview", icon: <Code size={16} />, match: (p: string) => p.startsWith("/interview") },
  { href: "/story", label: "Story", short: "Story", icon: <Feather size={16} />, match: (p: string) => p.startsWith("/story") },
  { href: "/mystery", label: "Unsolved Mystery", short: "Mystery", icon: <Mystery size={16} />, match: (p: string) => p.startsWith("/mystery") },
];

interface SiteHeaderProps {
  subtitle: string;
}

/**
 * Brand plus section tabs. On phones the tabs become a full-width row of equal
 * icon-over-label buttons (short labels), so all five sections fit without
 * wrapping or scrolling; from the `sm` breakpoint up they are the pill row.
 */
export function SiteHeader({ subtitle }: SiteHeaderProps) {
  const pathname = usePathname();
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 pt-5 sm:px-6 sm:pt-8">
      <Link href="/" className="flex min-w-0 items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
          <BookOpen size={22} />
        </span>
        <span className="min-w-0">
          <span className="block font-serif text-xl tracking-wide text-fg sm:text-2xl">Book Reader</span>
          <span className="line-clamp-2 block text-xs text-fg-muted sm:text-sm">{subtitle}</span>
        </span>
      </Link>
      <nav
        className="grid w-full grid-cols-5 gap-0.5 rounded-xl border border-line bg-white/5 p-1 sm:ml-auto sm:flex sm:w-auto sm:items-center sm:gap-1"
        aria-label="Sections"
      >
        {NAV.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 rounded-lg px-1 py-1.5 text-[11px] leading-none transition sm:flex-row sm:gap-2 sm:px-3 sm:text-sm ${
                active ? "bg-accent text-ink" : "text-fg-muted hover:bg-white/10 hover:text-fg"
              }`}
              aria-current={active ? "page" : undefined}
            >
              {item.icon}
              <span className="sm:hidden">{item.short}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
