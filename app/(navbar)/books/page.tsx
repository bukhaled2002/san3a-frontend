import CoursesFilter from "@/components/courses/filter";
import FiltersSidebar from "@/components/courses/filtersSidebar";
import { getClasses } from "@/services/public/classes";
import { getSubjects } from "@/services/subjects";
import { getTeachers } from "@/services/teacher";
import { getBooks } from "@/services/admin/books";
import { Metadata } from "next";
import BooksContent from "@/components/cards/booksContent";
import BooksFilter from "@/components/books/filter";
import BookFiltersSidebar from "@/components/books/filtersSidebar";
export const metadata: Metadata = {
  title: "الدورات",
  description: "الدورات في موقع صنعة",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function Books({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const classes = await getClasses();
  const subjects = await getSubjects();
  const teachers = await getTeachers();
  const currentPage = resolvedSearchParams["page"];
  const name = resolvedSearchParams["name"];
  const author = resolvedSearchParams["author"];
  const books = await getBooks(
    currentPage,
    name,
    author
  );

  return (
    <div className="container py-10 font-bold text-base space-y-10">
      <div className="title relative w-fit">
        <h1 className="sm:text-[26px] text-[22px] font-bold">كل الكتب</h1>
        <div className="title-underline" />
      </div>
      <BookFiltersSidebar
        classes={classes}
        subjects={subjects.data}
        teachers={teachers}
      />
      <div className="grid grid-cols-8 gap-x-6">
        <div className="col-span-2 space-y-5 lg:block hidden">
          <BooksFilter
          />
        </div>
        <div className="lg:col-span-6 col-span-8">
          <BooksContent books={books} />
        </div>
      </div>
    </div>
  );
}

export default Books;

