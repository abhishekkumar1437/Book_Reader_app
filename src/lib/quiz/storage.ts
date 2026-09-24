/**
 * Quiz attempt persistence (history + a resumable in-progress attempt), stored in
 * localStorage like the reader state. Small interface so it can move to a server later.
 */

export interface QuizAttempt {
  id: string;
  setId: string;
  startedAt: string;
  finishedAt: string;
  /** Seconds between start and submit. */
  durationSec: number;
  /** Question order used (indexes into the set's questions). */
  order: number[];
  /** Chosen option index per question, aligned with `order`; null = unanswered. */
  answers: (number | null)[];
  flagged: number[];
  score: number;
  total: number;
}

export interface InProgressAttempt {
  setId: string;
  startedAt: string;
  order: number[];
  answers: (number | null)[];
  flagged: number[];
  current: number;
  /** Seconds allowed, or null when untimed. */
  timeLimitSec: number | null;
}

export interface QuizStore {
  getAttempts(setId: string): QuizAttempt[];
  addAttempt(attempt: QuizAttempt): void;
  getInProgress(setId: string): InProgressAttempt | null;
  setInProgress(setId: string, state: InProgressAttempt | null): void;
}

const PREFIX = "book-reader:quiz:";
const MAX_HISTORY = 50;

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    if (value === null) window.localStorage.removeItem(PREFIX + key);
    else window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export const localQuizStore: QuizStore = {
  getAttempts: (setId) => read<QuizAttempt[]>(`attempts:${setId}`) ?? [],
  addAttempt: (attempt) => {
    const list = [attempt, ...(read<QuizAttempt[]>(`attempts:${attempt.setId}`) ?? [])].slice(0, MAX_HISTORY);
    write(`attempts:${attempt.setId}`, list);
  },
  getInProgress: (setId) => read<InProgressAttempt>(`inprogress:${setId}`),
  setInProgress: (setId, state) => write(`inprogress:${setId}`, state),
};

export function bestScore(attempts: QuizAttempt[]): QuizAttempt | null {
  return attempts.reduce<QuizAttempt | null>(
    (best, a) => (best === null || a.score / a.total > best.score / best.total ? a : best),
    null,
  );
}
