import AdminSubjectForm from "@/components/admin/subjects/form";
import { Metadata } from "next";

type Props = {};

export const metadata: Metadata = {
  title: "انشاء مادة - Admin",
  description: "انشاء مادة - Admin في موقع صنعة",
};

function AdminSubjectsCreate({}: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
          انشاء مادة جديدة
        </h1>
        <p className="text-tech-grey text-lg font-medium">
          قم بإضافة مادة دراسية جديدة وتحديد المحتوى الخاص بها
        </p>
      </div>
      <AdminSubjectForm />
    </div>
  );
}

export default AdminSubjectsCreate;
