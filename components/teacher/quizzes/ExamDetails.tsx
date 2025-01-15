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
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      dir="rtl"
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">{quizData.title}</h2>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            تفاصيل الاختبار
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>عدد الأسئلة: {questions?.length}</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">الأسئلة</h3>
          <div className="space-y-4">
            {questions?.map((question, index) => (
              <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  السؤال {index + 1}
                </h4>
                <p className="text-gray-700 mb-2">{question.question}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
