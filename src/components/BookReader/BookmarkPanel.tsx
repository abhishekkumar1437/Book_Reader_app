"use client";

import { Bookmark, Close } from "@/components/ui/icons";
import { Panel, PanelEmpty } from "./Panel";

interface BookmarkPanelProps {
  bookmarks: number[];
  currentPage: number;
  onGoTo: (page: number) => void;
  onRemove: (page: number) => void;
  onAddCurrent: () => void;
  onClose: () => void;
}

export function BookmarkPanel({
  bookmarks,
  currentPage,
  onGoTo,
  onRemove,
  onAddCurrent,
  onClose,
}: BookmarkPanelProps) {
  const hasCurrent = bookmarks.includes(currentPage);
  return (
    <Panel
      title="Bookmarks"
      onClose={onClose}
      header={
        <button
          type="button"
          onClick={onAddCurrent}
          disabled={hasCurrent}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white/5 py-2 text-sm text-fg transition hover:bg-white/10 disabled:opacity-40"
        >
          <Bookmark size={16} />
          {hasCurrent ? `Page ${currentPage} is bookmarked` : `Bookmark page ${currentPage}`}
        </button>
      }
    >
      {bookmarks.length === 0 ? (
        <PanelEmpty>No bookmarks yet. Press B while reading to mark a page.</PanelEmpty>
      ) : (
        <ul>
          {bookmarks.map((page) => (
            <li key={page} className="group flex items-center">
              <button
                type="button"
                onClick={() => onGoTo(page)}
                className={`flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-white/8 ${
                  page === currentPage || page === currentPage + 1 ? "bg-white/5" : ""
                }`}
              >
                <Bookmark size={16} filled className="text-accent" />
                <span className="font-serif text-sm">Page {page}</span>
              </button>
              <button
                type="button"
                onClick={() => onRemove(page)}
                className="icon-btn h-8 w-8 opacity-0 transition group-hover:opacity-100 focus:opacity-100"
                aria-label={`Remove bookmark for page ${page}`}
              >
                <Close size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
