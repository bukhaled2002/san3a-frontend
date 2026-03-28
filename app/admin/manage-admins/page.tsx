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
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">المشرفين</h1>
        <Link href="/admin/manage-admins/create">
          <Button variant="secondary" size="sm" className="text-white">
            اضافة مشرف جديد
            <Plus className="ms-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <ManageAdminsTable />
    </div>
  );
}

export default ManageAdmins;
