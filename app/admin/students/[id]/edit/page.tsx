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
  description: "تعديل حساب الطالب - Admin في موقع حصتي",
};

async function AdminStudentEdit({ params }: Props) {
  const { id } = await params;
  const student = await getStudent(id);

  return (
    <>
      <h1 className="text-3xl font-bold mb-7">تعديل حساب المعلم</h1>
      <AdminStudentsForm intialValues={student} />
    </>
  );
}

export default AdminStudentEdit;
