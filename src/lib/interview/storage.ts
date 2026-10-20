/** Reading progress for the interview-prep shelf. See `@/lib/reading/storage` for the shape. */
import { createReadingStore } from "@/lib/reading/storage";

export { chapterKey, type ProseSize } from "@/lib/reading/storage";

const PREFIX = "book-reader:interview:";

/** Books that moved into a collection folder: old slug → new slug. Progress saved under the old slug is carried over once. */
const MOVED_BOOKS: Record<string, string> = Object.fromEntries(
  [
    "ai-roadmap",
    "math-for-ml",
    "machine-learning",
    "deep-learning",
    "nlp-transformers",
    "llms-genai",
    "mlops-deployment",
    "ai-system-design",
    "ai-projects",
    "ai-glossary",
  ].map((slug) => [slug, `ai-engineer/${slug}`]),
);
const MIGRATION_FLAG = `${PREFIX}migrated:ai-engineer`;

/** Rewrites "book/rest" keys whose book moved; returns null when the key is not affected. */
function movedKey(key: string): string | null {
  const slash = key.indexOf("/");
  const book = slash === -1 ? key : key.slice(0, slash);
  const target = MOVED_BOOKS[book];
  return target ? target + (slash === -1 ? "" : key.slice(slash)) : null;
}

function migrateMovedBooks(): void {
  if (typeof window === "undefined") return;
  try {
    const ls = window.localStorage;
    if (ls.getItem(MIGRATION_FLAG)) return;
    const doneRaw = ls.getItem(`${PREFIX}done`);
    if (doneRaw) {
      const done = JSON.parse(doneRaw) as string[];
      ls.setItem(`${PREFIX}done`, JSON.stringify([...new Set(done.map((k) => movedKey(k) ?? k))]));
    }
    // Per-book and per-chapter keys: last:<book>, scroll:<book>/<slug>, hl:<book>/<slug>.
    const keys = Array.from({ length: ls.length }, (_, i) => ls.key(i)).filter((k): k is string => k !== null);
    for (const key of keys) {
      const m = /^(last|scroll|hl):(.+)$/.exec(key.startsWith(PREFIX) ? key.slice(PREFIX.length) : "");
      if (!m) continue;
      const target = movedKey(m[2]);
      if (!target) continue;
      const newKey = `${PREFIX}${m[1]}:${target}`;
      const value = ls.getItem(key);
      if (value !== null && ls.getItem(newKey) === null) ls.setItem(newKey, value);
      ls.removeItem(key);
    }
    ls.setItem(MIGRATION_FLAG, "1");
  } catch {
    /* storage unavailable: nothing to migrate */
  }
}

migrateMovedBooks();

export const interviewStore = createReadingStore(PREFIX);
