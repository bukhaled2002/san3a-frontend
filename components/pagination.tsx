"use client";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  currentPage: string | string[] | undefined | number;
  last_page: number | undefined;
  nextPage: number | null;
  previousPage: number | null;
};

function Pagination({ currentPage, last_page, nextPage, previousPage }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const visiblePages = 3;

  const getPageRange = () => {
    const pages = [];
    if (last_page !== undefined && last_page <= visiblePages) {
      for (let i = 1; i <= last_page; i++) {
        pages.push(i);
      }
    } else {
      const range = [];
      const mid = Math.ceil(visiblePages / 2);
      let start, end;

      if (Number(currentPage) <= mid) {
        start = 1;
        end = visiblePages;
      } else if (
        last_page !== undefined &&
        Number(currentPage) > last_page - mid
      ) {
        start = last_page - visiblePages + 1;
        end = last_page;
      } else {
        start = Number(currentPage) - mid + 1;
        end = Number(currentPage) + mid - 1;
      }

      if (start > 1) {
        range.push(1);
      }

      if (start > 2) {
        range.push("...");
      }

      for (let i = start; i <= end; i++) {
        range.push(i);
      }

      if (last_page !== undefined && end < last_page - 1) {
        range.push("...");
      }

      if (last_page !== undefined && end < last_page) {
        range.push(last_page);
      }

      pages.push(...range);
    }
    return pages;
  };

  const pageRange = getPageRange();

  const updateURL = (pageNumber: number) => {
    let queryParams: Record<string, string> = Object.fromEntries(searchParams);

    queryParams.page = pageNumber.toString();

    const queryString = new URLSearchParams(queryParams).toString();
    const newURL = `${pathname}?${queryString}`;
    queryClient.invalidateQueries({ queryKey: ["teachers-admin"] });
    router.push(newURL);
  };

  return (
    <ul className="flex items-center justify-center gap-x-4 mt-8 select-none">
      <li
        className={cn(
          "border border-primary/20 rounded-lg bg-card/40 cursor-pointer p-2 flex items-center justify-center transition-all duration-300 hover:border-primary/50 group",
          previousPage === null && "opacity-30 cursor-not-allowed grayscale"
        )}
        onClick={() => {
          if (currentPage !== undefined && previousPage !== null)
            updateURL(Number(currentPage) - 1);
        }}
      >
        <ChevronRight size={20} className="text-tech-grey group-hover:text-primary transition-colors" />
      </li>
      <div className="flex items-center gap-x-2">
        {pageRange.map((page, index) => (
          <li key={index}>
            {page === "..." ? (
              <span className="text-tech-grey px-2 font-bold select-none">...</span>
            ) : (
              <button
                className={cn(
                  "border border-primary/20 bg-card/40 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300",
                  page === Number(currentPage) 
                    ? "border-primary text-primary bg-primary/10 shadow-neon-glow" 
                    : "text-tech-grey hover:border-primary/40 hover:text-white"
                )}
                onClick={() => {
                  if (typeof page === "number" && currentPage !== undefined)
                    updateURL(page);
                }}
              >
                {page}
              </button>
            )}
          </li>
        ))}
      </div>
      <li
        className={cn(
          "border border-primary/20 rounded-lg bg-card/40 cursor-pointer p-2 flex items-center justify-center transition-all duration-300 hover:border-primary/50 group",
          nextPage === null && "opacity-30 cursor-not-allowed grayscale"
        )}
        onClick={() => {
          if (currentPage !== undefined && nextPage !== null)
            updateURL(Number(currentPage) + 1);
        }}
      >
        <ChevronLeft size={20} className="text-tech-grey group-hover:text-primary transition-colors" />
      </li>
    </ul>
  );
}

export default Pagination;
