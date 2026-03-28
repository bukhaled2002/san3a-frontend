"use client";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { columns } from "./columns";
import Image from "next/image";
import Pagination from "@/components/pagination";
import { useSearchParams } from "next/navigation";
import { getChargeRequests } from "@/services/admin/charge-requests";

type Props = {};

function ChargeRequestsTable({}: Props) {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const { data: chargeRequests } = useQuery({
    queryKey: ["charge-requests-admin", page],
    queryFn: () => getChargeRequests(page || "1"),
  });

  if (!chargeRequests)
    return (
      <div className=" flex items-center justify-center">
        <Loader2 className="animate-spin text-secondary" size={50} />
      </div>
    );
  const currentPage = chargeRequests.meta.currentPage;
  const totalPages = chargeRequests.meta.totalPages;
  const nextPage = chargeRequests.meta.nextPage;
  const previousPage = chargeRequests.meta.previousPage;

  return (
    <div>
      <DataTable columns={columns} data={chargeRequests.data} />
      <div className="flex items-center justify-center gap-2 text-xl font-bold mt-6">
        <div className="text-[#d4d4d4]">عمليات الشحن</div>
        <div className="flex items-center gap-[10px]">
          <span className="text-primary">{chargeRequests.count} عمليه</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 25 22"
            fill="none"
          >
            <path
              id="Vector"
              d="M1.60156 4.60039V19.0004C1.60156 19.4247 1.77013 19.8317 2.07019 20.1318C2.37025 20.4318 2.77722 20.6004 3.20156 20.6004H22.4016C22.8259 20.6004 23.2329 20.4318 23.5329 20.1318C23.833 19.8317 24.0016 19.4247 24.0016 19.0004V6.20039C24.0016 5.77604 23.833 5.36908 23.5329 5.06902C23.2329 4.76896 22.8259 4.60039 22.4016 4.60039H5.60156M1.60156 4.60039V3.00039C1.60156 2.57604 1.77013 2.16908 2.07019 1.86902C2.37025 1.56896 2.77722 1.40039 3.20156 1.40039H16.0016C16.4259 1.40039 16.8329 1.56896 17.1329 1.86902C17.433 2.16908 17.6016 2.57604 17.6016 3.00039V4.60039H5.60156M1.60156 4.60039H5.60156M15.2016 14.2004H20.0016"
              stroke="white"
              strokeWidth="1.8"
              fill="#f65428"
            />
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

export default ChargeRequestsTable;
