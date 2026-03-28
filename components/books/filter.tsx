"use client";
import { GetClass } from "@/services/public/classes";
import { GetSubject } from "@/services/subjects";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeft } from "lucide-react";
import { GetTeacher } from "@/services/teacher";
import { Input } from "../ui/input";

function BooksFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const updateURL = () => {
    let queryParams: Record<string, string> = {};

    if (name) {
      queryParams.name = name;
    }
    if (author) {
      queryParams.author = author;
    }

    const queryString = new URLSearchParams(queryParams).toString();
    const newURL = `${pathname}?${queryString}`;
    router.push(newURL);
  };

  useEffect(() => {
    const nameQueryParam = searchParams.get("name");
    const authorQueryParam = searchParams.get("author");
    if (nameQueryParam) {
      setName(nameQueryParam);
    }
    if (authorQueryParam) {
      setAuthor(authorQueryParam);
    }
  }, []);

  useEffect(() => {
    updateURL();
  }, [name, author]);

  return (
    <>
      <Accordion
        className="border rounded-[10px] border-[#0000001F]"
        type="single"
        defaultValue="classes"
        collapsible
      >
        <AccordionItem value="classes" className="border-0">
          <AccordionTrigger className="sm:text-lg font-bold text-[#d4d4d4] border-b border-[#0000001F] py-[15px] sm:px-6 px-3 [&[data-state=open]>svg]:-rotate-90 [&[data-state=closed]]:border-b-0">
            بحث
            <ChevronLeft className="w-6 h-6 shrink-0 transition-transform duration-200 text-[#12121299]" />
          </AccordionTrigger>
          <AccordionContent className="sm:px-[22px] px-3 py-5 space-y-[14px] font-semibold">
            <Input
              type="text"
              value={name ?? ""}
              onChange={(e) => setName(e.target.value)}
              className="h-10 border-gray-500"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion
        className="border rounded-[10px] border-[#0000001F]"
        type="single"
        defaultValue={searchParams.get("teacher") ? "teachers" : ""}
        collapsible
      >
        <AccordionItem value="teachers" className="border-0">
          <AccordionTrigger className="sm:text-lg font-bold text-[#d4d4d4] border-b border-[#0000001F] py-[15px] sm:px-6 px-3 [&[data-state=open]>svg]:-rotate-90 [&[data-state=closed]]:border-b-0">
            المؤلفين
            <ChevronLeft className="w-6 h-6 shrink-0 transition-transform duration-200 text-[#12121299]" />
          </AccordionTrigger>
          <AccordionContent className="px-[22px] py-5 space-y-[14px] font-semibold">
            <Input
              type="text"
              value={author ?? ""}
              onChange={(e) => setAuthor(e.target.value)}
              className="h-10 border-gray-500"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

export default BooksFilter;
