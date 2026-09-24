"use client";

import type { ReactNode } from "react";
import { Close } from "@/components/ui/icons";

interface PanelProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  header?: ReactNode;
}

/** Floating side sheet used by search, bookmarks, contents and settings. */
export function Panel({ title, onClose, children, header }: PanelProps) {
  return (
    <aside className="panel glass" role="dialog" aria-label={title}>
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <h2 className="font-serif text-base tracking-wide text-fg">{title}</h2>
        <button type="button" className="icon-btn -mr-2" onClick={onClose} aria-label="Close">
          <Close size={18} />
        </button>
      </div>
      {header && <div className="px-4 pb-3">{header}</div>}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">{children}</div>
    </aside>
  );
}

export function PanelEmpty({ children }: { children: ReactNode }) {
  return <p className="px-3 py-8 text-center text-sm text-fg-muted">{children}</p>;
}
