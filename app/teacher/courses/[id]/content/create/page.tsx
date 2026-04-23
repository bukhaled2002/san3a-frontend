import TeacherCourseContentForm from "@/components/teacher/courses/courseContentForm";

type Props = {
  params: Promise<{ id: string }>;
};

async function TeacherCourseLectureCreate({ params }: Props) {
  const courseId = (await params).id;
  return (
    <div>
      <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
        <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
        إضافة محتوى الدورة
      </h1>
      <h2 className="text-tech-grey text-lg font-medium mb-8">
        قم بإضافة الفصول والحصص الخاصة بالدورة التعليمية
      </h2>
      <TeacherCourseContentForm courseIdSlug={courseId} />
    </div>
  );
}

export default TeacherCourseLectureCreate;
