import AdminCourseContentForm from "@/components/admin/courses/courseContentForm";
import { getAllChapters } from "@/services/admin/courses";
import { QueryClient } from "@tanstack/react-query";
import React from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function AdminCourseLectureEdit({ params }: Props) {
  const courseId = (await params).id;
  const chapters = await getAllChapters(courseId);
  const queryClient = new QueryClient();
  queryClient.prefetchQuery({
    queryKey: ["chapters", courseId],
    queryFn: () => getAllChapters(courseId),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">اضافة دورة جديدة</h1>
      <h2 className="text-[#121212B2]/70 text-lg font-semibold mb-4">
        من فضلك قم بمليء جميع تفاصيل المادة
      </h2>
      <AdminCourseContentForm courseIdSlug={courseId} />
    </div>
  );
}

export default AdminCourseLectureEdit;
