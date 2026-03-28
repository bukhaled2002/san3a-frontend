"use client";
import Pagination from "@/components/pagination";
import { DataTable } from "@/components/ui/data-table";
import { getStudents } from "@/services/teacher/students";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Image from "next/image";
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
      <div className="flex items-center justify-center gap-2 text-xl font-bold mt-6">
        <div className="text-[#d4d4d4]">اجمالي العدد</div>
        <div className="flex items-center gap-[10px]">
          <span className="text-primary">{students.count} طالب</span>
          <Image
            src="/icons/ph_student.svg"
            width={32}
            height={32}
            alt="طالب"
          />
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

export default StudentsTable;
