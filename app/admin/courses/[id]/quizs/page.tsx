"use client";
import AllQuizs from "@/components/admin/courses/quizes/all-quizs";
import { getAllExams, getExamsByCourse } from "@/services/exam";
import { GetQuizs } from "@/services/quiz";
import { getEssaysByCourse } from "@/services/quizEssay";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

type Props = {
  params: {
    id: string; // Course ID for the quiz
  };
};

function AdminExamDeletion({ params }: Props) {
  const {
    data: quizzes,
    isLoading: isLoadingQuiz,
    error: errorQuiz,
  } = useQuery({
    queryKey: ["admin-quizs", params.id],
    queryFn: () => GetQuizs(params.id),
  });
  const {
    data: essays,
    isLoading: isLoadingEssay,
    error: errorEssay,
  } = useQuery({
    queryKey: ["admin-essays", params.id],
    queryFn: () => getEssaysByCourse(params.id),
  });
  const {
    data: exams,
    isLoading: isLoadingExam,
    error: errorExam,
  } = useQuery({
    queryKey: ["admin-exams", params.id],
    queryFn: () => getExamsByCourse(params.id),
  });

  if (isLoadingQuiz || isLoadingEssay || isLoadingExam)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-secondary" size={50} />
      </div>
    );

  if (errorQuiz || errorEssay || errorExam)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>حدث خطأ في جلب البيانات.</p>
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-bold">الامتحانات المتاحه للدورة</h1>
      <h2 className="text-[#121212B2]/70 text-lg font-semibold mb-4">
        من فضلك قم بمليء جميع تفاصيل المادة
      </h2>

      {/* @ts-ignore */}
      <AllQuizs
        quizzes={quizzes}
        essays={essays}
        exams={exams}
        courseId={params.id}
      />
    </div>
  );
}

export default AdminExamDeletion;
