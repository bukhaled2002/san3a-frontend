import QuizResultsContent from "@/components/parent/sons/quizes/quizResultsContent";
import { getQuizResults } from "@/services/public/quizes";
import { QueryClient } from "@tanstack/react-query";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; quizId: string }>;
}) {
  const { id: studentId, quizId } = await params;
  const quiz = await getQuizResults(quizId, studentId);

  return {
    title: `${quiz.quizTitle}`,
    description: `صفحة الاختبار ${quiz.quizTitle} في موقع صنعة`,
  };
}

type Props = {
  params: Promise<{ id: string; quizId: string }>;
};

async function SonQuiz({ params }: Props) {
  const { id: studentId, quizId } = await params;
  const queryclient = new QueryClient();
  queryclient.prefetchQuery({
    queryKey: ["quiz", quizId, studentId],
    queryFn: () => getQuizResults(quizId, studentId),
  });

  return <QuizResultsContent quizId={quizId} studentId={studentId} />;
}

export default SonQuiz;
