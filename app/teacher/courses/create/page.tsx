import TeacherIntialCourseForm from "@/components/teacher/courses/InIntialCourseForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "اضافة دورة جديدة - معلم",
  description: "اضافة دورة جديدة - معلم في موقع صنعة",
};

type Props = {};

function TeacherCourseCreate({}: Props) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
        <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
        اضافة دورة جديدة
      </h1>
      <h2 className="text-tech-grey text-lg font-medium mb-8">
        من فضلك قم بمليء جميع تفاصيل المادة
      </h2>
      <TeacherIntialCourseForm />
    </div>
  );
}

export default TeacherCourseCreate;
