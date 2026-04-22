"use client";
import { DataTable } from "@/components/ui/data-table";
import { getAdmins } from "@/services/admin/manage-admins";
import { useQuery } from "@tanstack/react-query";
import { Loader2, UserCog } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { columns } from "./columns";

type Props = {};

function ManageAdminsTable({}: Props) {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const { data: admins } = useQuery({
    queryKey: ["admins", page],
    queryFn: getAdmins,
  });

  if (!admins)
    return (
      <div className=" flex items-center justify-center">
        <Loader2 className="animate-spin text-secondary" size={50} />
      </div>
    );
  // const currentPage = teachers.meta.currentPage;
  // const totalPages = teachers.meta.totalPages;
  // const nextPage = teachers.meta.nextPage;
  // const previousPage = teachers.meta.previousPage;

  return (
    <div>
      <DataTable columns={columns} data={admins} />
      <div className="flex items-center justify-center gap-2 text-xl font-bold mt-10 bg-card/20 backdrop-blur-sm border border-primary/10 w-fit mx-auto px-8 py-3 rounded-2xl">
        <div className="text-tech-grey">اجمالي العدد:</div>
        <div className="flex items-center gap-[10px]">
          <span className="text-primary neon-glow">{admins.length} مشرف</span>
          <UserCog className="text-primary h-6 w-6" />
        </div>
      </div>
      {/* {totalPages !== 0 && (
        <div className="flex items-center justify-center">
          <Pagination
            currentPage={currentPage}
            last_page={totalPages}
            nextPage={nextPage}
            previousPage={previousPage}
          />
        </div>
      )} */}
    </div>
  );
}

export default ManageAdminsTable;
