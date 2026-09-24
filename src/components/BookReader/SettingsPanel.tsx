"use client";

import type { ReactNode } from "react";
import { BookOpen, SinglePage } from "@/components/ui/icons";
import type { ReaderLayout, ReaderSettings, ReaderTheme } from "@/lib/storage/readerState";
import { Panel } from "./Panel";

const LAYOUTS: { value: ReaderLayout; label: string; hint: string; icon: ReactNode }[] = [
  {
    value: "auto",
    label: "Auto",
    hint: "Two pages on wide screens, one page on narrow screens.",
    icon: <BookOpen size={20} />,
  },
  {
    value: "single",
    label: "Single",
    hint: "Always one page at a time, like reading on a tablet.",
    icon: <SinglePage size={20} />,
  },
  {
    value: "spread",
    label: "Book",
    hint: "Always show the open book with two facing pages.",
    icon: <BookOpen size={20} />,
  },
];

interface SettingsPanelProps {
  settings: ReaderSettings;
  onChange: (settings: ReaderSettings) => void;
  onClearPosition: () => void;
  onClose: () => void;
}

const THEMES: { value: ReaderTheme; label: string; swatch: string }[] = [
  { value: "paper", label: "Paper", swatch: "#f5eee0" },
  { value: "sepia", label: "Sepia", swatch: "#ecdcbb" },
  { value: "night", label: "Night", swatch: "#2b2926" },
];

export function SettingsPanel({ settings, onChange, onClearPosition, onClose }: SettingsPanelProps) {
  return (
    <Panel title="Settings" onClose={onClose}>
      <section className="px-3 py-2">
        <h3 className="mb-2 text-xs tracking-widest text-fg-muted uppercase">Page tone</h3>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange({ ...settings, theme: t.value })}
              className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2 text-xs transition ${
                settings.theme === t.value
                  ? "border-accent bg-accent/10 text-fg"
                  : "border-line text-fg-muted hover:bg-white/5"
              }`}
              aria-pressed={settings.theme === t.value}
            >
              <span
                className="h-7 w-7 rounded-full border border-black/30"
                style={{ background: t.swatch }}
              />
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <section className="px-3 py-2">
        <h3 className="mb-2 text-xs tracking-widest text-fg-muted uppercase">Layout</h3>
        <div className="grid grid-cols-3 gap-2">
          {LAYOUTS.map((l) => (
            <button
              key={l.value}
              type="button"
              onClick={() => onChange({ ...settings, layout: l.value })}
              className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2 text-xs transition ${
                settings.layout === l.value
                  ? "border-accent bg-accent/10 text-fg"
                  : "border-line text-fg-muted hover:bg-white/5"
              }`}
              aria-pressed={settings.layout === l.value}
              title={l.hint}
            >
              {l.icon}
              {l.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-fg-muted">
          {LAYOUTS.find((l) => l.value === settings.layout)?.hint}
        </p>
      </section>

      <section className="px-3 py-3">
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="text-xs tracking-widest text-fg-muted uppercase">Page turn speed</h3>
          <span className="font-mono text-[11px] text-fg-muted">{settings.flipDuration} ms</span>
        </div>
        <input
          type="range"
          className="slider"
          min={400}
          max={1600}
          step={50}
          value={settings.flipDuration}
          style={
            {
              "--progress": `${((settings.flipDuration - 400) / 1200) * 100}%`,
            } as React.CSSProperties
          }
          onChange={(e) => onChange({ ...settings, flipDuration: Number(e.target.value) })}
          aria-label="Page turn duration"
        />
        <div className="mt-1 flex justify-between text-[11px] text-fg-muted">
          <span>Quick</span>
          <span>Leisurely</span>
        </div>
      </section>

      <section className="px-3 py-2">
        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-line px-3 py-2.5 text-sm">
          <span>Show page numbers</span>
          <input
            type="checkbox"
            checked={settings.showPageNumbers}
            onChange={(e) => onChange({ ...settings, showPageNumbers: e.target.checked })}
            className="h-4 w-4 accent-[var(--accent)]"
          />
        </label>
      </section>

      <section className="px-3 py-3">
        <button
          type="button"
          onClick={onClearPosition}
          className="w-full rounded-xl border border-line px-3 py-2 text-sm text-fg-muted transition hover:bg-white/5 hover:text-fg"
        >
          Forget reading position for this book
        </button>
      </section>

      <section className="px-3 py-2 text-[11px] leading-relaxed text-fg-muted">
        <p className="mb-1 text-xs tracking-widest uppercase">Shortcuts</p>
        <p>← → Space turn pages · Home / End jump · + − 0 zoom</p>
        <p>B bookmark · L single/book layout · D dark mode · F fullscreen</p>
        <p>/ search · Esc close</p>
      </section>
    </Panel>
  );
}
