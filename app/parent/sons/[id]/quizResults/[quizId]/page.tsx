import QuizResultsContent from "@/components/parent/sons/quizes/quizResultsContent";
import { getQuizResults } from "@/services/public/quizes";
import { QueryClient } from "@tanstack/react-query";

export async function generateMetadata({
  params,
}: {
  params: { id: string; quizId: string };
}) {
  const studentId = params.id;
  const quizId = params.quizId;
  const quiz = await getQuizResults(quizId, studentId);

  return {
    title: `${quiz.quizTitle}`,
    description: `صفحة الاختبار ${quiz.quizTitle} في موقع صنعة`,
  };
}

type Props = {
  params: { id: string; quizId: string };
};

async function SonQuiz({ params }: Props) {
  const { id: studentId, quizId } = params;
  const queryclient = new QueryClient();
  queryclient.prefetchQuery({
    queryKey: ["quiz", quizId, studentId],
    queryFn: () => getQuizResults(quizId, studentId),
  });

  return <QuizResultsContent quizId={quizId} studentId={studentId} />;
}

export default SonQuiz;
