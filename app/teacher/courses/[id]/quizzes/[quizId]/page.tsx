"use client";

import { ExamDetails } from "@/components/teacher/quizzes/ExamDetails";
import  StudentAnswers from "@/components/teacher/quizzes/StudentAnswers";
import { getEssayById } from "@/services/public/essays";
import { getExamById } from "@/services/public/exam";
import { getQuizById } from "@/services/public/quizes";
import { useQuery } from "@tanstack/react-query";
import React, { useState, use } from "react";

export default function ExamDetailsPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = use(params);
  const [activeTab, setActiveTab] = useState<"details" | "answers">("details");


  return (
    <div className="flex flex-col gap-6 p-6" dir="rtl">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("details")}
            className={`
              py-4 px-6 text-sm font-medium border-b-2 transition-colors
              ${
                activeTab === "details"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            تفاصيل الاختبار
          </button>
          <button
            onClick={() => setActiveTab("answers")}
            className={`
              py-4 px-6 text-sm font-medium border-b-2 transition-colors
              ${
                activeTab === "answers"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            إجابات الطلاب
          </button>
        </nav>
      </div>

      <div className="mt-4">
        {activeTab === "details" && <ExamDetails examId={quizId} />}
        {activeTab === "answers" && <StudentAnswers examId={quizId} />}
      </div>
    </div>
  );
}
