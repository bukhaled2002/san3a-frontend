import AdminForm from "@/components/admin/manage-admins/form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "انشاء مشرف - Admin",
  description: "انشاء مشرف - Admin في موقع صنعة",
};

type Props = {};

function AdminCreate({}: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
          انشاء مشرف جديد
        </h1>
        <p className="text-tech-grey text-lg font-medium">
          قم بإضافة مشرف جديد للمنصة بصلاحيات محددة
        </p>
      </div>
      <AdminForm />
    </div>
  );
}

export default AdminCreate;
