import AdminFilter from "@/components/admin/teachers/filter";
import AdminTeachersTable from "@/components/admin/teachers/table";
import { Button } from "@/components/ui/button";
import { getSubjects } from "@/services/admin/subjects";
import { getTeachers } from "@/services/admin/teachers";
import { getClasses } from "@/services/public/classes";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "المعلمين - Admin",
  description: "المعلمين - Admin في موقع صنعة",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function AdminTeachers({ searchParams }: Props) {
  const { page, class: classParam, subject } = await searchParams;
  const classes = await getClasses();
  const subjects = await getSubjects();
  const currentPage = page as string | undefined;
  const selectedClass = classParam as string | undefined;
  const selectedSubject = subject as string | undefined;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-x-6">
          <h1 className="text-3xl font-bold text-white neon-glow">المعلمين</h1>
          <AdminFilter classes={classes} subjects={subjects.data} />
        </div>
        <Link href="/admin/teachers/create">
          <Button className="font-bold shadow-neon-glow">
            اضافة معلم جديد
            <Plus className="ms-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
      <AdminTeachersTable
        cPage={currentPage}
        selectedClass={selectedClass}
        selectedSubject={selectedSubject}
      />
    </div>
  );
}

export default AdminTeachers;

