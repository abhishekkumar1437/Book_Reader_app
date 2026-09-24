"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, ChevronLeft, ChevronRight, Clock, Flag } from "@/components/ui/icons";
import { bestScore, localQuizStore, type InProgressAttempt, type QuizAttempt } from "@/lib/quiz/storage";
import type { QuizSet } from "@/lib/quiz/types";
import { ResultsView } from "./ResultsView";

interface ExamRunnerProps {
  set: QuizSet;
}

type Phase = "intro" | "exam" | "results";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

function shuffled(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatClock(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return (h > 0 ? `${h}:` : "") + `${h > 0 ? String(m).padStart(2, "0") : m}:${String(sec).padStart(2, "0")}`;
}

export function ExamRunner({ set }: ExamRunnerProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [resume, setResume] = useState<InProgressAttempt | null>(null);
  const [history, setHistory] = useState<QuizAttempt[]>([]);
  const [shuffle, setShuffle] = useState(true);
  const [timed, setTimed] = useState(true);

  const [state, setState] = useState<InProgressAttempt | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<QuizAttempt | null>(null);

  // Read persisted data after mount (localStorage is browser-only).
  useEffect(() => {
    const t = window.setTimeout(() => {
      setResume(localQuizStore.getInProgress(set.id));
      setHistory(localQuizStore.getAttempts(set.id));
    }, 0);
    return () => window.clearTimeout(t);
  }, [set.id]);

  const start = useCallback(
    (existing?: InProgressAttempt) => {
      const fresh: InProgressAttempt = existing ?? {
        setId: set.id,
        startedAt: new Date().toISOString(),
        order: shuffle ? shuffled(set.questions.length) : set.questions.map((_, i) => i),
        answers: set.questions.map(() => null),
        flagged: [],
        current: 0,
        timeLimitSec: timed && set.timeLimitMinutes ? set.timeLimitMinutes * 60 : null,
      };
      setState(fresh);
      setNow(Date.now());
      setPhase("exam");
    },
    [set, shuffle, timed],
  );

  // Persist progress so a refresh does not lose the attempt.
  useEffect(() => {
    if (phase === "exam" && state) localQuizStore.setInProgress(set.id, state);
  }, [phase, state, set.id]);

  const submit = useCallback(() => {
    if (!state) return;
    let score = 0;
    state.order.forEach((qIndex, pos) => {
      if (state.answers[pos] === set.questions[qIndex].answer) score++;
    });
    const attempt: QuizAttempt = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      setId: set.id,
      startedAt: state.startedAt,
      finishedAt: new Date().toISOString(),
      durationSec: Math.round((Date.now() - new Date(state.startedAt).getTime()) / 1000),
      order: state.order,
      answers: state.answers,
      flagged: state.flagged,
      score,
      total: set.questions.length,
    };
    localQuizStore.addAttempt(attempt);
    localQuizStore.setInProgress(set.id, null);
    setHistory((h) => [attempt, ...h]);
    setResult(attempt);
    setConfirming(false);
    setPhase("results");
  }, [state, set]);

  // Countdown. The tick also auto-submits when time runs out.
  const elapsedSec = state ? (now - new Date(state.startedAt).getTime()) / 1000 : 0;
  const remainingSec = state?.timeLimitSec != null ? state.timeLimitSec - elapsedSec : null;
  const submitRef = useRef(submit);
  const stateRef = useRef(state);
  useEffect(() => {
    submitRef.current = submit;
    stateRef.current = state;
  }, [submit, state]);
  const startedAt = state?.startedAt;
  const timeLimitSec = state?.timeLimitSec ?? null;
  useEffect(() => {
    if (phase !== "exam" || !startedAt || timeLimitSec === null) return;
    const startedMs = new Date(startedAt).getTime();
    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      if ((t - startedMs) / 1000 >= timeLimitSec) submitRef.current();
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, startedAt, timeLimitSec]);

  // ----- answering -----
  const update = useCallback((fn: (s: InProgressAttempt) => InProgressAttempt) => {
    setState((s) => (s ? fn(s) : s));
  }, []);
  const goTo = useCallback(
    (pos: number) => update((s) => ({ ...s, current: Math.min(Math.max(pos, 0), s.order.length - 1) })),
    [update],
  );
  const select = useCallback(
    (option: number) =>
      update((s) => {
        const answers = [...s.answers];
        answers[s.current] = answers[s.current] === option ? null : option;
        return { ...s, answers };
      }),
    [update],
  );
  const clear = useCallback(
    () =>
      update((s) => {
        const answers = [...s.answers];
        answers[s.current] = null;
        return { ...s, answers };
      }),
    [update],
  );
  const toggleFlag = useCallback(
    () =>
      update((s) => ({
        ...s,
        flagged: s.flagged.includes(s.current) ? s.flagged.filter((i) => i !== s.current) : [...s.flagged, s.current],
      })),
    [update],
  );

  useEffect(() => {
    if (phase !== "exam") return;
    const onKey = (e: KeyboardEvent) => {
      if (confirming) {
        if (e.key === "Escape") setConfirming(false);
        return;
      }
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      // Letters and digits pick an option only when that option exists; "F" otherwise flags.
      const optionCount = set.questions[stateRef.current?.order[stateRef.current.current] ?? 0].options.length;
      const letter = LETTERS.indexOf(e.key.toUpperCase());
      const digit = /^[1-9]$/.test(e.key) ? Number(e.key) - 1 : -1;
      if (letter >= 0 && letter < optionCount) select(letter);
      else if (digit >= 0 && digit < optionCount) select(digit);
      else if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        update((s) => ({ ...s, current: Math.min(s.current + 1, s.order.length - 1) }));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        update((s) => ({ ...s, current: Math.max(s.current - 1, 0) }));
      } else if (e.key.toLowerCase() === "f") toggleFlag();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, confirming, select, toggleFlag, update, set]);

  const answeredCount = useMemo(() => state?.answers.filter((a) => a !== null).length ?? 0, [state]);
  const best = useMemo(() => bestScore(history), [history]);

  // ----- results -----
  if (phase === "results" && result) {
    return (
      <ResultsView
        set={set}
        attempt={result}
        best={best}
        onRetake={() => {
          setResult(null);
          setState(null);
          setPhase("intro");
        }}
      />
    );
  }

  // ----- intro -----
  if (phase === "intro" || !state) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
        <div className="mt-10 rounded-3xl border border-line bg-bg-2/80 p-6 sm:p-8">
          <p className="text-xs tracking-widest text-accent uppercase">{set.subject}</p>
          <h1 className="mt-1 font-serif text-3xl text-fg">{set.title}</h1>
          <p className="mt-2 text-sm text-fg-muted">{set.topic}</p>
          {set.description && <p className="mt-4 text-sm leading-relaxed text-fg">{set.description}</p>}

          <ul className="mt-6 grid gap-2 text-sm text-fg-muted sm:grid-cols-3">
            <li className="rounded-xl border border-line px-3 py-2">
              <span className="block font-serif text-2xl text-fg">{set.questions.length}</span>questions
            </li>
            <li className="rounded-xl border border-line px-3 py-2">
              <span className="block font-serif text-2xl text-fg">{set.timeLimitMinutes ?? "—"}</span>
              {set.timeLimitMinutes ? "minutes" : "no time limit"}
            </li>
            <li className="rounded-xl border border-line px-3 py-2">
              <span className="block font-serif text-2xl text-fg">{best ? `${best.score}/${best.total}` : "—"}</span>
              {best ? "best score" : "not attempted"}
            </li>
          </ul>

          {resume && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm">
              <span>
                You have an unfinished attempt ({resume.answers.filter((a) => a !== null).length} of {resume.order.length}{" "}
                answered).
              </span>
              <button
                type="button"
                className="rounded-lg bg-accent px-3 py-1.5 font-medium text-ink hover:bg-accent-2"
                onClick={() => start(resume)}
              >
                Resume
              </button>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 accent-[var(--accent)]" checked={shuffle} onChange={(e) => setShuffle(e.target.checked)} />
              Shuffle questions
            </label>
            {set.timeLimitMinutes && (
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 accent-[var(--accent)]" checked={timed} onChange={(e) => setTimed(e.target.checked)} />
                Enable {set.timeLimitMinutes} minute timer
              </label>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-accent-2"
              onClick={() => {
                localQuizStore.setInProgress(set.id, null);
                start();
              }}
            >
              {resume ? "Start a new attempt" : "Start exam"}
            </button>
            <Link href="/quiz" className="rounded-xl border border-line px-5 py-2.5 text-sm text-fg-muted hover:bg-white/5 hover:text-fg">
              Back to quizzes
            </Link>
          </div>

          <p className="mt-6 text-xs text-fg-muted">
            Keys: A–D or 1–4 to answer · ← → to move · F to flag for review · one mark per question, no negative marking.
          </p>
        </div>

        {history.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 font-serif text-lg text-fg">Previous attempts</h2>
            <ul className="divide-y divide-line rounded-2xl border border-line">
              {history.slice(0, 8).map((a) => (
                <li key={a.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="text-fg-muted">{new Date(a.finishedAt).toLocaleString()}</span>
                  <span className="font-medium text-fg">
                    {a.score}/{a.total} <span className="text-fg-muted">({Math.round((a.score / a.total) * 100)}%)</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }

  // ----- exam -----
  const q = set.questions[state.order[state.current]];
  const chosen = state.answers[state.current];
  const flagged = state.flagged.includes(state.current);
  const isLast = state.current === state.order.length - 1;
  const lowTime = remainingSec !== null && remainingSec <= 60;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <div className="glass sticky top-2 z-10 mt-4 flex flex-wrap items-center gap-3 rounded-2xl px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-base text-fg">{set.title}</p>
          <p className="text-xs text-fg-muted">
            {answeredCount} of {state.order.length} answered · {state.flagged.length} flagged
          </p>
        </div>
        {remainingSec !== null && (
          <div
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-sm tabular-nums ${
              lowTime ? "bg-red-500/20 text-red-200" : "bg-white/5 text-fg"
            }`}
            aria-live={lowTime ? "assertive" : "off"}
          >
            <Clock size={16} />
            {formatClock(remainingSec)}
          </div>
        )}
        <button
          type="button"
          className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-ink transition hover:bg-accent-2"
          onClick={() => setConfirming(true)}
        >
          Submit
        </button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-4">
        <section className="rounded-3xl border border-line bg-bg-2/80 p-5 sm:p-7 lg:col-span-3">
          <div className="flex items-center justify-between text-xs text-fg-muted">
            <span>
              Question <span className="text-fg">{state.current + 1}</span> of {state.order.length}
            </span>
            <button
              type="button"
              onClick={toggleFlag}
              className={`flex items-center gap-1.5 rounded-lg px-2 py-1 transition ${
                flagged ? "bg-amber-400/15 text-amber-300" : "hover:bg-white/5 hover:text-fg"
              }`}
              aria-pressed={flagged}
            >
              <Flag size={14} filled={flagged} />
              {flagged ? "Flagged for review" : "Flag for review"}
            </button>
          </div>

          <h2 className="mt-3 font-serif text-xl leading-relaxed whitespace-pre-line text-fg sm:text-2xl">{q.question}</h2>

          <div className="mt-6 grid gap-2.5" role="radiogroup" aria-label="Options">
            {q.options.map((opt, i) => {
              const selected = chosen === i;
              return (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => select(i)}
                  className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                    selected
                      ? "border-accent bg-accent/10 text-fg"
                      : "border-line text-fg/90 hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-medium ${
                      selected ? "border-accent bg-accent text-ink" : "border-line text-fg-muted"
                    }`}
                  >
                    {LETTERS[i]}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => goTo(state.current - 1)}
              disabled={state.current === 0}
              className="flex items-center gap-1 rounded-xl border border-line px-3 py-2 text-sm text-fg-muted hover:bg-white/5 hover:text-fg disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              type="button"
              onClick={clear}
              disabled={chosen === null}
              className="rounded-xl border border-line px-3 py-2 text-sm text-fg-muted hover:bg-white/5 hover:text-fg disabled:opacity-40"
            >
              Clear response
            </button>
            <div className="flex-1" />
            {isLast ? (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-ink hover:bg-accent-2"
              >
                Review and submit
              </button>
            ) : (
              <button
                type="button"
                onClick={() => goTo(state.current + 1)}
                className="flex items-center gap-1 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-ink hover:bg-accent-2"
              >
                Next <ChevronRight size={16} />
              </button>
            )}
          </div>
        </section>

        <aside className="rounded-3xl border border-line bg-bg-2/80 p-4 lg:col-span-1">
          <h3 className="mb-3 text-xs tracking-widest text-fg-muted uppercase">Questions</h3>
          <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10 lg:grid-cols-5">
            {state.order.map((_, pos) => {
              const answered = state.answers[pos] !== null;
              const isFlagged = state.flagged.includes(pos);
              const isCurrent = pos === state.current;
              return (
                <button
                  key={pos}
                  type="button"
                  onClick={() => goTo(pos)}
                  aria-label={`Question ${pos + 1}${answered ? ", answered" : ""}${isFlagged ? ", flagged" : ""}`}
                  aria-current={isCurrent ? "true" : undefined}
                  className={`relative h-8 rounded-md text-xs font-medium tabular-nums transition ${
                    answered ? "bg-accent/80 text-ink" : "bg-white/5 text-fg-muted hover:bg-white/10"
                  } ${isCurrent ? "ring-2 ring-fg ring-offset-1 ring-offset-bg" : ""}`}
                >
                  {pos + 1}
                  {isFlagged && <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-400" />}
                </button>
              );
            })}
          </div>
          <ul className="mt-4 space-y-1 text-[11px] text-fg-muted">
            <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-accent/80" /> Answered</li>
            <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-white/10" /> Not answered</li>
            <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-400" /> Flagged</li>
          </ul>
        </aside>
      </div>

      {confirming && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="Submit exam">
          <div className="glass w-full max-w-md rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <Alert className="text-accent" size={24} />
              <h2 className="font-serif text-xl text-fg">Submit your answers?</h2>
            </div>
            <ul className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
              <li className="rounded-xl border border-line py-2"><span className="block font-serif text-2xl text-fg">{answeredCount}</span>answered</li>
              <li className="rounded-xl border border-line py-2"><span className="block font-serif text-2xl text-fg">{state.order.length - answeredCount}</span>unanswered</li>
              <li className="rounded-xl border border-line py-2"><span className="block font-serif text-2xl text-fg">{state.flagged.length}</span>flagged</li>
            </ul>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className="rounded-xl border border-line px-4 py-2 text-sm text-fg-muted hover:bg-white/5 hover:text-fg" onClick={() => setConfirming(false)}>
                Keep answering
              </button>
              <button type="button" className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-ink hover:bg-accent-2" onClick={submit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
