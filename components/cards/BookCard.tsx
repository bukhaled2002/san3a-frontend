import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { transformGoogleDriveUrl } from "@/lib/helper/ExtractImg";
import { GetBook } from "@/services/admin/books";

type Props = {
  book: GetBook;
};

function BookCard({ book }: Props) {
    const bookImg = transformGoogleDriveUrl(book.img_url?.trim() !== null || ""
    ? book.img_url?.trim()
    : "/images/placeholder.png"
)
  console.log('course',book)
  return (
    <div className="bg-card rounded-none border border-primary/10 hover:border-primary/40 transition-all duration-300 group hover:shadow-neon-glow flex flex-col h-full overflow-hidden">
      <div className="h-48 overflow-hidden">
        <Link href={`/books/${book.id}`}>
          <Image
            src={bookImg}
            width={500}
            height={500}
            className="size-full max-h-[201px] rounded-none object-cover transition-transform duration-500 group-hover:scale-110"
            alt="Book Image"
          />
        </Link>
      </div>

      <div className="p-5 flex flex-col justify-between items-start h-full">
        <div className="space-y-3 w-full">
          <h1 className="font-cairo font-black text-xl line-clamp-2 min-h-[3.5rem] text-white group-hover:text-primary transition-colors">{book.name}</h1>
          <div className="bg-background/50 p-2 border-r-2 border-primary">
            <h2 className="text-sm font-rajdhani font-bold text-tech-grey uppercase tracking-wider">
              BY: <span className="text-white">{book.author}</span>
            </h2>
          </div>
          <p className="text-sm text-tech-grey line-clamp-2">
            {book.description}
          </p>
        </div>
        <div className="mt-6 flex items-center justify-center w-full">
          <Link href={`/books/${book.id}`} className="w-full">
            <Button variant="outline" className="w-full border-primary/20 hover:bg-primary hover:text-background rounded-none">
              عرض الكتاب
            </Button>
          </Link>
        </div>
      </div>
    </div>

  );
}

export default BookCard;
