"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";
import { Alert, Check, Upload } from "@/components/ui/icons";
import type { BookInfo, LibraryProvider } from "@/lib/library/types";
import { MAX_UPLOAD_BYTES } from "@/lib/library/types";

interface DocumentUploaderProps {
  library: LibraryProvider;
  onUploaded: (book: BookInfo) => void;
}

type Status =
  | { kind: "idle" }
  | { kind: "uploading"; name: string; progress: number }
  | { kind: "success"; name: string }
  | { kind: "error"; message: string };

function validate(file: File): string | null {
  const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
  if (!isPdf) {
    if (/\.docx?$/i.test(file.name)) {
      return "Word documents need a conversion service, which is not set up in this local build. Please export it as PDF first.";
    }
    return "Only PDF files are supported.";
  }
  if (file.size === 0) return "That file is empty.";
  if (file.size > MAX_UPLOAD_BYTES) return "Files must be 200 MB or smaller.";
  return null;
}

export function DocumentUploader({ library, onUploaded }: DocumentUploaderProps) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);

  const upload = useCallback(
    async (file: File) => {
      const problem = validate(file);
      if (problem) {
        setStatus({ kind: "error", message: problem });
        return;
      }
      setStatus({ kind: "uploading", name: file.name, progress: 0 });
      try {
        const book = await library.upload(file, (p) =>
          setStatus({ kind: "uploading", name: file.name, progress: p }),
        );
        setStatus({ kind: "success", name: book.fileName });
        onUploaded(book);
      } catch (err) {
        setStatus({ kind: "error", message: err instanceof Error ? err.message : "Upload failed" });
      }
    },
    [library, onUploaded],
  );

  const onFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) void upload(file);
  };

  const onDragEnter = (e: DragEvent) => {
    e.preventDefault();
    dragDepth.current++;
    setDragging(true);
  };
  const onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    dragDepth.current--;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setDragging(false);
    }
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    onFiles(e.dataTransfer.files);
  };

  const busy = status.kind === "uploading";

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a PDF"
        className={`dropzone group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl px-6 py-10 text-center transition ${dragging ? "is-active" : ""} ${busy ? "pointer-events-none opacity-70" : ""}`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={onDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            onFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <span className="grid h-12 w-12 place-items-center rounded-full bg-accent/10 text-accent transition group-hover:bg-accent/20">
          <Upload size={22} />
        </span>
        <div>
          <p className="font-serif text-lg text-fg">
            {dragging ? "Drop it to add to your library" : "Drop a PDF here"}
          </p>
          <p className="mt-1 text-sm text-fg-muted">
            or <span className="text-accent underline-offset-2 group-hover:underline">choose a file</span> · up to 200 MB
          </p>
        </div>
      </div>

      {status.kind === "uploading" && (
        <div className="mt-3 rounded-xl border border-line bg-white/5 px-4 py-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-fg">{status.name}</span>
            <span className="shrink-0 font-mono text-xs text-fg-muted">
              {Math.round(status.progress * 100)}%
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-150"
              style={{ width: `${Math.round(status.progress * 100)}%` }}
            />
          </div>
        </div>
      )}

      {status.kind === "success" && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          <Check size={16} />
          <span className="truncate">Added {status.name} to your library</span>
        </div>
      )}

      {status.kind === "error" && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          <Alert size={16} className="mt-0.5 shrink-0" />
          <span>{status.message}</span>
        </div>
      )}
    </div>
  );
}
