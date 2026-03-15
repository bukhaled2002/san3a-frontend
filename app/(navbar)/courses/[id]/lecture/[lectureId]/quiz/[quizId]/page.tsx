import QuizContent from "@/components/courses/quizContent";
import { getEssayById } from "@/services/public/essays";
import { getQuizById } from "@/services/public/quizes";
import { QueryClient } from "@tanstack/react-query";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; lectureId: string; quizId: string }>;
}) {
  const { quizId } = await params;
  const quiz = await getQuizById(quizId);

  return {
    title: `${quiz.title}`,
    description: `صفحة الاختبار ${quiz.title} في موقع حصتي`,
  };
}

type Props = {
  params: Promise<{ id: string; lectureId: string; quizId: string }>;
};

async function Quiz({ params }: Props) {
  const { id: courseId, lectureId, quizId } = await params;
  const queryclient = new QueryClient();

  queryclient.prefetchQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => getQuizById(quizId),
  });

  queryclient.prefetchQuery({
    queryKey: ["essay", quizId],
    queryFn: () => getEssayById(quizId),
  });

  // queryclient.prefetchQuery({
  //   queryKey: ["exam", quizId],
  //   queryFn: () => getExamById(quizId),
  // });

  return (
    <QuizContent courseId={courseId} lectureId={lectureId} quizId={quizId} />
  );
}

export default Quiz;
