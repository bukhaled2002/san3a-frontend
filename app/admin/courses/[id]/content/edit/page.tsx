import AdminCourseContentForm from "@/components/admin/courses/courseContentForm";
import { getAllChapters } from "@/services/admin/courses";
import { QueryClient } from "@tanstack/react-query";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

async function AdminCourseLectureEdit({ params }: Props) {
  const courseId = params.id;
  const chapters = await getAllChapters(courseId);
  const queryClient = new QueryClient();
  queryClient.prefetchQuery({
    queryKey: ["chapters", courseId],
    queryFn: () => getAllChapters(courseId),
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
          تعديل محتوى الدورة
        </h1>
        <p className="text-tech-grey text-lg font-medium">
          قم بتحديث الفصول والحصص الخاصة بالدورة التعليمية
        </p>
      </div>
      <AdminCourseContentForm courseIdSlug={courseId} />
    </div>
  );
}

export default AdminCourseLectureEdit;
