/** One multiple-choice question. `answer` is the 0-based index into `options`. */
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

/** A question set, stored as one JSON file in the `quizzes/` folder. */
export interface QuizSet {
  id: string;
  title: string;
  subject: string;
  topic: string;
  description?: string;
  /** Minutes allowed for the whole set; 0 or missing means untimed. */
  timeLimitMinutes?: number;
  createdAt?: string;
  questions: QuizQuestion[];
}

/** Metadata only, for listings. */
export type QuizSummary = Omit<QuizSet, "questions"> & { questionCount: number };

export const QUESTIONS_PER_SET = 40;
