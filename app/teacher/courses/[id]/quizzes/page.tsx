import { ExamsList } from "@/components/teacher/quizzes/ExamsList";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "الامتحانات - Teacher",
  description: "الامتحانات - Teacher في موقع حصتي",
};

const TeacherQuizzes = ({params}:{params:{id:string}}) => {
  return (
    <div>
      <h1 className="text-3xl font-bold">الامتحانات</h1>
      <p className="text-[#121212B2]/70 text-lg font-semibold mb-4">
        عرض و تقييم جميع الامتحانات و الاختبارات
      </p>

      <ExamsList courseId={params.id} />
    </div>
  );
};

export default TeacherQuizzes;
