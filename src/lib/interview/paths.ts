/** URL for a shelf path under /interview. Book slugs may contain "/" (books inside a collection), so each segment is encoded separately. */
export function interviewHref(...parts: string[]): string {
  const segments = parts.flatMap((p) => p.split("/")).filter(Boolean).map(encodeURIComponent);
  return segments.length ? `/interview/${segments.join("/")}` : "/interview";
}
