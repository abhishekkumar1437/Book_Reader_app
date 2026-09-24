"use client";

import { useRef, useState, type ComponentPropsWithoutRef } from "react";
import { Check } from "@/components/ui/icons";

/** Wraps a fenced code block with a copy button. Highlighting is already applied server-side. */
export function CodeBlock(props: ComponentPropsWithoutRef<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = ref.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="codeblock">
      <button type="button" onClick={copy} className="codeblock__copy" aria-label="Copy code">
        {copied ? (
          <>
            <Check size={13} /> Copied
          </>
        ) : (
          "Copy"
        )}
      </button>
      <pre ref={ref} {...props} />
    </div>
  );
}
