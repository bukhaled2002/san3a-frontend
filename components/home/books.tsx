import Link from "next/link";
import CoursesCarousel from "./CoursesCarousel";
import { getBooks } from "@/services/admin/books";
import BooksCarousel from "./BooksCarousel";

type Props = {};

async function Books({}: Props) {
  const books = await getBooks();
  return (
    <div className="container py-10 space-y-12">
      <div className="header flex items-center justify-between mb-8">
        <div className="title relative w-fit">
          <h1 className="sm:text-3xl text-2xl font-cairo font-black text-white uppercase tracking-tight">مكتبة صنعة</h1>
          <div className="title-underline" />
        </div>
        <Link href="/books" className="text-tech-grey hover:text-primary transition-colors font-bold sm:text-lg">
          عرض الكل
        </Link>
      </div>
      <BooksCarousel books={books} />
    </div>

  );
}

export default Books;
