import AdminIntialCourseForm from "@/components/admin/courses/InIntialCourseForm";
import { getCourse } from "@/services/admin/courses";
import { Metadata } from "next";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "تعديل الدورة - Admin",
  description: "تعديل الدورة - Admin في موقع صنعة",
};

async function AdminCourseEdit({ params }: Props) {
  const { id } = await params;
  const course = await getCourse(id);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
          تعديل بيانات الدورة
        </h1>
        <p className="text-tech-grey text-lg font-medium">
          تعديل المعلومات الأساسية والمادة الدراسية للدورة
        </p>
      </div>
      <AdminIntialCourseForm intialValues={course} />
    </div>
  );
}

export default AdminCourseEdit;
