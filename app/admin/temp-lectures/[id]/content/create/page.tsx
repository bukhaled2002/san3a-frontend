import AdminCourseContentForm from "@/components/admin/courses/courseContentForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function AdminCourseLectureCreate({ params }: Props) {
  const courseId = (await params).id;

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

export default AdminCourseLectureCreate;
