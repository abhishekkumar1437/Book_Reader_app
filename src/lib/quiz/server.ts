import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { QuizQuestion, QuizSet, QuizSummary } from "./types";

/** Question sets live here, one JSON file per set. The file name (without .json) is the set id. */
export const QUIZ_DIR = path.join(process.cwd(), "quizzes");

const ID_PATTERN = /^[a-z0-9][a-z0-9-_]*$/i;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Validates a parsed JSON file and returns a clean QuizSet, or an error message. */
function parseQuizSet(id: string, raw: unknown): QuizSet | string {
  if (!isRecord(raw)) return "root must be an object";
  const { title, subject, topic, description, timeLimitMinutes, createdAt, questions } = raw;
  if (typeof title !== "string" || !title.trim()) return "missing title";
  if (typeof subject !== "string" || !subject.trim()) return "missing subject";
  if (typeof topic !== "string" || !topic.trim()) return "missing topic";
  if (!Array.isArray(questions) || questions.length === 0) return "questions must be a non-empty array";

  const cleaned: QuizQuestion[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!isRecord(q)) return `question ${i + 1} must be an object`;
    const qid = typeof q.id === "string" && q.id.trim() ? q.id.trim() : `q${i + 1}`;
    if (seen.has(qid)) return `duplicate question id "${qid}"`;
    seen.add(qid);
    if (typeof q.question !== "string" || !q.question.trim()) return `question ${i + 1} has no text`;
    if (!Array.isArray(q.options) || q.options.length < 2 || !q.options.every((o) => typeof o === "string" && o.trim())) {
      return `question ${i + 1} needs at least two text options`;
    }
    if (typeof q.answer !== "number" || !Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) {
      return `question ${i + 1} has an invalid answer index`;
    }
    cleaned.push({
      id: qid,
      question: q.question.trim(),
      options: q.options.map((o) => (o as string).trim()),
      answer: q.answer,
      explanation: typeof q.explanation === "string" && q.explanation.trim() ? q.explanation.trim() : undefined,
    });
  }

  return {
    id,
    title: title.trim(),
    subject: subject.trim(),
    topic: topic.trim(),
    description: typeof description === "string" ? description.trim() : undefined,
    timeLimitMinutes:
      typeof timeLimitMinutes === "number" && timeLimitMinutes > 0 ? Math.round(timeLimitMinutes) : undefined,
    createdAt: typeof createdAt === "string" ? createdAt : undefined,
    questions: cleaned,
  };
}

async function readSet(fileName: string): Promise<QuizSet | null> {
  const id = fileName.replace(/\.json$/i, "");
  if (!ID_PATTERN.test(id)) return null;
  try {
    const text = await fs.readFile(path.join(QUIZ_DIR, fileName), "utf8");
    const parsed = parseQuizSet(id, JSON.parse(text));
    if (typeof parsed === "string") {
      console.warn(`Skipping quiz "${fileName}": ${parsed}`);
      return null;
    }
    return parsed;
  } catch (err) {
    console.warn(`Skipping quiz "${fileName}":`, err instanceof Error ? err.message : err);
    return null;
  }
}

export async function listQuizSets(): Promise<QuizSummary[]> {
  await fs.mkdir(QUIZ_DIR, { recursive: true });
  const names = (await fs.readdir(QUIZ_DIR)).filter((n) => n.toLowerCase().endsWith(".json"));
  const sets = await Promise.all(names.map(readSet));
  return sets
    .filter((s): s is QuizSet => s !== null)
    .map(({ questions, ...rest }) => ({ ...rest, questionCount: questions.length }))
    .sort((a, b) => a.subject.localeCompare(b.subject) || a.title.localeCompare(b.title));
}

export async function getQuizSet(id: string): Promise<QuizSet | null> {
  if (!ID_PATTERN.test(id)) return null;
  return readSet(`${id}.json`);
}
