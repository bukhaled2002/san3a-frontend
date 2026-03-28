"use client";
import Pagination from "@/components/pagination";
import { DataTable } from "@/components/ui/data-table";
import { getSubjects } from "@/services/admin/subjects";
import { useQuery } from "@tanstack/react-query";
import { Book, Loader2 } from "lucide-react";
import { columns } from "./columns";

type Props = {
  cPage: string | string[] | undefined;
  selectedClass: string | string[] | undefined;
};

function AdminSubjectsTable({ cPage, selectedClass }: Props) {
  const limit = 10;
  const { data: subjects } = useQuery({
    queryKey: ["subjects-admin", cPage, selectedClass],
    queryFn: () => getSubjects(cPage || "1", limit, selectedClass),
  });
  if (!subjects)
    return (
      <div className=" flex items-center justify-center">
        <Loader2 className="animate-spin text-secondary" size={50} />
      </div>
    );

  const currentPage = cPage ?? subjects.meta.currentPage;
  const totalPages = subjects.meta.totalPages;
  const nextPage = subjects.meta.nextPage;
  const previousPage = subjects.meta.previousPage;

  return (
    <div>
      <DataTable columns={columns} data={subjects.data} />
      <div className="flex items-center justify-center gap-2 text-xl font-bold mt-6">
        <div className="text-[#d4d4d4]">اجمالي العدد</div>
        <div className="flex items-center gap-[10px] text-primary">
          <span>{subjects.count} طالب</span>
          <Book size={24} />
        </div>
      </div>
      {totalPages !== 0 && (
        <div className="flex items-center justify-center">
          <Pagination
            currentPage={currentPage}
            last_page={totalPages}
            nextPage={nextPage}
            previousPage={previousPage}
          />
        </div>
      )}
    </div>
  );
}

export default AdminSubjectsTable;
