import TeacherCourseContentForm from "@/components/teacher/courses/courseContentForm";
import { getAllChapters } from "@/services/teacher/courses";
import React from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function TeacherCourseLectureEdit({ params }: Props) {
  const courseId = (await params).id;
  const chapters = await getAllChapters(courseId);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
        <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
        تعديل محتوى الدورة
      </h1>
      <h2 className="text-tech-grey text-lg font-medium mb-8">
        قم بتعديل الفصول والحصص الخاصة بالدورة التعليمية
      </h2>
      <TeacherCourseContentForm courseIdSlug={courseId} />
    </div>
  );
}

export default TeacherCourseLectureEdit;
