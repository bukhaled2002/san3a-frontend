import AdminCoursesContent from "@/components/admin/courses/coursesContent";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "الدورات التعليمية - Admin",
  description: "الدورات التعليمية - Admin في موقع صنعة",
};

type Props = {};

async function AdminCourses({}: Props) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white neon-glow">الدورات التعليمية</h1>
          <p className="text-tech-grey text-sm mt-1">إدارة الدورات التعليمية المتاحة في المنصة</p>
        </div>
        <Link href="/admin/courses/create">
          <Button className="font-bold shadow-neon-glow">
            اضافة دورة جديدة
            <Plus className="ms-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
      <AdminCoursesContent />
    </div>
  );
}

export default AdminCourses;
