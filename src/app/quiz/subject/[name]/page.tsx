import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizList } from "@/components/Quiz/QuizList";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { listQuizSets } from "@/lib/quiz/server";

type Props = { params: Promise<{ name: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  return { title: `${decodeURIComponent(name)} · Quiz` };
}

export default async function SubjectPage({ params }: Props) {
  const { name } = await params;
  const subject = decodeURIComponent(name);
  const sets = await listQuizSets();
  if (!sets.some((s) => s.subject === subject)) notFound();

  return (
    <main className="min-h-full">
      <SiteHeader subtitle="Exam-style practice sets, 40 questions each." />
      <QuizList sets={sets} subject={subject} />
    </main>
  );
}
