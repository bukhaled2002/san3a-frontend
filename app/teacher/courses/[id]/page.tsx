import { getCourse } from "@/services/teacher/courses";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الدورات - Teacher",
  description: "الدورات - Teacher في موقع صنعة",
};

type Props = {
  params: {
    id: string;
  };
};

async function TeacherSingleCourse({ params }: Props) {
  const course = await getCourse(params.id);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
          بيانات الكورس
        </h1>
        <p className="text-tech-grey text-lg font-medium">
          تفاصيل الدورة التعليمية وإحصائياتها
        </p>
      </div>
    </div>
  );
}

export default TeacherSingleCourse;
