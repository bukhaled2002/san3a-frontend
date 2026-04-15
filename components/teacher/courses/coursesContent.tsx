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
import { deleteCourse, getCourses } from "@/services/teacher/courses";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Clock, Loader2, MoreVertical, Plus, Users, Edit, Trash2, BookOpen, ClipboardList } from "lucide-react";
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
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

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
      <div className="flex items-center justify-center p-20">
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
              <div className="h-60 relative overflow-hidden">
                <Image
                  alt={course.name}
                  src="/images/card-bg-2.webp"
                  width={500}
                  height={500}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                    <Users size={14} className="text-primary" />
                    <span className="text-xs font-bold">{course.students_count} طالب</span>
                  </div>
                  <div className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold border",
                    course.IsActive 
                      ? "bg-green-500/20 border-green-500/30 text-green-400" 
                      : "bg-red-500/20 border-red-500/30 text-red-400"
                  )}>
                    {course.IsActive ? "نشط" : "غير نشط"}
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
                      <DropdownMenuLabel className="text-tech-grey text-xs">إدارة الدورة</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/teacher/courses/${course.id}/edit`} className="cursor-pointer focus:bg-primary/10 focus:text-primary">
                          <Edit className="me-2 h-4 w-4" />
                          تعديل الدورة
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/teacher/courses/${course.id}/content/edit`} className="cursor-pointer focus:bg-primary/10 focus:text-primary">
                          <BookOpen className="me-2 h-4 w-4" />
                          تعديل المحتوى
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/teacher/courses/${course.id}/quizzes`} className="cursor-pointer focus:bg-primary/10 focus:text-primary">
                          <ClipboardList className="me-2 h-4 w-4" />
                          الامتحانات
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer"
                        onClick={() => {
                          setSelectedCourseId(course.id);
                          setDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="me-2 h-4 w-4" />
                        حذف الدورة
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Link href={`/teacher/courses/${course.id}/content/create`} className="w-full">
                    <Button className="w-full font-bold shadow-neon-glow">
                      <Plus className="me-2 h-4 w-4" />
                      إضافة حصة جديدة
                    </Button>
                  </Link>
                  <Link href={`/teacher/courses/${course.id}/choose-lecture`} className="w-full">
                    <Button variant="outline" className="w-full font-bold border-primary/20 hover:bg-primary/10 text-primary">
                      <ClipboardList className="me-2 h-4 w-4" />
                      إضافة امتحان جديد
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-20 bg-card/20 rounded-3xl border border-primary/10 border-dashed">
          <BookOpen size={64} className="text-primary/20 mb-4" />
          <div className="text-xl text-tech-grey font-bold">لا يوجد دورات تعليمية حالياً</div>
          <Link href="/teacher/courses/create" className="mt-4">
             <Button className="font-bold shadow-neon-glow">أنشئ دورتك الأولى</Button>
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
            <AlertDialogTitle className="text-start">هل أنت متأكد من حذف هذه الدورة؟</AlertDialogTitle>
            <AlertDialogDescription className="text-tech-grey text-start">
              سيؤدي هذا الإجراء إلى حذف جميع محتويات الدورة والبيانات المرتبطة بها نهائياً.
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

export default TeacherCoursesContent;
