import QuizResultsContent from "@/components/courses/quizResultsContent";
import { getUserByToken } from "@/services/profile";
import { getQuizResults } from "@/services/public/quizes";
import { QueryClient } from "@tanstack/react-query";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; lectureId: string; quizId: string }>;
}) {
  const { quizId } = await params;
  const data = await getUserByToken();
  const studentId = data.id;
  const quiz = await getQuizResults(quizId, studentId);

  return {
    title: `${quiz.quizTitle}`,
    description: `صفحة الاختبار ${quiz.quizTitle} في موقع صنعة`,
  };
}

type Props = {
  params: Promise<{ id: string; lectureId: string; quizId: string }>;
};

async function QuizResults({ params }: Props) {
  const { quizId } = await params;
  const data = await getUserByToken();
  const studentId = data.id;
  const queryclient = new QueryClient();
  queryclient.prefetchQuery({
    queryKey: ["quiz", quizId, studentId],
    queryFn: () => getQuizResults(quizId, studentId),
  });

  return <QuizResultsContent quizId={quizId} studentId={studentId} />;
}

export default QuizResults;
