import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamRunner } from "@/components/Quiz/ExamRunner";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { getQuizSet } from "@/lib/quiz/server";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const set = await getQuizSet(decodeURIComponent(id));
  return { title: set ? `${set.title} · Quiz` : "Quiz · Book Reader" };
}

export default async function QuizSetPage({ params }: Props) {
  const { id } = await params;
  const set = await getQuizSet(decodeURIComponent(id));
  if (!set) notFound();

  return (
    <main className="min-h-full">
      <SiteHeader subtitle={`${set.subject} · ${set.questions.length} questions`} />
      <ExamRunner set={set} />
    </main>
  );
}
