"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Alert } from "@/components/ui/icons";
import { PageCache } from "@/lib/pdf/pageCache";
import { PdfBook, PdfLoadError, type OutlineEntry } from "@/lib/pdf/pdfBook";
import { localReaderStore, type ReaderLayout, type ReaderSettings } from "@/lib/storage/readerState";
import { BookmarkPanel } from "./BookmarkPanel";
import { FlipBook, type FlipBookHandle, type FlipState } from "./FlipBook";
import { PageNavigation } from "./PageNavigation";
import { ReaderToolbar, type PanelKind } from "./ReaderToolbar";
import { SearchPanel } from "./SearchPanel";
import { SettingsPanel } from "./SettingsPanel";
import { TocPanel } from "./TocPanel";
import { ZoomControls } from "./ZoomControls";
import { useAutoHide, useDebounced, useElementSize, useFullscreen } from "./hooks";

interface BookReaderProps {
  id: string;
  name: string;
  fileUrl: string;
  downloadUrl: string;
}

interface Layout {
  pageWidth: number;
  pageHeight: number;
  portrait: boolean;
}

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 4;
const ZOOM_STEP = 1.25;
const CHROME_HIDE_DELAY = 3000;
const PORTRAIT_BREAKPOINT = 700;

const store = localReaderStore;

function clampZoom(z: number): number {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
}

function computeLayout(
  width: number,
  height: number,
  aspect: number,
  mode: ReaderLayout,
): Layout | null {
  if (width < 50 || height < 50) return null;
  const portrait =
    mode === "single" || (mode === "auto" && width < PORTRAIT_BREAKPOINT);
  const padX = portrait ? 12 : Math.max(28, width * 0.04);
  const padTop = portrait ? 56 : 72;
  const padBottom = portrait ? 72 : 96;
  const availW = Math.max(100, width - padX * 2);
  const availH = Math.max(100, height - padTop - padBottom);
  const columns = portrait ? 1 : 2;
  const pageWidth = Math.floor(Math.min(availW / columns, availH * aspect));
  const pageHeight = Math.floor(pageWidth / aspect);
  return { pageWidth, pageHeight, portrait };
}

