"use client";

import type { OutlineEntry } from "@/lib/pdf/pdfBook";
import { Panel, PanelEmpty } from "./Panel";

interface TocPanelProps {
  outline: OutlineEntry[];
  currentPage: number;
  onGoTo: (page: number) => void;
  onClose: () => void;
}

function TocList({
  entries,
  depth,
  currentPage,
  onGoTo,
}: {
  entries: OutlineEntry[];
  depth: number;
  currentPage: number;
  onGoTo: (page: number) => void;
}) {
  return (
    <ul>
      {entries.map((entry, i) => (
        <li key={`${depth}-${i}-${entry.title}`}>
          <button
            type="button"
            disabled={entry.page === null}
            onClick={() => entry.page !== null && onGoTo(entry.page)}
            style={{ paddingLeft: `${12 + depth * 14}px` }}
            className={`flex w-full items-baseline justify-between gap-3 rounded-lg py-1.5 pr-3 text-left transition hover:bg-white/8 disabled:opacity-50 ${
              entry.page === currentPage || entry.page === currentPage + 1 ? "bg-white/5" : ""
            }`}
          >
            <span
              className={`line-clamp-2 text-sm ${depth === 0 ? "font-serif text-fg" : "text-fg-muted"}`}
            >
              {entry.title}
            </span>
            {entry.page !== null && (
              <span className="shrink-0 font-mono text-[11px] text-fg-muted tabular-nums">
                {entry.page}
              </span>
            )}
          </button>
          {entry.children.length > 0 && (
            <TocList
              entries={entry.children}
              depth={depth + 1}
              currentPage={currentPage}
              onGoTo={onGoTo}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

export function TocPanel({ outline, currentPage, onGoTo, onClose }: TocPanelProps) {
  return (
    <Panel title="Contents" onClose={onClose}>
      {outline.length === 0 ? (
        <PanelEmpty>This document has no table of contents.</PanelEmpty>
      ) : (
        <TocList entries={outline} depth={0} currentPage={currentPage} onGoTo={onGoTo} />
      )}
    </Panel>
  );
}
