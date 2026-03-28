"use client";
import { DataTable } from "@/components/ui/data-table";
import { getTeachers } from "@/services/admin/teachers";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { columns } from "./columns";
import Image from "next/image";
import Pagination from "@/components/pagination";
import { useSearchParams } from "next/navigation";
import { getTransactions } from "@/services/admin/transactions";

type Props = {};

function AdminTransactionsTable({}: Props) {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const { data: transactions } = useQuery({
    queryKey: ["transactions-admin", page],
    queryFn: () => getTransactions(page || "1"),
  });

  if (!transactions)
    return (
      <div className=" flex items-center justify-center">
        <Loader2 className="animate-spin text-secondary" size={50} />
      </div>
    );
  const currentPage = transactions.meta.currentPage;
  const totalPages = transactions.meta.totalPages;
  const nextPage = transactions.meta.nextPage;
  const previousPage = transactions.meta.previousPage;

  return (
    <div>
      <DataTable columns={columns} data={transactions.data} />
      <div className="flex items-center justify-center gap-2 text-xl font-bold mt-6">
        <div className="text-[#d4d4d4]">اجمالي العدد</div>
        <div className="flex items-center gap-[10px]">
          <span className="text-primary">{transactions.count} عملية تحويل</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 33 33"
            fill="none"
          >
            <g id="fluent:person-money-20-regular">
              <path
                id="Vector"
                d="M16.5008 3.69922C14.8034 3.69922 13.1755 4.3735 11.9753 5.57374C10.7751 6.77397 10.1008 8.40183 10.1008 10.0992C10.1008 11.7966 10.7751 13.4245 11.9753 14.6247C13.1755 15.8249 14.8034 16.4992 16.5008 16.4992C18.1982 16.4992 19.826 15.8249 21.0263 14.6247C22.2265 13.4245 22.9008 11.7966 22.9008 10.0992C22.9008 8.40183 22.2265 6.77397 21.0263 5.57374C19.826 4.3735 18.1982 3.69922 16.5008 3.69922ZM11.7008 10.0992C11.7008 8.82618 12.2065 7.60528 13.1067 6.70511C14.0068 5.80493 15.2277 5.29922 16.5008 5.29922C17.7738 5.29922 18.9947 5.80493 19.8949 6.70511C20.7951 7.60528 21.3008 8.82618 21.3008 10.0992C21.3008 11.3723 20.7951 12.5932 19.8949 13.4933C18.9947 14.3935 17.7738 14.8992 16.5008 14.8992C15.2277 14.8992 14.0068 14.3935 13.1067 13.4933C12.2065 12.5932 11.7008 11.3723 11.7008 10.0992ZM8.51518 18.0992C8.09374 18.0973 7.67608 18.1787 7.28617 18.3387C6.89627 18.4986 6.5418 18.734 6.24313 19.0314C5.94445 19.3287 5.70745 19.6821 5.54574 20.0713C5.38402 20.4605 5.30078 20.8778 5.30078 21.2992C5.30078 24.0048 6.63358 26.0448 8.71678 27.3744C10.3936 28.4432 12.5488 29.0512 14.9008 29.2352V27.6304C12.792 27.448 10.952 26.8992 9.57758 26.0224C7.89758 24.952 6.90078 23.3952 6.90078 21.2992C6.90078 20.4144 7.61758 19.6992 8.51518 19.6992H27.272C26.9911 19.2128 26.5872 18.8088 26.1007 18.528C25.6143 18.2471 25.0625 18.0992 24.5008 18.0992H8.51518ZM30.9008 23.6992V28.4992C30.9008 29.1357 30.6479 29.7462 30.1978 30.1963C29.7477 30.6464 29.1373 30.8992 28.5008 30.8992H18.9008C18.2643 30.8992 17.6538 30.6464 17.2037 30.1963C16.7536 29.7462 16.5008 29.1357 16.5008 28.4992V23.6992C16.5008 23.0627 16.7536 22.4522 17.2037 22.0022C17.6538 21.5521 18.2643 21.2992 18.9008 21.2992H28.5008C29.1373 21.2992 29.7477 21.5521 30.1978 22.0022C30.6479 22.4522 30.9008 23.0627 30.9008 23.6992ZM29.3008 28.4992V26.8992C28.6643 26.8992 28.0538 27.1521 27.6037 27.6022C27.1536 28.0522 26.9008 28.6627 26.9008 29.2992H28.5008C28.5008 29.087 28.5851 28.8836 28.7351 28.7335C28.8851 28.5835 29.0886 28.4992 29.3008 28.4992ZM29.3008 23.6992C29.0886 23.6992 28.8851 23.6149 28.7351 23.4649C28.5851 23.3149 28.5008 23.1114 28.5008 22.8992H26.9008C26.9008 23.5357 27.1536 24.1462 27.6037 24.5963C28.0538 25.0464 28.6643 25.2992 29.3008 25.2992V23.6992ZM18.9008 22.8992C18.9008 23.1114 18.8165 23.3149 18.6665 23.4649C18.5164 23.6149 18.313 23.6992 18.1008 23.6992V25.2992C18.7373 25.2992 19.3478 25.0464 19.7978 24.5963C20.2479 24.1462 20.5008 23.5357 20.5008 22.8992H18.9008ZM18.1008 28.4992C18.313 28.4992 18.5164 28.5835 18.6665 28.7335C18.8165 28.8836 18.9008 29.087 18.9008 29.2992H20.5008C20.5008 28.6627 20.2479 28.0522 19.7978 27.6022C19.3478 27.1521 18.7373 26.8992 18.1008 26.8992V28.4992ZM23.7008 23.6992C23.0643 23.6992 22.4538 23.9521 22.0037 24.4022C21.5536 24.8522 21.3008 25.4627 21.3008 26.0992C21.3008 26.7357 21.5536 27.3462 22.0037 27.7963C22.4538 28.2464 23.0643 28.4992 23.7008 28.4992C24.3373 28.4992 24.9478 28.2464 25.3978 27.7963C25.8479 27.3462 26.1008 26.7357 26.1008 26.0992C26.1008 25.4627 25.8479 24.8522 25.3978 24.4022C24.9478 23.9521 24.3373 23.6992 23.7008 23.6992Z"
                fill="#f65428"
              />
            </g>
          </svg>
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

export default AdminTransactionsTable;
