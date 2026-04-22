import AdminTeachersForm from "@/components/admin/teachers/form";
import { Metadata } from "next";

type Props = {};

export const metadata: Metadata = {
  title: "انشاء حساب لمعلم - Admin",
  description: "انشاء حساب لمعلم - Admin في موقع صنعة",
};

function AdminTeacherCreate({}: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
          انشاء حساب لمعلم
        </h1>
        <p className="text-tech-grey text-lg font-medium">
          قم بإضافة بيانات المعلم الجديد وتخصيص المادة الدراسية
        </p>
      </div>
      <AdminTeachersForm />
    </div>
  );
}

export default AdminTeacherCreate;