export function BookReader({ id, name, fileUrl, downloadUrl }: BookReaderProps) {
  const [book, setBook] = useState<PdfBook | null>(null);
  const [cache, setCache] = useState<PageCache | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [outline, setOutline] = useState<OutlineEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [flipState, setFlipState] = useState<FlipState>("read");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoomAnimated, setZoomAnimated] = useState(true);
  const [settings, setSettings] = useState<ReaderSettings>(() => store.getSettings());
  const [bookmarks, setBookmarks] = useState<number[]>(() => store.getBookmarks(id));
  const [activePanel, setActivePanel] = useState<PanelKind | null>(null);
  const [hoveringChrome, setHoveringChrome] = useState(false);
  const [toast, setToast] = useState<{ text: string; action?: { label: string; run: () => void } } | null>(null);

  const readerRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<FlipBookHandle>(null);
  const [stageRef, stageSize] = useElementSize<HTMLDivElement>();
  const stableStage = useDebounced(stageSize, 150);
  const { active: isFullscreen, toggle: toggleFullscreen } = useFullscreen(readerRef);

  const chrome = useAutoHide(CHROME_HIDE_DELAY, activePanel !== null || hoveringChrome);
  const pokeChrome = chrome.poke;

  const numPages = book?.numPages ?? 0;
  const layout = useMemo(
    () =>
      book
        ? computeLayout(stableStage.width, stableStage.height, book.pageAspect, settings.layout)
        : null,
    [book, stableStage.width, stableStage.height, settings.layout],
  );
  const portrait = layout?.portrait ?? false;

  // ----- document lifecycle -----
  useEffect(() => {
    let disposed = false;
    let loaded: PdfBook | null = null;
    let pageCache: PageCache | null = null;

    PdfBook.load(fileUrl)
      .then(async (pdf) => {
        if (disposed) {
          pdf.destroy();
          return;
        }
        loaded = pdf;
        pageCache = new PageCache(pdf);
        const saved = store.getPosition(id);
        const startPage = saved ? Math.min(Math.max(saved.lastPage, 1), pdf.numPages) : 1;
        setCurrentPage(startPage);
        setZoom(saved?.zoom && saved.zoom > 0 ? clampZoom(saved.zoom) : 1);
        setCache(pageCache);
        setBook(pdf);
        if (saved && startPage > 1) {
          setToast({
            text: `Continuing from page ${startPage}`,
            action: {
              label: "Start over",
              run: () => {
                flipRef.current?.jumpTo(1);
                setToast(null);
              },
            },
          });
        }
        pdf.getOutline().then((o) => !disposed && setOutline(o)).catch(() => {});
      })
      .catch((err: unknown) => {
        if (disposed) return;
        setLoadError(err instanceof PdfLoadError ? err.message : "The document could not be opened");
      });

    return () => {
      disposed = true;
      pageCache?.dispose();
      loaded?.destroy();
    };
  }, [fileUrl, id]);

  // ----- rendering window -----
  const debouncedZoom = useDebounced(zoom, 200);
  useEffect(() => {
    if (!cache || !layout) return;
    // Oversample at least 2x so small text stays sharp on 1x displays, and follow zoom.
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const oversample = Math.max(2, dpr);
    cache.setViewport(currentPage, layout.pageWidth * oversample * Math.max(1, debouncedZoom));
  }, [cache, layout, currentPage, debouncedZoom]);

  // ----- persistence -----
  useEffect(() => {
    if (!book) return;
    const save = () => store.savePosition(id, { lastPage: currentPage, zoom });
    const t = window.setTimeout(save, 400);
    window.addEventListener("pagehide", save);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("pagehide", save);
    };
  }, [book, id, currentPage, zoom]);

  useEffect(() => {
    store.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    store.setBookmarks(id, bookmarks);
  }, [id, bookmarks]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(t);
  }, [toast]);

  // ----- navigation -----
  const canPrev = currentPage > 1;
  const canNext = portrait
    ? currentPage < numPages
    : currentPage + (currentPage === 1 ? 0 : 1) < numPages;

  const goNext = useCallback(() => flipRef.current?.next(), []);
  const goPrev = useCallback(() => flipRef.current?.prev(), []);
  const goTo = useCallback((page: number) => flipRef.current?.goTo(page), []);

  const onFlip = useCallback((page: number) => setCurrentPage(page), []);

  const spreadLabel = useMemo(() => {
    if (!numPages) return "";
    if (portrait || currentPage === 1 || currentPage + 1 > numPages) return `Page ${currentPage}`;
    return `Pages ${currentPage}–${currentPage + 1}`;
  }, [portrait, currentPage, numPages]);

  // ----- bookmarks -----
  const bookmarked = bookmarks.includes(currentPage);
  const toggleBookmark = useCallback(() => {
    setBookmarks((prev) =>
      prev.includes(currentPage) ? prev.filter((p) => p !== currentPage) : [...prev, currentPage].sort((a, b) => a - b),
    );
  }, [currentPage]);

  // ----- zoom -----
  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);
  useLayoutEffect(() => {
    zoomRef.current = zoom;
    panRef.current = pan;
  }, [zoom, pan]);

  const applyZoom = useCallback((next: number, animated: boolean) => {
    const target = clampZoom(next);
    setZoomAnimated(animated);
    if (target <= 1) setPan({ x: 0, y: 0 });
    setZoom(target);
  }, []);
  const zoomIn = useCallback(() => applyZoom(zoomRef.current * ZOOM_STEP, true), [applyZoom]);
  const zoomOut = useCallback(() => applyZoom(zoomRef.current / ZOOM_STEP, true), [applyZoom]);
  const zoomFit = useCallback(() => applyZoom(1, true), [applyZoom]);

  const toggleTheme = useCallback(
    () => setSettings((s) => ({ ...s, theme: s.theme === "night" ? "paper" : "night" })),
    [],
  );
  // Quick switch between one page and the book spread; the settings panel exposes all three modes.
  const toggleLayout = useCallback(
    () => setSettings((s) => ({ ...s, layout: s.layout === "single" ? "auto" : "single" })),
    [],
  );

  // ----- keyboard -----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        if (e.key === "Escape") {
          (target as HTMLInputElement).blur();
          setActivePanel(null);
        }
        return;
      }
      pokeChrome();
      switch (e.key) {
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          goPrev();
          break;
        case "ArrowRight":
        case "PageDown":
        case " ":
          e.preventDefault();
          goNext();
          break;
        case "Home":
          e.preventDefault();
          flipRef.current?.jumpTo(1);
          break;
        case "End":
          e.preventDefault();
          flipRef.current?.jumpTo(numPages);
          break;
        case "+":
        case "=":
          zoomIn();
          break;
        case "-":
        case "_":
          zoomOut();
          break;
        case "0":
          zoomFit();
          break;
        case "f":
        case "F":
          void toggleFullscreen();
          break;
        case "b":
        case "B":
          toggleBookmark();
          break;
        case "d":
        case "D":
          toggleTheme();
          break;
        case "l":
        case "L":
          toggleLayout();
          break;
        case "/":
          e.preventDefault();
          setActivePanel("search");
          break;
        case "Escape":
          if (activePanel) setActivePanel(null);
          else if (zoom !== 1) zoomFit();
          break;
        default:
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
            e.preventDefault();
            setActivePanel("search");
          }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activePanel, goNext, goPrev, numPages, pokeChrome, toggleBookmark, toggleFullscreen, toggleLayout, toggleTheme, zoom, zoomFit, zoomIn, zoomOut]);

  // ----- wheel zoom + pinch (native listeners so preventDefault works) -----
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const zoomAt = (clientX: number, clientY: number, nextZoom: number) => {
      const rect = stage.getBoundingClientRect();
      const px = clientX - (rect.left + rect.width / 2);
      const py = clientY - (rect.top + rect.height / 2);
      const z0 = zoomRef.current;
      const z1 = clampZoom(nextZoom);
      const p0 = panRef.current;
      const next = z1 <= 1 ? { x: 0, y: 0 } : { x: px - ((px - p0.x) * z1) / z0, y: py - ((py - p0.y) * z1) / z0 };
      setZoomAnimated(false);
      setZoom(z1);
      setPan(next);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.0015);
      zoomAt(e.clientX, e.clientY, zoomRef.current * factor);
    };

    let pinch: { dist: number; zoom: number; mid: { x: number; y: number }; pan: { x: number; y: number } } | null = null;
    const touchInfo = (t: TouchList) => {
      const dx = t[0].clientX - t[1].clientX;
      const dy = t[0].clientY - t[1].clientY;
      return { dist: Math.hypot(dx, dy), mid: { x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 } };
    };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        const { dist, mid } = touchInfo(e.touches);
        pinch = { dist, zoom: zoomRef.current, mid, pan: panRef.current };
        e.stopPropagation();
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!pinch || e.touches.length < 2) return;
      e.preventDefault();
      e.stopPropagation();
      const { dist, mid } = touchInfo(e.touches);
      const rect = stage.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const z1 = clampZoom((pinch.zoom * dist) / pinch.dist);
      const m0 = { x: pinch.mid.x - cx, y: pinch.mid.y - cy };
      const m1 = { x: mid.x - cx, y: mid.y - cy };
      const next =
        z1 <= 1
          ? { x: 0, y: 0 }
          : { x: m1.x - ((m0.x - pinch.pan.x) * z1) / pinch.zoom, y: m1.y - ((m0.y - pinch.pan.y) * z1) / pinch.zoom };
      setZoomAnimated(false);
      setZoom(z1);
      setPan(next);
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (pinch && e.touches.length < 2) {
        pinch = null;
        e.stopPropagation();
      }
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("touchstart", onTouchStart, { capture: true, passive: true });
    stage.addEventListener("touchmove", onTouchMove, { capture: true, passive: false });
    stage.addEventListener("touchend", onTouchEnd, { capture: true });
    stage.addEventListener("touchcancel", onTouchEnd, { capture: true });
    return () => {
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("touchstart", onTouchStart, { capture: true });
      stage.removeEventListener("touchmove", onTouchMove, { capture: true });
      stage.removeEventListener("touchend", onTouchEnd, { capture: true });
      stage.removeEventListener("touchcancel", onTouchEnd, { capture: true });
    };
  }, [stageRef]);

  // ----- panning while zoomed -----
  const dragRef = useRef<{ id: number; x: number; y: number; pan: { x: number; y: number }; moved: boolean } | null>(null);
  const onPanStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    dragRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY, pan: panRef.current, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPanMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
    setZoomAnimated(false);
    setPan({ x: d.pan.x + dx, y: d.pan.y + dy });
  };
  const onPanEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    dragRef.current = null;
    if (d.moved) return;
    // A plain click (no drag) while zoomed turns the page, just like clicking the book
    // at normal size: left half goes back, right half goes forward.
    const shell = stageRef.current?.querySelector<HTMLElement>(".book-shell");
    const rect = shell?.getBoundingClientRect();
    const center = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    if (e.clientX < center) goPrev();
    else goNext();
  };

  // Clicks on the dark margins turn pages.
  const onStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.clientX < rect.left + rect.width / 2) goPrev();
    else goNext();
  };

  // ----- render -----
  const flipKey = layout ? `${layout.pageWidth}x${layout.pageHeight}:${layout.portrait ? "p" : "l"}:${settings.flipDuration}` : "none";
  const shellWidth = layout ? (layout.portrait ? layout.pageWidth : layout.pageWidth * 2) : 0;

  const closePanel = useCallback(() => setActivePanel(null), []);
  const togglePanel = useCallback((kind: PanelKind) => setActivePanel((p) => (p === kind ? null : kind)), []);
  const goToFromPanel = useCallback(
    (page: number) => {
      goTo(page);
      if (portrait) setActivePanel(null);
    },
    [goTo, portrait],
  );

  return (
    <div
      ref={readerRef}
      className={`reader ${chrome.visible ? "" : "is-idle"}`}
      data-theme={settings.theme}
      onPointerMove={pokeChrome}
      onPointerDown={pokeChrome}
      tabIndex={-1}
    >
      <div
        ref={stageRef}
        className="book-stage"
        onClick={onStageClick}
        style={{ cursor: flipState === "flipping" ? "default" : undefined }}
      >
        {book && layout && cache && (
          <div
            className={`book-zoom ${zoomAnimated ? "is-animated" : ""}`}
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
          >
            <div className="book-perspective">
              <div
                className={[
                  "book-shell",
                  layout.portrait ? "is-portrait" : "",
                  // The cover sits alone on the right; an even-numbered last page sits alone on the left.
                  !layout.portrait && currentPage === 1 ? "is-single-right" : "",
                  !layout.portrait && numPages % 2 === 0 && currentPage === numPages ? "is-single-left" : "",
                ].join(" ")}
                style={{ width: shellWidth, height: layout.pageHeight }}
              >
                {!layout.portrait && <div className="book-spine" />}
                {!layout.portrait && <div className="book-edge is-left" />}
                <div className="book-edge is-right" />
                <div className="book-edge is-bottom" />
                <FlipBook
                  key={flipKey}
                  ref={flipRef}
                  numPages={numPages}
                  pageWidth={layout.pageWidth}
                  pageHeight={layout.pageHeight}
                  portrait={layout.portrait}
                  startPage={currentPage}
                  flipDuration={settings.flipDuration}
                  cache={cache}
                  showNumbers={settings.showPageNumbers}
                  onFlip={onFlip}
                  onStateChange={setFlipState}
                />
              </div>
            </div>
          </div>
        )}

        {zoom > 1.001 && (
          <div
            className="absolute inset-0 z-[1500] cursor-grab active:cursor-grabbing"
            onPointerDown={onPanStart}
            onPointerMove={onPanMove}
            onPointerUp={onPanEnd}
            onPointerCancel={onPanEnd}
            onClick={(e) => e.stopPropagation()}
            aria-hidden
          />
        )}

        {!book && !loadError && (
          <div className="flex flex-col items-center gap-4 text-fg-muted">
            <div className="spinner" />
            <p className="font-serif text-sm tracking-wide">Opening book…</p>
          </div>
        )}

        {loadError && (
          <div className="glass max-w-sm rounded-2xl p-6 text-center">
            <Alert className="mx-auto mb-3 text-accent" size={28} />
            <p className="font-serif text-lg">Couldn&apos;t open this document</p>
            <p className="mt-2 text-sm text-fg-muted">{loadError}</p>
            <div className="mt-5 flex justify-center gap-3 text-sm">
              <button
                type="button"
                className="rounded-xl border border-line px-4 py-2 hover:bg-white/5"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
              <Link href="/" className="rounded-xl bg-accent px-4 py-2 text-ink hover:bg-accent-2">
                Back to library
              </Link>
            </div>
          </div>
        )}
      </div>

      <ReaderToolbar
        title={name}
        visible={chrome.visible}
        activePanel={activePanel}
        onTogglePanel={togglePanel}
        hasToc={outline.length > 0}
        bookmarked={bookmarked}
        onToggleBookmark={toggleBookmark}
        theme={settings.theme}
        onToggleTheme={toggleTheme}
        singlePage={portrait}
        onToggleLayout={toggleLayout}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => void toggleFullscreen()}
        downloadUrl={downloadUrl}
        onPointerEnter={() => setHoveringChrome(true)}
        onPointerLeave={() => setHoveringChrome(false)}
      />

      {book && (
        <PageNavigation
          visible={chrome.visible}
          currentPage={currentPage}
          numPages={numPages}
          spreadLabel={spreadLabel}
          canPrev={canPrev}
          canNext={canNext}
          onPrev={goPrev}
          onNext={goNext}
          onGoTo={goTo}
          onPointerEnter={() => setHoveringChrome(true)}
          onPointerLeave={() => setHoveringChrome(false)}
        >
          <ZoomControls
            zoom={zoom}
            min={ZOOM_MIN}
            max={ZOOM_MAX}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onFit={zoomFit}
          />
        </PageNavigation>
      )}

      {book && activePanel === "search" && (
        <SearchPanel book={book} currentPage={currentPage} onGoTo={goToFromPanel} onClose={closePanel} />
      )}
      {activePanel === "bookmarks" && (
        <BookmarkPanel
          bookmarks={bookmarks}
          currentPage={currentPage}
          onGoTo={goToFromPanel}
          onRemove={(page) => setBookmarks((prev) => prev.filter((p) => p !== page))}
          onAddCurrent={toggleBookmark}
          onClose={closePanel}
        />
      )}
      {activePanel === "toc" && (
        <TocPanel outline={outline} currentPage={currentPage} onGoTo={goToFromPanel} onClose={closePanel} />
      )}
      {activePanel === "settings" && (
        <SettingsPanel
          settings={settings}
          onChange={setSettings}
          onClearPosition={() => {
            store.clearPosition(id);
            flipRef.current?.jumpTo(1);
            setActivePanel(null);
            setToast({ text: "Reading position cleared" });
          }}
          onClose={closePanel}
        />
      )}

      {toast && (
        <div className="toast glass absolute bottom-24 left-1/2 z-[2200] flex -translate-x-1/2 items-center gap-3 rounded-full px-4 py-2 text-sm whitespace-nowrap">
          <span>{toast.text}</span>
          {toast.action && (
            <button type="button" className="font-medium text-accent hover:underline" onClick={toast.action.run}>
              {toast.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
