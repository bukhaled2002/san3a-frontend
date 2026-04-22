import TeacherIntialCourseForm from "@/components/teacher/courses/InIntialCourseForm";
import { getCourse } from "@/services/teacher/courses";
import { Metadata } from "next";

type Props = {
  params: {
    id: string;
  };
};

export const metadata: Metadata = {
  title: "تعديل الدورة - Teacher",
  description: "تعديل الدورة - Teacher في موقع صنعة",
};

async function TeacherCourseEdit({ params }: Props) {
  const course = await getCourse(params.id);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
        <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
        تعديل الدورة
      </h1>
      <h2 className="text-tech-grey text-lg font-medium mb-8">
        قم بتعديل بيانات الدورة التعليمية الخاصة بك
      </h2>
      <TeacherIntialCourseForm intialValues={course} />
    </div>
  );
}

export default TeacherCourseEdit;
