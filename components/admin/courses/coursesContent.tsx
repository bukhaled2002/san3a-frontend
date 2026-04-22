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
import { deleteCourse, getCourses } from "@/services/admin/courses";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Loader2, MoreVertical, Plus, Users, BookOpen, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { transformGoogleDriveUrl } from "@/lib/helper/ExtractImg";

type Props = {};

function AdminCoursesContent({}: Props) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const page = searchParams.get("page");
  const { data: courses } = useQuery({
    queryKey: ["courses-admin", page],
    queryFn: () => getCourses(page || "1"),
  });

  const { mutate: DeleteCourse, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => {
      toast({
        title: "تم حذف الدورة بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["courses-admin"] });
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={50} />
      </div>
    );

  const currentPage = courses.meta.currentPage;
  const totalPages = courses.meta.totalPages;
  const nextPage = courses.meta.nextPage;
  const previousPage = courses.meta.previousPage;

  return (
    <div>
      {courses.data.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.data.map((course) => (
            <div
              key={course.id}
              className="group block rounded-xl border border-primary/20 bg-card/40 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 shadow-lg"
            >
              <div className="h-56 relative overflow-hidden">
                <Image
                  alt={course.name}
                  src={
                    course.img_url
                      ? transformGoogleDriveUrl(course.img_url)
                      : "/images/defaultAvatar.webp"
                  }
                  width={500}
                  height={500}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute bottom-0 flex border-b-[4px] border-primary items-center justify-between text-white w-full px-5 py-3 text-sm font-bold backdrop-blur-md bg-black/20">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-primary" />
                    <span>{course.students_count} طالب</span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h1 className="font-bold text-lg text-white group-hover:text-primary transition-colors line-clamp-1">
                      {course.name}
                    </h1>
                    <h2 className="text-sm font-medium text-tech-grey line-clamp-2">
                      {course.description}
                    </h2>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-8 h-8 p-0 text-tech-grey hover:text-primary hover:bg-white/5 shrink-0">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-primary/20 text-white min-w-[180px]">
                      <DropdownMenuLabel className="text-tech-grey text-xs">العمليات</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/courses/${course.id}/edit`} className="cursor-pointer focus:bg-primary/10 focus:text-primary">
                          تعديل الدورة
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/courses/${course.id}/content/edit`} className="cursor-pointer focus:bg-primary/10 focus:text-primary">
                          تعديل محتوي الدورة
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/courses/${course.id}/choose-lecture`} className="cursor-pointer focus:bg-primary/10 focus:text-primary">
                          اضافة امتحان جديد
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/courses/${course.id}/quizs`} className="cursor-pointer focus:bg-primary/10 focus:text-primary">
                          الامتحانات
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/courses/${course.id}/qr-codes`} className="cursor-pointer focus:bg-primary/10 focus:text-primary">
                          رموز الكيو أر
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer"
                        onClick={() => {
                          setSelectedCourseId(course.id);
                          setDeleteOpen(true);
                        }}
                      >
                        حذف الدورة
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-6">
                  <Link href={`/admin/courses/${course.id}/content/create`} className="w-full">
                    <Button className="text-sm font-bold rounded-lg w-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-background transition-all shadow-sm">
                      <Plus className="me-2 h-4 w-4" />
                      اضافة حصة جديدة
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="absolute right-0 top-0 h-16 w-16 pointer-events-none">
                <div
                  className={cn(
                    "absolute transform rotate-45 text-center text-white text-[10px] font-bold py-1 right-[-45px] top-[15px] w-[140px] shadow-sm",
                    course.IsActive ? "bg-primary text-background" : "bg-red-600"
                  )}
                >
                  {course.IsActive ? "مفعل" : "غير مفعل"}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-20 bg-card/20 rounded-3xl border border-primary/10 border-dashed">
          <BookOpen size={64} className="text-primary/20 mb-4" />
          <div className="text-xl text-tech-grey font-bold">لا يوجد دورات تعليمية حالياً</div>
          <Link href="/admin/courses/create" className="mt-4">
             <Button className="font-bold">ابدأ بإضافة أول دورة</Button>
          </Link>
        </div>
      )}

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 bg-card/30 backdrop-blur-sm border border-primary/10 p-6 rounded-2xl">
         <div className="flex items-center gap-4 text-xl font-bold">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <BookOpen size={24} />
            </div>
            <div>
              <div className="text-tech-grey text-sm uppercase tracking-widest font-bold">اجمالي العدد</div>
              <div className="text-white neon-glow">{courses.count} <span className="text-sm font-normal text-tech-grey">دورة تعليمية</span></div>
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

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-card border-primary/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-start">هل انت متأكد من حذف الدورة؟</AlertDialogTitle>
            <AlertDialogDescription className="text-tech-grey text-start">
              هذا الإجراء لا يمكن التراجع عنه وسيؤدي لحذف كافة البيانات المرتبطة بها.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-white/5 border-primary/10 text-white hover:bg-white/10">
              رجوع
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white border-none"
              onClick={() => selectedCourseId && DeleteCourse(selectedCourseId)}
            >
              {isDeleting ? "جاري الحذف..." : "حذف نهائي"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AdminCoursesContent;
