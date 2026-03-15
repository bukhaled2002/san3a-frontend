import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { RefreshCcw, BookText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { transformGoogleDriveUrl } from "@/lib/helper/ExtractImg";
import { getbook } from "@/services/admin/books";
import { auth } from "@/auth";
import { useQuery } from "@tanstack/react-query";
import { getUserByToken } from "@/services/profile";


type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getbook(id);
  return {
    title: `${book.name}`,
    description: `${book.description}`,
  };
}

async function Course({ params }: Props) {
  const { id } = await params;
  const book = await getbook(id);
  const prefilledFormUrl = `https://docs.google.com/forms/d/e/1FAIpQLSfYsa5jejp6y-QqBCs3SsTE-trwMTFvnRLDjM8zxdIbwyXQKQ/viewform?usp=pp_url&entry.1889932225=zeyad&entry.1964648609=${book.author}&entry.283677980=01027639003&entry.956443571=top+el+top`;

  return (
    <>
      <section className="overflow-hidden bg-[#5949be] relative z-10 sm:py-16 py-10 text-white">
        <div className="container flex gap-5 lg:flex-row flex-col items-center justify-between">
          <div className="w-full">
            <h1 className="text-xl mb-[16px] lg:text-[34px] font-bold max-w-96 !leading-[51px]">
              {book.name}
            </h1>
            <p className="text-white/80 text-lg leading-[27px] sm:mb-10 mb-5">
              {book.description}
            </p>
            <div className="flex items-center md:gap-x-20 gap-x-10 mb-11">
              <div className="text-base font-normal">
                <BookText  size={20} className="inline-block me-1" />{" "}
                يحتوي علي {book.bookChapters.length} فصل
              </div>
              <div className="text-base font-normal">
                <RefreshCcw size={20} className="inline-block me-1" /> اخر تحديث
                للكتاب {new Date(book.updatedAt).toLocaleDateString("en-US")}
              </div>
            </div>
            {book.bookChapters.length === 0 ? (
              <div className="bg-gray-100 text-primary w-full py-4 font-bold text-xl text-center rounded-lg">
                لم يتم اضافة محتوي لهذا الكتاب
              </div>
            ) :  (
              <Link target="_blank" href={prefilledFormUrl}>
              <Button className="bg-primary text-white w-full sm:py-6 py-3 font-bold sm:text-xl">
                شراء مقابل {book.price} جنيه مصري
              </Button>
            </Link>
                  )}
          </div>
          <div className="relative sm:min-w-[500px] lg:max-w-[500px] w-full lg:max-h-[300px] sm:max-h-[400px] max-h-[300px] h-full border rounded-lg overflow-hidden ">
            <Image
              src={transformGoogleDriveUrl(book.img_url.trim())}
              className="rounded-lg object-cover object-[75%_25%] w-full"
              alt="hero"
              width={500}
              height={300}
            />
            <div className="absolute bottom-0 flex border-b-[6px] border-primary items-center justify-between text-white bg-black bg-opacity-30 w-full px-4 py-2 text-sm">
              من تأليف / {book.author}
            </div>
          </div>
        </div>
      </section>
      <section className="container py-10">
        <div className="title relative w-fit mb-8">
          <h1 className="sm:text-3xl text-xl font-bold mb-2">محتوي الكتاب</h1>
          <h3 className="sm:text-xl text-black/40">{book.bookChapters.length} فصول</h3>
        </div>
        {book.bookChapters.length > 0 ? (
          <Accordion type="multiple" className="border border-black/10">
            {book.bookChapters.map((chapter, index) => {
              return (
                <AccordionItem
                  key={index}
                  value={chapter.title}
                  className="sm:px-5 px-2.5 py-0.5"
                >
                  <AccordionTrigger className="font-bold text-xl [&[data-state=open]>img]:rotate-180">
                    {chapter.title}
                    <Image
                      src="/icons/accordion-caret.svg"
                      className="h-7 w-7 shrink-0 bg-gray-100 p-2 rounded-full transition-transform duration-200"
                      alt="caret"
                      width={10}
                      height={10}
                    />
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                        <div
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-x-2 text-gray-400 title text-base font-semibold">
                            {chapter.content}
                          </div>
                        </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <div>لم يتم اضافة محتوي لهذه الدورة</div>
        )}
      </section>
    </>
  );
}

export default Course;
