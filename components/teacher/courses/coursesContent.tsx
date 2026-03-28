"use client";
import Pagination from "@/components/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
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
import { deleteCourse, getCourses } from "@/services/teacher/courses";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Clock, Loader2, MoreVertical, Plus, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {};

function TeacherCoursesContent({}: Props) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: courses } = useQuery({
    queryKey: ["courses-teacher", page],
    queryFn: () => getCourses(page || "1"),
  });

  const { mutate: DeleteCourse, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => {
      toast({
        title: "تم حذف الدورة بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["courses-teacher", page] });
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

  if (!courses)
    return (
      <div className=" flex items-center justify-center">
        <Loader2 className="animate-spin text-secondary" size={50} />
      </div>
    );
  const currentPage = courses.meta.currentPage;
  const totalPages = courses.meta.totalPages;
  const nextPage = courses.meta.nextPage;
  const previousPage = courses.meta.previousPage;

  return (
    <div>
      {courses.data.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8">
          {courses.data.map((course) => {
            return (
              <div
                key={course.id}
                className={cn(
                  "block rounded-lg border border-[#00000026] relative overflow-hidden",
                )}
              >
                <Link href={`/courses/${course.id}`}>
                  <div className="h-60 relative">
                    <Image
                      alt=""
                      src="/images/card-bg-2.webp"
                      width={500}
                      height={500}
                      className="h-full w-full rounded-md object-cover"
                    />
                    <div className="absolute bottom-0 flex border-b-[6px] border-primary items-center justify-between text-white bg-black bg-opacity-30 w-full px-4 py-2 text-sm">
                      <div>
                        {course.students_count} طالب
                        <Users size={16} className="inline ms-1" />
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="font-bold text-lg mb-1">{course.name}</h1>
                      <h2 className="text-base font-semibold">
                        {course.description}
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
                            href={`/teacher/courses/${course.id}/edit`}
                            className="cursor-pointer"
                          >
                            تعديل الدورة
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/teacher/courses/${course.id}/content/edit`}
                            className="cursor-pointer"
                          >
                            تعديل محتوي الدورة
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/teacher/courses/${course.id}/quizzes`}
                            className="cursor-pointer"
                          >
                            الامتحانات
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/teacher/courses/${course.id}/choose-lecture`}
                            className="cursor-pointer"
                          >
                            اضافة امتحان جديد
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setDeleteOpen(true);
                          }}
                        >
                          حذف الدورة
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
                                  DeleteCourse(course.id);
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
                      href={`/teacher/courses/${course.id}/content/create`}
                      className="w-full"
                    >
                      <Button className="text-base font-semibold rounded-[10px] w-full">
                        <Plus className="me-2 h-5 w-5 p-0.5 bg-white/30 rounded-full" />
                        اضافة حصة جديدة
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="absolute right-0 top-0 h-16 w-16">
                  <div
                    className={cn(
                      "absolute transform rotate-45 text-center text-white font-semibold py-1 right-[-35px] top-[32px] w-[170px]",
                      course.IsActive ? "bg-green-600" : "bg-red-600",
                    )}
                  >
                    {course.IsActive ? "مفعل" : "غير مفعل"}
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
          <span className="text-primary">{courses.count} دورات</span>
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
                fill="#F65428"
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

export default TeacherCoursesContent;
