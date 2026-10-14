"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Palette } from "@/components/ui/icons";
import { READING_THEMES, type ReadingStore, type ReadingTheme } from "@/lib/reading/storage";

/** Swatch colours (background, text) and labels; the full palettes live in globals.css. */
const THEMES: Record<ReadingTheme, { label: string; bg: string; fg: string }> = {
  dark: { label: "Dark", bg: "#14110e", fg: "#efe7d8" },
  black: { label: "Black", bg: "#000000", fg: "#d9d4cc" },
  slate: { label: "Slate", bg: "#1a2129", fg: "#dbe3ea" },
  sepia: { label: "Sepia", bg: "#f3e7cf", fg: "#3d2f1e" },
  paper: { label: "Paper", bg: "#fbfaf6", fg: "#22201c" },
  mint: { label: "Mint", bg: "#e4f0e2", fg: "#1f2e22" },
};

/**
 * Toolbar button that lets the reader pick a background colour. The choice is saved in
 * the shelf's store and applied as `data-reading-theme` on <html> while the reader is
 * mounted, so the rest of the app keeps its own palette.
 */
export function ReadingThemePicker({ store }: { store: ReadingStore }) {
  const [theme, setTheme] = useState<ReadingTheme>("dark");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setTheme(store.getTheme()), 0);
    return () => window.clearTimeout(id);
  }, [store]);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") delete html.dataset.readingTheme;
    else html.dataset.readingTheme = theme;
    return () => {
      delete html.dataset.readingTheme;
    };
  }, [theme]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (next: ReadingTheme) => {
    setTheme(next);
    store.setTheme(next);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 text-xs text-fg-muted hover:text-fg"
        aria-label="Background colour"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Palette size={14} />
        <span className="h-3 w-3 rounded-full border border-line" style={{ background: THEMES[theme].bg }} />
      </button>
      {open && (
        <div
          role="group"
          aria-label="Background colour"
          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-line bg-bg-2 p-3 shadow-xl"
        >
          <p className="mb-2 text-[11px] tracking-widest text-fg-muted uppercase">Background</p>
          <div className="grid grid-cols-3 gap-2">
            {READING_THEMES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => choose(t)}
                aria-pressed={theme === t}
                className={`flex flex-col items-center gap-1 rounded-lg border p-1.5 text-[11px] transition ${
                  theme === t ? "border-accent text-accent" : "border-line text-fg-muted hover:text-fg"
                }`}
              >
                <span
                  className="flex h-8 w-full items-center justify-center rounded-md border border-black/10 font-serif text-sm"
                  style={{ background: THEMES[t].bg, color: THEMES[t].fg }}
                >
                  {theme === t ? <Check size={14} /> : "Aa"}
                </span>
                {THEMES[t].label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
