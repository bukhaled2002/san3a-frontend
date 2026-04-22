import AdminSubjectsTable from "@/components/admin/subjects/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: "المادة - Admin",
  description: "المادة - Admin في موقع صنعة",
};

async function Subjects({ searchParams }: Props) {
  const { page, class: classParam } = await searchParams;
  const currentPage = page as string | undefined;
  const selectedClass = classParam as string | undefined;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-x-5">
          <h1 className="text-3xl font-bold">المادة</h1>
          {/* <AdminFilter classes={classes} subjects={subjects.data} /> */}
        </div>
        <Link href="/admin/subjects/create">
          <Button variant="secondary" size="sm" className="text-white">
            اضافة مادة جديد
            <Plus className="ms-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <AdminSubjectsTable cPage={currentPage} selectedClass={selectedClass} />
    </div>
  );
}

export default Subjects;

