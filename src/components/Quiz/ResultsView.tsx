"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, Close, Flag } from "@/components/ui/icons";
import type { QuizAttempt } from "@/lib/quiz/storage";
import type { QuizSet } from "@/lib/quiz/types";

interface ResultsViewProps {
  set: QuizSet;
  attempt: QuizAttempt;
  best: QuizAttempt | null;
  onRetake: () => void;
}

type Filter = "all" | "incorrect" | "unanswered" | "flagged";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m} min ${s} s` : `${s} s`;
}

export function ResultsView({ set, attempt, best, onRetake }: ResultsViewProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(
    () =>
      attempt.order.map((qIndex, pos) => {
        const q = set.questions[qIndex];
        const chosen = attempt.answers[pos];
        return {
          pos,
          q,
          chosen,
          correct: chosen === q.answer,
          unanswered: chosen === null,
          flagged: attempt.flagged.includes(pos),
        };
      }),
    [set, attempt],
  );

  const incorrect = rows.filter((r) => !r.correct && !r.unanswered).length;
  const unanswered = rows.filter((r) => r.unanswered).length;
  const percent = Math.round((attempt.score / attempt.total) * 100);
  const isBest = best !== null && best.id === attempt.id;

  const visible = rows.filter((r) => {
    if (filter === "incorrect") return !r.correct && !r.unanswered;
    if (filter === "unanswered") return r.unanswered;
    if (filter === "flagged") return r.flagged;
    return true;
  });

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: rows.length },
    { key: "incorrect", label: "Incorrect", count: incorrect },
    { key: "unanswered", label: "Unanswered", count: unanswered },
    { key: "flagged", label: "Flagged", count: attempt.flagged.length },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6">
      <section className="mt-8 rounded-3xl border border-line bg-bg-2/80 p-6 sm:p-8">
        <p className="text-xs tracking-widest text-accent uppercase">{set.subject}</p>
        <h1 className="mt-1 font-serif text-2xl text-fg">{set.title}</h1>

        <div className="mt-6 flex flex-wrap items-end gap-6">
          <div>
            <p className="font-serif text-6xl leading-none text-fg">
              {attempt.score}
              <span className="text-2xl text-fg-muted">/{attempt.total}</span>
            </p>
            <p className="mt-2 text-sm text-fg-muted">
              {percent}% {isBest && attempt.score > 0 && <span className="text-accent">· your best so far</span>}
            </p>
          </div>
          <dl className="grid flex-1 grid-cols-2 gap-2 text-center text-sm sm:grid-cols-4">
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 py-2 text-emerald-200">
              <dd className="font-serif text-2xl">{attempt.score}</dd>
              <dt className="text-xs">correct</dt>
            </div>
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 py-2 text-red-200">
              <dd className="font-serif text-2xl">{incorrect}</dd>
              <dt className="text-xs">incorrect</dt>
            </div>
            <div className="rounded-xl border border-line py-2 text-fg-muted">
              <dd className="font-serif text-2xl text-fg">{unanswered}</dd>
              <dt className="text-xs">unanswered</dt>
            </div>
            <div className="rounded-xl border border-line py-2 text-fg-muted">
              <dd className="font-serif text-2xl text-fg">{formatDuration(attempt.durationSec)}</dd>
              <dt className="text-xs">time taken</dt>
            </div>
          </dl>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={onRetake} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-ink hover:bg-accent-2">
            Attempt again
          </button>
          <Link href="/quiz" className="rounded-xl border border-line px-5 py-2.5 text-sm text-fg-muted hover:bg-white/5 hover:text-fg">
            Back to quizzes
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h2 className="mr-2 font-serif text-xl text-fg">Review</h2>
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                filter === f.key ? "border-accent bg-accent/15 text-fg" : "border-line text-fg-muted hover:bg-white/5"
              }`}
              aria-pressed={filter === f.key}
            >
              {f.label} <span className="opacity-70">{f.count}</span>
            </button>
          ))}
        </div>

        {visible.length === 0 && <p className="py-8 text-center text-sm text-fg-muted">Nothing to show for this filter.</p>}

        <ol className="space-y-4">
          {visible.map(({ pos, q, chosen, correct, unanswered: skipped, flagged }) => (
            <li key={pos} className="rounded-2xl border border-line bg-bg-2/60 p-5">
              <div className="flex items-center justify-between gap-3 text-xs text-fg-muted">
                <span>Question {pos + 1}</span>
                <span className="flex items-center gap-2">
                  {flagged && (
                    <span className="flex items-center gap-1 text-amber-300">
                      <Flag size={12} filled /> flagged
                    </span>
                  )}
                  {skipped ? (
                    <span>Not answered</span>
                  ) : correct ? (
                    <span className="flex items-center gap-1 text-emerald-300"><Check size={14} /> Correct</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-300"><Close size={14} /> Incorrect</span>
                  )}
                </span>
              </div>
              <p className="mt-2 font-serif text-lg leading-relaxed whitespace-pre-line text-fg">{q.question}</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {q.options.map((opt, i) => {
                  const isAnswer = i === q.answer;
                  const isChosen = i === chosen;
                  const cls = isAnswer
                    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-100"
                    : isChosen
                      ? "border-red-400/40 bg-red-400/10 text-red-100"
                      : "border-line text-fg-muted";
                  return (
                    <li key={i} className={`flex items-start gap-3 rounded-lg border px-3 py-2 ${cls}`}>
                      <span className="w-5 shrink-0 font-medium">{LETTERS[i]}</span>
                      <span className="flex-1">{opt}</span>
                      {isAnswer && <span className="shrink-0 text-xs">correct answer</span>}
                      {isChosen && !isAnswer && <span className="shrink-0 text-xs">your answer</span>}
                    </li>
                  );
                })}
              </ul>
              {q.explanation && <p className="mt-3 text-sm leading-relaxed text-fg-muted">{q.explanation}</p>}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
