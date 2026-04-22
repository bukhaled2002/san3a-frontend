import AdminStudentsForm from "@/components/admin/students/form";
import { getStudent } from "@/services/admin/students";
import { Metadata } from "next";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "تعديل حساب الطالب - Admin",
  description: "تعديل حساب الطالب - Admin في موقع صنعة",
};

async function AdminStudentEdit({ params }: Props) {
  const { id } = await params;
  const student = await getStudent(id);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
          تعديل حساب الطالب
        </h1>
        <p className="text-tech-grey text-lg font-medium">
          قم بتحديث بيانات الطالب وتفاصيل الصف الدراسي
        </p>
      </div>
      <AdminStudentsForm intialValues={student} />
    </div>
  );
}

export default AdminStudentEdit;
