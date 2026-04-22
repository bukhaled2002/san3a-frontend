import AdminCourseContentForm from "@/components/admin/courses/courseContentForm";

type Props = {
  params: {
    id: string;
  };
};

async function AdminCourseLectureCreate({ params }: Props) {
  const courseId = params.id;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
          اضافة محتوى للدورة
        </h1>
        <p className="text-tech-grey text-lg font-medium">
          من فضلك قم بمليء جميع تفاصيل المادة الدراسية بدقة
        </p>
      </div>
      <AdminCourseContentForm courseIdSlug={courseId} />
    </div>
  );
}

export default AdminCourseLectureCreate;
