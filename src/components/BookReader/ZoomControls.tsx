"use client";

import { Fit, ZoomIn, ZoomOut } from "@/components/ui/icons";

interface ZoomControlsProps {
  zoom: number;
  min: number;
  max: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
}

export function ZoomControls({ zoom, min, max, onZoomIn, onZoomOut, onFit }: ZoomControlsProps) {
  return (
    <div className="flex items-center">
      <button
        type="button"
        className="icon-btn"
        onClick={onZoomOut}
        disabled={zoom <= min + 0.001}
        aria-label="Zoom out"
        title="Zoom out (-)"
      >
        <ZoomOut size={18} />
      </button>
      <button
        type="button"
        className="min-w-12 rounded-md px-1 py-1 text-center font-mono text-xs text-fg-muted tabular-nums hover:bg-white/10 hover:text-fg"
        onClick={onFit}
        title="Fit to screen (0)"
      >
        {Math.round(zoom * 100)}%
      </button>
      <button
        type="button"
        className="icon-btn"
        onClick={onZoomIn}
        disabled={zoom >= max - 0.001}
        aria-label="Zoom in"
        title="Zoom in (+)"
      >
        <ZoomIn size={18} />
      </button>
      <button
        type="button"
        className={`icon-btn hidden sm:inline-flex ${Math.abs(zoom - 1) < 0.001 ? "is-active" : ""}`}
        onClick={onFit}
        aria-label="Fit to screen"
        title="Fit to screen (0)"
      >
        <Fit size={18} />
      </button>
    </div>
  );
}
