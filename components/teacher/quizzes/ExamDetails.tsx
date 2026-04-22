"use client";

import { getEssayById } from "@/services/public/essays";
import { getExamById } from "@/services/public/exam";
import { getQuizById } from "@/services/public/quizes";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export function ExamDetails({ examId }: { examId: string }) {
  const {
    data: mcqData,
    isLoading: isLoadingMcq,
    error: mcqError,
    isSuccess: isMcqSuccess,
  } = useQuery({
    queryKey: ["teacher-quiz", examId],
    queryFn: () => getQuizById(examId),
  });

  const {
    data: essayData,
    isLoading: isLoadingEssay,
    error: essayError,
    isSuccess: isEssaySuccess,
  } = useQuery({
    queryKey: ["teacher-essay", examId],
    queryFn: () => getEssayById(examId),
    enabled: !!mcqError || (isMcqSuccess && !!mcqData?.message),
    retry: 1,
  });

  const {
    data: examData,
    isLoading: isLoadingExam,
    error: examError,
  } = useQuery({
    queryKey: ["teacher-exam", examId],
    queryFn: () => getExamById(examId),
    enabled:
      (!!mcqError || (isMcqSuccess && !!mcqData?.message)) &&
      (!!essayError || (isEssaySuccess && !!essayData?.message)),
  });

  let quizData;
  if (mcqData?.message) {
    quizData = examData || essayData;
  } else {
    quizData = mcqData || essayData || examData;
  }

  console.log(quizData);

  const isLoading = isLoadingMcq || isLoadingEssay || isLoadingExam;
  const combinedError = mcqError && essayError && examError;
  const questions =
    quizData === mcqData
      ? mcqData?.questions
      : quizData === essayData
      ? essayData?.QuestionEssay
      : [
          ...(examData?.Quiz?.questions || []),
          ...(examData?.QuizEssay?.QuestionEssay || []),
        ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-secondary" size={80} />
      </div>
    );
  }

  if (combinedError) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
        role="alert"
      >
        <p>حدث خطأ أثناء تحميل البيانات.</p>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="text-center text-gray-500">
        لم يتم العثور على تفاصيل الاختبار
      </div>
    );
  }

  console.log(quizData);

  return (
    <div
      className="bg-card/40 backdrop-blur-md border border-primary/10 rounded-3xl shadow-2xl overflow-hidden relative"
      dir="rtl"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="px-10 py-8 border-b border-primary/10 relative z-10">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
          {quizData.title}
        </h2>
      </div>
      <div className="p-10 space-y-8 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">
            تفاصيل الاختبار
          </h3>
          <ul className="list-disc list-inside space-y-2 text-tech-grey">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              عدد الأسئلة: {questions?.length}
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            الأسئلة
          </h3>
          <div className="space-y-6">
            {questions?.map((question, index) => (
              <div key={question.id} className="bg-card/30 border border-primary/5 rounded-2xl p-6 hover:border-primary/20 transition-all group">
                <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                  <span className="text-xs bg-primary/10 px-2 py-1 rounded-md">السؤال {index + 1}</span>
                </h4>
                <p className="text-white text-lg font-medium leading-relaxed">{question.question}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
