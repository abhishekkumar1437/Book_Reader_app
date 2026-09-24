import type { Metadata } from "next";
import { QuizList } from "@/components/Quiz/QuizList";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { listQuizSets } from "@/lib/quiz/server";

export const metadata: Metadata = { title: "Quiz · Book Reader" };
// Sets are files on disk that can change at any time, so never cache this page.
export const dynamic = "force-dynamic";

export default async function QuizPage() {
  const sets = await listQuizSets();
  return (
    <main className="min-h-full">
      <SiteHeader subtitle="Exam-style practice sets, 40 questions each." />
      <QuizList sets={sets} />
    </main>
  );
}
