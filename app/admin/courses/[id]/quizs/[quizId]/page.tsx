"use client";

import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { GetExamStudents } from "@/services/exam";
import { GetQuizStudents } from "@/services/quiz";
import { GetEssayStudents } from "@/services/quizEssay";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

type QuizData = {
  firstName: string;
  lastName: string;
  score: number;
};

const QuizPage = ({ params }: { params: { quizId: string } }) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  const {
    data: mcqData,
    isLoading: isLoadingMcq,
    error: mcqError,
  } = useQuery({
    queryKey: ["admin-quiz-students", params.quizId],
    queryFn: () => GetQuizStudents(params.quizId),
    enabled: isClient,
    retry: 1,
  });

  const {
    data: essayData,
    isLoading: isLoadingEssay,
    error: essayError,
  } = useQuery({
    queryKey: ["admin-essay-students", params.quizId],
    queryFn: () => GetEssayStudents(params.quizId),
    enabled: isClient && !!mcqError,
    retry: 1,
  });

  const {
    data: examData,
    isLoading: isLoadingExam,
    error: examError,
  } = useQuery({
    queryKey: ["admin-exam-students", params.quizId],
    queryFn: () => GetExamStudents(params.quizId),
    enabled: isClient && !!mcqError && !!essayError,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (
    !isClient ||
    isLoadingMcq ||
    (mcqError && isLoadingEssay) ||
    (mcqError && essayError && isLoadingExam)
  ) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-secondary" size={50} />
      </div>
    );
  }

  if (mcqError && essayError && examError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>حدث خطأ في جلب البيانات.</p>
      </div>
    );
  }

  const quizData = mcqData || essayData || examData;
  const quizType = mcqData
    ? "الامحان المتعدد الاختيارات"
    : essayData
    ? "الامتحان المقالي"
    : "الامتحان";

  if (!quizData?.data || quizData.data.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-8">
          <div className="mb-8 flex justify-between items-center flex-row-reverse">
            <button
              onClick={() => router.back()}
              className="text-indigo-600 hover:text-indigo-900 flex justify-self-end items-center gap-2 mb-4"
            >
              <span>الصفحة السابقة</span>
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {quizData?.title}
              </h1>
              <p className="text-gray-600 mt-2">درجات {quizType}</p>
            </div>
          </div>
          <div className="flex items-center justify-center h-64 border rounded-md bg-gray-50">
            <p className="text-gray-500 text-lg">لا يوجد نتائج متاحة</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8 flex justify-between items-center flex-row-reverse">
          <button
            onClick={() => router.back()}
            className="text-indigo-600 hover:text-indigo-900 flex justify-self-end items-center gap-2 mb-4"
          >
            <span>الصفحة السابقة</span>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {quizData.title}
            </h1>
            <p className="text-gray-600 mt-2">درجات {quizType}</p>
          </div>
        </div>

        <div className="rounded-md border">
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">اسم الطالب</TableHead>
                <TableHead className="text-right">الدرجة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizData.data.map((result: QuizData) => (
                <TableRow key={result.firstName + result.lastName}>
                  <TableCell className="font-medium">
                    {result.firstName} {result.lastName}
                  </TableCell>
                  <TableCell>
                    <span className="bg-green-500 text-white px-2 py-1 rounded-md">
                      {result.score}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
