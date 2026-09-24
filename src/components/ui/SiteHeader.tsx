"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Code, Quiz } from "@/components/ui/icons";

const NAV = [
  { href: "/", label: "Library", icon: <BookOpen size={16} />, match: (p: string) => p === "/" || p.startsWith("/read") },
  { href: "/quiz", label: "Quiz", icon: <Quiz size={16} />, match: (p: string) => p.startsWith("/quiz") },
  { href: "/interview", label: "Interview Prep", icon: <Code size={16} />, match: (p: string) => p.startsWith("/interview") },
];

interface SiteHeaderProps {
  subtitle: string;
}

export function SiteHeader({ subtitle }: SiteHeaderProps) {
  const pathname = usePathname();
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 pt-8 sm:px-6">
      <Link href="/" className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent">
          <BookOpen size={22} />
        </span>
        <span>
          <span className="block font-serif text-2xl tracking-wide text-fg">Book Reader</span>
          <span className="block text-sm text-fg-muted">{subtitle}</span>
        </span>
      </Link>
      <nav className="ml-auto flex items-center gap-1 rounded-xl border border-line bg-white/5 p-1" aria-label="Sections">
        {NAV.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition ${
                active ? "bg-accent text-ink" : "text-fg-muted hover:bg-white/10 hover:text-fg"
              }`}
              aria-current={active ? "page" : undefined}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
