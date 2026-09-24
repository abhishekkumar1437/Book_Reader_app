"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  Download,
  ExitFullscreen,
  Fullscreen,
  List,
  Moon,
  Quiz,
  Search,
  Settings,
  SinglePage,
  Sun,
} from "@/components/ui/icons";
import type { ReaderTheme } from "@/lib/storage/readerState";

export type PanelKind = "search" | "bookmarks" | "toc" | "settings";

interface ReaderToolbarProps {
  title: string;
  visible: boolean;
  activePanel: PanelKind | null;
  onTogglePanel: (kind: PanelKind) => void;
  hasToc: boolean;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  theme: ReaderTheme;
  onToggleTheme: () => void;
  /** True when the reader is currently showing one page at a time. */
  singlePage: boolean;
  onToggleLayout: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  downloadUrl: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export function ReaderToolbar({
  title,
  visible,
  activePanel,
  onTogglePanel,
  hasToc,
  bookmarked,
  onToggleBookmark,
  theme,
  onToggleTheme,
  singlePage,
  onToggleLayout,
  isFullscreen,
  onToggleFullscreen,
  downloadUrl,
  onPointerEnter,
  onPointerLeave,
}: ReaderToolbarProps) {
  const panelButton = (kind: PanelKind, label: string, icon: React.ReactNode) => (
    <button
      type="button"
      className={`icon-btn ${activePanel === kind ? "is-active" : ""}`}
      onClick={() => onTogglePanel(kind)}
      aria-label={label}
      aria-pressed={activePanel === kind}
      title={label}
    >
      {icon}
    </button>
  );

  return (
    <header
      className={`chrome is-top ${visible ? "" : "is-hidden"}`}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <div className="glass mx-auto mt-2 flex w-[calc(100%-16px)] max-w-6xl items-center gap-1 rounded-2xl px-2 py-1">
        <Link href="/" className="icon-btn shrink-0" aria-label="Back to library" title="Library">
          <ArrowLeft />
        </Link>
        <h1 className="min-w-0 flex-1 truncate px-1 font-serif text-[15px] tracking-wide text-fg">
          {title}
        </h1>
        <div className="flex shrink-0 items-center">
          {hasToc && panelButton("toc", "Contents", <List />)}
          {panelButton("search", "Search", <Search />)}
          <button
            type="button"
            className={`icon-btn ${bookmarked ? "is-active" : ""}`}
            onClick={onToggleBookmark}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark this page"}
            title="Bookmark (B)"
          >
            <Bookmark filled={bookmarked} />
          </button>
          {panelButton("bookmarks", "Bookmarks", <Bookmark size={18} />)}
          <button
            type="button"
            className={`icon-btn ${singlePage ? "is-active" : ""}`}
            onClick={onToggleLayout}
            aria-label={singlePage ? "Switch to two-page book view" : "Switch to single page view"}
            aria-pressed={singlePage}
            title={singlePage ? "Two-page book view (L)" : "Single page view (L)"}
          >
            {singlePage ? <BookOpen /> : <SinglePage />}
          </button>
          <button
            type="button"
            className="icon-btn hidden sm:inline-flex"
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
            title="Dark mode (D)"
          >
            {theme === "night" ? <Sun /> : <Moon />}
          </button>
          <button
            type="button"
            className="icon-btn hidden sm:inline-flex"
            onClick={onToggleFullscreen}
            aria-label="Fullscreen"
            title="Fullscreen (F)"
          >
            {isFullscreen ? <ExitFullscreen /> : <Fullscreen />}
          </button>
          <a
            className="icon-btn hidden sm:inline-flex"
            href={downloadUrl}
            download
            aria-label="Download PDF"
            title="Download"
          >
            <Download />
          </a>
          <Link href="/quiz" className="icon-btn hidden sm:inline-flex" aria-label="Quiz" title="Quiz">
            <Quiz />
          </Link>
          {panelButton("settings", "Settings", <Settings />)}
        </div>
      </div>
    </header>
  );
}
