"use client";
import Pagination from "@/components/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Loader2, MoreVertical, Plus, Users, Code, QrCode } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { deleteLecture, getLectures } from "@/services/admin/lectures";
import QRCode from "react-qr-code";

type Props = {};

function AdminLecturesContent({}: Props) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const page = searchParams.get("page");
  const { data: lectures } = useQuery({
    queryKey: ["lectures-admin", page],
    queryFn: () => getLectures(page || "1"),
  });

  const { mutate: DeleteLecture, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteLecture(id),
    onSuccess: () => {
      toast({
        title: "تم حذف الدورة بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["lectures-admin"] });
      setDeleteOpen(false);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast({
          title: error.response?.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "حدث خطأ ما",
          variant: "destructive",
        });
      }
    },
  });

  if (!lectures)
    return (
      <div className=" flex items-center justify-center">
        <Loader2 className="animate-spin text-secondary" size={50} />
      </div>
    );
  const currentPage = lectures.metaData.currentPage;
  const totalPages = lectures.metaData.totalPages;
  const nextPage = lectures.metaData.nextPage;
  const previousPage = lectures.metaData.previousPage;

  return (
    <div>
      {lectures.lectures.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8">
          {lectures.lectures.map((lecture) => {
            return (
              <div
                key={lecture.id}
                className="block rounded-lg border border-[#00000026] relative overflow-hidden"
              >
                <div className="h-60 relative">
                  <QRCode
                    id={`qr-code-${lecture.code}`}
                    className="h-full w-full"
                    value={`https://www.7sty.com/?search-lecture=true`}
                    level="H"
                  />
                  <div className="absolute bottom-0 flex border-b-[6px] border-primary items-center justify-between text-white bg-black bg-opacity-80 w-full px-4 py-2 text-sm">
                    <div>
                      <QrCode size={16} className="inline ml-2" />
                      {lecture.code}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="font-bold text-lg mb-1">
                        {lecture.title}
                      </h1>
                      <h2 className="text-base font-semibold">
                        {lecture.code}
                      </h2>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        asChild
                      >
                        <Button variant="ghost" className="w-8 h-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>العمليات</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/admin/temp-lectures/${lecture.id}/content/create`}
                            className="cursor-pointer"
                          >
                            تعديل الحصة
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-500 hover:text-red-600 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setDeleteOpen(true);
                          }}
                        >
                          حذف الحصة
                        </DropdownMenuItem>
                        <AlertDialog
                          open={deleteOpen}
                          onOpenChange={setDeleteOpen}
                        >
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-start">
                                هل انت متأكد من حذف الدورة؟
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-500 text-start">
                                لا يمكنك التراجع بعد الحذف
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-x-2">
                              <AlertDialogCancel
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                رجوع
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  DeleteLecture(lecture.id);
                                }}
                              >
                                {isDeleting ? "جاري الحذف..." : "حذف"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-6 flex items-center justify-center">
                    <Link
                      href={`/admin/temp-lectures/${lecture.id}/qr-codes`}
                      className="w-full"
                    >
                      <Button className="text-base font-semibold rounded-[10px] w-full">
                        <Plus className="me-2 h-5 w-5 p-0.5 bg-white/30 rounded-full" />
                        اضافة رمز كيو أر
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-lg text-[#121212B2] font-semibold leading-[27px]">
          لا يوجد كورسات
        </div>
      )}
      <div className="flex items-center justify-center gap-2 text-xl font-bold mt-6">
        <div className="text-[#d4d4d4]">اجمالي العدد</div>
        <div className="flex items-center gap-[10px]">
          <span className="text-primary">{lectures.count} حصص</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
          >
            <g id="bar-chart-2">
              <path
                id="Icon"
                d="M17 20C17 20.5523 17.4477 21 18 21C18.5523 21 19 20.5523 19 20H17ZM19 10C19 9.44772 18.5523 9 18 9C17.4477 9 17 9.44772 17 10H19ZM11 20C11 20.5523 11.4477 21 12 21C12.5523 21 13 20.5523 13 20H11ZM13 4C13 3.44772 12.5523 3 12 3C11.4477 3 11 3.44772 11 4H13ZM5 20C5 20.5523 5.44772 21 6 21C6.55228 21 7 20.5523 7 20H5ZM7 14C7 13.4477 6.55228 13 6 13C5.44772 13 5 13.4477 5 14H7ZM19 20V10H17V20H19ZM13 20V4H11V20H13ZM7 20V14H5V20H7Z"
                fill="#4e2bcd"
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

export default AdminLecturesContent;
