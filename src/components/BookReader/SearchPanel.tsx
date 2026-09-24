"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Search } from "@/components/ui/icons";
import type { PdfBook } from "@/lib/pdf/pdfBook";
import { Panel, PanelEmpty } from "./Panel";

interface SearchHit {
  page: number;
  count: number;
  /** Text around the first match, split so the match can be highlighted. */
  before: string;
  match: string;
  after: string;
}

interface SearchPanelProps {
  book: PdfBook;
  currentPage: number;
  onGoTo: (page: number) => void;
  onClose: () => void;
}

const SNIPPET_RADIUS = 48;
const CONCURRENCY = 4;

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function SearchPanel({ book, currentPage, onGoTo, onClose }: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [status, setStatus] = useState<"idle" | "searching" | "done">("idle");
  const [scanned, setScanned] = useState(0);
  const generation = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const gen = generation;
    return () => {
      // Cancels any search still running when the panel closes.
      gen.current++;
    };
  }, []);

  const run = async (e: FormEvent) => {
    e.preventDefault();
    const term = query.trim();
    const gen = ++generation.current;
    setHits([]);
    setScanned(0);
    if (term.length < 2) {
      setStatus("idle");
      return;
    }
    setStatus("searching");
    const re = new RegExp(escapeRegExp(term), "gi");
    const total = book.numPages;
    let next = 1;
    let done = 0;

    const worker = async () => {
      while (next <= total && generation.current === gen) {
        const page = next++;
        let text = "";
        try {
          text = await book.getPageText(page);
        } catch {
          text = "";
        }
        if (generation.current !== gen) return;
        re.lastIndex = 0;
        const first = re.exec(text);
        if (first) {
          const count = (text.match(re) ?? []).length;
          const start = Math.max(0, first.index - SNIPPET_RADIUS);
          const end = Math.min(text.length, first.index + first[0].length + SNIPPET_RADIUS);
          const hit: SearchHit = {
            page,
            count,
            before: (start > 0 ? "…" : "") + text.slice(start, first.index).replace(/\s+/g, " "),
            match: first[0],
            after:
              text.slice(first.index + first[0].length, end).replace(/\s+/g, " ") +
              (end < text.length ? "…" : ""),
          };
          setHits((prev) => [...prev, hit].sort((a, b) => a.page - b.page));
        }
        done++;
        setScanned(done);
      }
    };

    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    if (generation.current === gen) setStatus("done");
  };

  const totalMatches = hits.reduce((sum, h) => sum + h.count, 0);

  return (
    <Panel
      title="Search"
      onClose={onClose}
      header={
        <form onSubmit={run} className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fg-muted"
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in this book…"
            className="w-full rounded-xl border border-line bg-black/30 py-2 pr-3 pl-9 text-sm text-fg outline-none placeholder:text-fg-muted/70 focus:border-accent"
            aria-label="Search text"
          />
        </form>
      }
    >
      {status === "idle" && <PanelEmpty>Type a word or phrase and press Enter.</PanelEmpty>}

      {status !== "idle" && (
        <p className="px-3 pb-2 text-xs text-fg-muted">
          {status === "searching"
            ? `Searching… ${scanned} / ${book.numPages} pages`
            : totalMatches === 0
              ? "No results"
              : `${totalMatches} result${totalMatches === 1 ? "" : "s"} on ${hits.length} page${hits.length === 1 ? "" : "s"}`}
        </p>
      )}

      <ul>
        {hits.map((hit) => (
          <li key={hit.page}>
            <button
              type="button"
              onClick={() => onGoTo(hit.page)}
              className={`w-full rounded-lg px-3 py-2 text-left transition hover:bg-white/8 ${
                hit.page === currentPage || hit.page === currentPage + 1 ? "bg-white/5" : ""
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-sm text-accent">Page {hit.page}</span>
                {hit.count > 1 && <span className="text-[11px] text-fg-muted">{hit.count}×</span>}
              </div>
              <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-fg-muted">
                {hit.before}
                <mark className="rounded-sm bg-accent/30 px-0.5 text-fg">{hit.match}</mark>
                {hit.after}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
