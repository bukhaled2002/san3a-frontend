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
import { Loader2, MoreVertical, Edit, BookOpen, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { transformGoogleDriveUrl } from "@/lib/helper/ExtractImg";
import { getBooks, deleteBook } from "@/services/admin/books";

type Props = {};

function AdminBooksContent({}: Props) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  
  const page = searchParams.get("page");
  const { data: books } = useQuery({
    queryKey: ["books-admin", page],
    queryFn: () => getBooks(page || "1"),
  });

  const { mutate: DeleteBook, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteBook(id),
    onSuccess: () => {
      toast({
        title: "تم حذف الكتاب بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["books-admin"] });
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

  if (!books)
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-primary" size={50} />
      </div>
    );

  const currentPage = books.meta.currentPage;
  const totalPages = books.meta.totalPages;
  const nextPage = books.meta.nextPage;
  const previousPage = books.meta.previousPage;

  return (
    <div>
      {books.data.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.data.map((book) => (
            <div
              key={book.id}
              className="group block rounded-xl border border-primary/20 bg-card/40 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 shadow-lg"
            >
              <div className="h-60 relative overflow-hidden">
                <Image
                  alt={book.name}
                  src={
                    book.img_url
                      ? transformGoogleDriveUrl(book.img_url)
                      : "/images/card-bg-2.webp"
                  }
                  width={500}
                  height={500}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                   <div className="bg-primary/20 backdrop-blur-md border border-primary/10 p-2 rounded-lg">
                      <BookOpen size={16} className="text-primary" />
                   </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h1 className="font-bold text-lg text-white group-hover:text-primary transition-colors line-clamp-1">
                      {book.name}
                    </h1>
                    <h2 className="text-sm font-medium text-tech-grey line-clamp-2">
                      {book.description}
                    </h2>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-8 h-8 p-0 text-tech-grey hover:text-primary hover:bg-white/5 shrink-0">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-primary/20 text-white min-w-[160px]">
                      <DropdownMenuLabel className="text-tech-grey text-xs">العمليات</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/books/${book.id}/edit`} className="cursor-pointer focus:bg-primary/10 focus:text-primary">
                          <Edit className="me-2 h-4 w-4" />
                          تعديل الكتاب
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer"
                        onClick={() => {
                          setSelectedBookId(book.id);
                          setDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="me-2 h-4 w-4" />
                        حذف الكتاب
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-6">
                  <Link href={`/admin/books/${book.id}/edit`} className="w-full">
                    <Button className="text-sm font-bold rounded-lg w-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-background transition-all shadow-sm">
                      <Edit className="me-2 h-4 w-4" />
                      التعديل علي الكتاب
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
          <div className="text-xl text-tech-grey font-bold">لا يوجد كتب تعليمية حالياً</div>
          <Link href="/admin/books/create" className="mt-4">
             <Button className="font-bold">أضف أول كتاب</Button>
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
              <div className="text-white neon-glow">{books.count} <span className="text-sm font-normal text-tech-grey">كتاب</span></div>
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
            <AlertDialogTitle className="text-start">هل انت متأكد من حذف الكتاب؟</AlertDialogTitle>
            <AlertDialogDescription className="text-tech-grey text-start">
              هذا الإجراء سيؤدي لحذف الكتاب نهائياً ولا يمكن استرجاعه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-white/5 border-primary/10 text-white hover:bg-white/10">
              رجوع
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white border-none"
              onClick={() => selectedBookId && DeleteBook(selectedBookId)}
            >
              {isDeleting ? "جاري الحذف..." : "حذف نهائي"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AdminBooksContent;
