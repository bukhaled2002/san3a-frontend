import ManageAdminsTable from "@/components/admin/manage-admins/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "المشرفين - Admin",
  description: "المشرفين - Admin في موقع صنعة",
};

type Props = {};

async function ManageAdmins({}: Props) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
            المشرفين
          </h1>
          <p className="text-tech-grey text-sm mt-1">إدارة مشرفي النظام والصلاحيات</p>
        </div>
        <Link href="/admin/manage-admins/create">
          <Button className="font-bold shadow-neon-glow rounded-xl h-12 px-6">
            اضافة مشرف جديد
            <Plus className="ms-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
      <ManageAdminsTable />
    </div>
  );
}

export default ManageAdmins;
