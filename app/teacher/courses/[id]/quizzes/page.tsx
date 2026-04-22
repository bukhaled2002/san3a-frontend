import { ExamsList } from "@/components/teacher/quizzes/ExamsList";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "الامتحانات - Teacher",
  description: "الامتحانات - Teacher في موقع صنعة",
};

const TeacherQuizzes = ({params}:{params:{id:string}}) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
        <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
        الامتحانات
      </h1>
      <p className="text-tech-grey text-lg font-medium mb-8">
        عرض و تقييم جميع الامتحانات و الاختبارات
      </p>

      <ExamsList courseId={params.id} />
    </div>
  );
};

export default TeacherQuizzes;
