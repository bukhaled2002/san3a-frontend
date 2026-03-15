"use client";

import { use } from "react";
import AllQuizs from "@/components/admin/courses/quizes/all-quizs";
import { getExamsByCourse } from "@/services/exam";
import { GetQuizs } from "@/services/quiz";
import { getEssaysByCourse } from "@/services/quizEssay";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

type Props = {
  params: Promise<{
    id: string; // Course ID for the quiz
  }>;
};

function AdminExamDeletion({ params }: Props) {
  const { id } = use(params);
  const {
    data: quizzes,
    isLoading: isLoadingQuiz,
    error: errorQuiz,
  } = useQuery({
    queryKey: ["admin-quizs", id],
    queryFn: () => GetQuizs(id),
  });
  const {
    data: essays,
    isLoading: isLoadingEssay,
    error: errorEssay,
  } = useQuery({
    queryKey: ["admin-essays", id],
    queryFn: () => getEssaysByCourse(id),
  });
  const {
    data: exams,
    isLoading: isLoadingExam,
    error: errorExam,
  } = useQuery({
    queryKey: ["admin-exams", id],
    queryFn: () => getExamsByCourse(id),
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

      <AllQuizs
        //  @ts-ignore
        quizzes={quizzes}
        //  @ts-ignore
        essays={essays}
        //  @ts-ignore
        exams={exams}
        courseId={id}
      />
    </div>
  );
}

export default AdminExamDeletion;
