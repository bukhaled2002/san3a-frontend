import AdminLecturesContent from "@/components/admin/temp-lectures/coursesContent";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "الدورات التعليمية - Admin",
  description: "الدورات التعليمية - Admin في موقع صنعة",
};

type Props = {};

async function AdminLectures({}: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">الحصص المؤقتة</h1>
        <Link href="/admin/temp-lectures/create">
          <Button variant="secondary" size="sm" className="text-white">
            اضافة حصة جديدة
            <Plus className="ms-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <AdminLecturesContent />
    </div>
  );
}

export default AdminLectures;
