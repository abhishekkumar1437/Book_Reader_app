"use client";

import dynamic from "next/dynamic";

// The flip engine and PDF.js only work in the browser, so the reader is client-only.
const BookReader = dynamic(() => import("./BookReader").then((m) => m.BookReader), {
  ssr: false,
  loading: () => (
    <div className="reader grid place-items-center">
      <div className="spinner" />
    </div>
  ),
});

interface ReaderShellProps {
  id: string;
  name: string;
  fileUrl: string;
  downloadUrl: string;
}

export function ReaderShell(props: ReaderShellProps) {
  return <BookReader {...props} />;
}
