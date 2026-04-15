"use client";
import Pagination from "@/components/pagination";
import { DataTable } from "@/components/ui/data-table";
import { getTeachers } from "@/services/admin/teachers";
import { useQuery } from "@tanstack/react-query";
import { Loader2, UserCog } from "lucide-react";
import { columns } from "./columns";

type Props = {
  cPage: string | string[] | undefined;
  selectedClass: string | string[] | undefined;
  selectedSubject: string | string[] | undefined;
};

function AdminTeachersTable({ cPage, selectedClass, selectedSubject }: Props) {
  const limit = 10;
  const { data: teachers } = useQuery({
    queryKey: ["teachers-admin", cPage, selectedClass, selectedSubject],
    queryFn: () =>
      getTeachers(cPage || "1", limit, selectedClass, selectedSubject),
  });
  if (!teachers)
    return (
      <div className=" flex items-center justify-center">
        <Loader2 className="animate-spin text-secondary" size={50} />
      </div>
    );
  const currentPage = cPage ?? teachers.meta.currentPage;
  const totalPages = teachers.meta.totalPages;
  const nextPage = teachers.meta.nextPage;
  const previousPage = teachers.meta.previousPage;

  return (
    <div>
      <DataTable columns={columns} data={teachers.data} />
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 bg-card/30 backdrop-blur-sm border border-primary/10 p-6 rounded-2xl">
        <div className="flex items-center gap-4 text-xl font-bold">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <UserCog size={24} />
          </div>
          <div>
            <div className="text-tech-grey text-sm uppercase tracking-widest font-bold">
              اجمالي العدد
            </div>
            <div className="text-white neon-glow">
              {teachers.count}{" "}
              <span className="text-sm font-normal text-tech-grey">معلمين</span>
            </div>
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

export default AdminTeachersTable;
