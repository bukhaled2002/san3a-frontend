"use client";
import AllQuizs from "@/components/admin/courses/quizes/all-quizs";
import { GetQuizs } from "@/services/quiz";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import React, { use } from "react";

type Props = {
  params: Promise<{
    id: string; // Course ID for the quiz
  }>;
};

function AdminExamDeletion({ params }: Props) {
  const { id } = use(params);
  const {
    data: quizs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-quizs", id],
    queryFn: () => GetQuizs(id),
  });
console.log('quizs',quizs)
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-secondary" size={50} />
      </div>
    );

  if (error)
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
      <AllQuizs data={quizs} courseId={id} />
    </div>
  );
}

export default AdminExamDeletion;
