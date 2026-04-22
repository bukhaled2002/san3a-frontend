"use client";
import { GetCoursePaginated } from "@/services/public/courses";
import { Loader2 } from "lucide-react";
import Pagination from "../pagination";
import BookCard from "./BookCard";
import { GetBooksResponse } from "@/services/admin/books";

type Props = {
  books: GetBooksResponse;
};

function BooksContent({ books }: Props) {
  if (!books)
    return (
      <div className=" flex items-center justify-center">
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
        <>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 md:grid-cols-2 lg:gap-8">
            {books.data.map((book) => {
              return <BookCard book={book} key={book.id} />;
            })}
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
        </>
      ) : (
        <div className="flex items-center justify-center text-secondary font-bold text-lg">
          لا يوجد كتب
        </div>
      )}
    </div>
  );
}

export default BooksContent;
