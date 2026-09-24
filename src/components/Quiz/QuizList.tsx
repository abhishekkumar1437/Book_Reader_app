"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Clock, Quiz, Search } from "@/components/ui/icons";
import { bestScore, localQuizStore, type QuizAttempt } from "@/lib/quiz/storage";
import type { QuizSummary } from "@/lib/quiz/types";

interface QuizListProps {
  sets: QuizSummary[];
  /** When given, only this subject's tests are shown (second level). */
  subject?: string;
}

interface Stats {
  attempts: number;
  best: QuizAttempt | null;
  inProgress: boolean;
}

export function subjectHref(subject: string): string {
  return `/quiz/subject/${encodeURIComponent(subject)}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function matches(set: QuizSummary, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [set.title, set.topic, set.subject, set.description ?? ""].some((s) => s.toLowerCase().includes(q));
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative mt-6">
      <Search size={16} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-fg-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-line bg-white/5 py-3 pr-4 pl-11 text-sm text-fg outline-none placeholder:text-fg-muted/70 focus:border-accent"
        aria-label={placeholder}
      />
    </div>
  );
}

function SetCard({ set, stats, showSubject }: { set: QuizSummary; stats?: Stats; showSubject: boolean }) {
  const best = stats?.best ?? null;
  return (
    <article className="card flex flex-col rounded-2xl border border-line bg-bg-2/80 p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
          <Quiz size={20} />
        </span>
        <div className="min-w-0">
          {showSubject && <p className="text-[11px] tracking-widest text-accent uppercase">{set.subject}</p>}
          <h3 className="font-serif text-lg leading-snug text-fg">{set.title}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-fg-muted">{set.topic}</p>
        </div>
      </div>

      <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-muted">
        <div>
          <dt className="sr-only">Questions</dt>
          <dd>{set.questionCount} questions</dd>
        </div>
        {set.timeLimitMinutes && (
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <dd>{set.timeLimitMinutes} min</dd>
          </div>
        )}
        {set.createdAt && <dd>Added {formatDate(set.createdAt)}</dd>}
      </dl>

      <div className="mt-3 min-h-5 text-xs">
        {best ? (
          <span className="text-fg-muted">
            Best <span className="font-medium text-accent">{best.score}/{best.total}</span> · {stats?.attempts} attempt
            {stats?.attempts === 1 ? "" : "s"}
          </span>
        ) : (
          <span className="text-fg-muted">Not attempted yet</span>
        )}
      </div>

      <Link
        href={`/quiz/${encodeURIComponent(set.id)}`}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm font-medium text-ink transition hover:bg-accent-2"
      >
        {stats?.inProgress ? "Resume exam" : best ? "Attempt again" : "Start exam"}
      </Link>
    </article>
  );
}

export function QuizList({ sets, subject }: QuizListProps) {
  const [stats, setStats] = useState<Record<string, Stats>>({});
  const [query, setQuery] = useState("");

  useEffect(() => {
    const load = () =>
      setStats(
        Object.fromEntries(
          sets.map((s) => {
            const attempts = localQuizStore.getAttempts(s.id);
            return [
              s.id,
              { attempts: attempts.length, best: bestScore(attempts), inProgress: localQuizStore.getInProgress(s.id) !== null },
            ];
          }),
        ),
      );
    const id = window.setTimeout(load, 0);
    window.addEventListener("focus", load);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("focus", load);
    };
  }, [sets]);

  const subjects = useMemo(() => {
    const map = new Map<string, QuizSummary[]>();
    for (const s of sets) map.set(s.subject, [...(map.get(s.subject) ?? []), s]);
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [sets]);

  const searching = query.trim().length > 0;

  // ----- second level: one subject -----
  if (subject) {
    const own = sets.filter((s) => s.subject === subject);
    const visible = own.filter((s) => matches(s, query));
    return (
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <nav className="mt-6 flex items-center gap-2 text-sm text-fg-muted" aria-label="Breadcrumb">
          <Link href="/quiz" className="hover:text-fg">All subjects</Link>
          <ChevronRight size={14} />
          <span className="text-fg">{subject}</span>
        </nav>
        <h2 className="mt-2 font-serif text-3xl text-fg">{subject}</h2>
        <p className="mt-1 text-sm text-fg-muted">
          {own.length} test{own.length === 1 ? "" : "s"}
        </p>
        <SearchBox value={query} onChange={setQuery} placeholder={`Search tests in ${subject}…`} />

        {visible.length === 0 ? (
          <p className="py-16 text-center text-sm text-fg-muted">No tests match “{query}”.</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((set) => (
              <SetCard key={set.id} set={set} stats={stats[set.id]} showSubject={false} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ----- first level: subjects (or search results across everything) -----
  const results = searching ? sets.filter((s) => matches(s, query)) : [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      {sets.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line px-6 py-16 text-center text-fg-muted">
          <p className="font-serif text-lg text-fg">No question sets yet</p>
          <p className="mt-2 text-sm">Add a JSON file to the quizzes folder to see it here.</p>
        </div>
      ) : (
        <>
          <SearchBox value={query} onChange={setQuery} placeholder="Search subjects and tests…" />

          {searching ? (
            <section className="mt-6">
              <h2 className="mb-4 font-serif text-xl text-fg">
                {results.length} result{results.length === 1 ? "" : "s"}
              </h2>
              {results.length === 0 ? (
                <p className="py-12 text-center text-sm text-fg-muted">Nothing matches “{query}”.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((set) => (
                    <SetCard key={set.id} set={set} stats={stats[set.id]} showSubject />
                  ))}
                </div>
              )}
            </section>
          ) : (
            <section className="mt-8">
              <h2 className="mb-4 font-serif text-2xl text-fg">Subjects</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {subjects.map(([name, own]) => {
                  const attempted = own.filter((s) => (stats[s.id]?.attempts ?? 0) > 0).length;
                  const inProgress = own.some((s) => stats[s.id]?.inProgress);
                  return (
                    <Link
                      key={name}
                      href={subjectHref(name)}
                      className="card group flex items-center gap-4 rounded-2xl border border-line bg-bg-2/80 p-5"
                    >
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/15 font-serif text-xl text-accent">
                        {name.charAt(0)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-serif text-lg leading-snug text-fg">{name}</span>
                        <span className="mt-1 block text-xs text-fg-muted">
                          {own.length} test{own.length === 1 ? "" : "s"}
                          {attempted > 0 && ` · ${attempted} attempted`}
                          {inProgress && <span className="text-accent"> · exam in progress</span>}
                        </span>
                      </span>
                      <ChevronRight className="shrink-0 text-fg-muted transition group-hover:text-fg" />
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
