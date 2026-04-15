"use client";
import Pagination from "@/components/pagination";
import { DataTable } from "@/components/ui/data-table";
import { getStudents } from "@/services/teacher/students";
import { useQuery } from "@tanstack/react-query";
import { Loader2, GraduationCap } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { columns } from "./columns";

type Props = {};

function StudentsTable({}: Props) {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const { data: students } = useQuery({
    queryKey: ["students-teacher", page],
    queryFn: () => getStudents(page || "1"),
  });

  if (!students)
    return (
      <div className=" flex items-center justify-center">
        <Loader2 className="animate-spin text-secondary" size={50} />
      </div>
    );
  const currentPage = students.meta.currentPage;
  const totalPages = students.meta.totalPages;
  const nextPage = students.meta.nextPage;
  const previousPage = students.meta.previousPage;

  return (
    <div>
      <DataTable columns={columns} data={students.data} />
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 bg-card/30 backdrop-blur-sm border border-primary/10 p-6 rounded-2xl">
         <div className="flex items-center gap-4 text-xl font-bold">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <GraduationCap size={24} />
            </div>
            <div>
              <div className="text-tech-grey text-sm uppercase tracking-widest font-bold">اجمالي العدد</div>
              <div className="text-white neon-glow">{students.count} <span className="text-sm font-normal text-tech-grey">طالب</span></div>
            </div>
         </div>

         {totalPages !== 0 && (
          <Pagination
            currentPage={currentPage}
            last_page={totalPages}
            nextPage={nextPage}
            previousPage={previousPage}
          />
        )}
      </div>
    </div>
  );
}

export default StudentsTable;
