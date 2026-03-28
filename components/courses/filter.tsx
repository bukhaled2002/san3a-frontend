"use client";
import { cn } from "@/lib/utils";
import { GetClass } from "@/services/public/classes";
import { GetSubject } from "@/services/subjects";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeft } from "lucide-react";
import { GetTeacher } from "@/services/teacher";
import { Input } from "../ui/input";

type Props = {
  classes: GetClass[];
  subjects: GetSubject[];
  teachers: GetTeacher[];
};

function CoursesFilter({ classes, subjects, teachers }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  const updateURL = () => {
    let queryParams: Record<string, string> = {};

    if (name) {
      queryParams.name = name;
    }
    if (selectedClass) {
      queryParams.class = selectedClass;
    }
    if (selectedSubject) {
      queryParams.subject = selectedSubject;
    }

    if (selectedTeacher) {
      queryParams.teacher = selectedTeacher;
    }

    const queryString = new URLSearchParams(queryParams).toString();
    const newURL = `${pathname}?${queryString}`;
    router.push(newURL);
  };

  useEffect(() => {
    const nameQueryParam = searchParams.get("name");
    const classQueryParam = searchParams.get("class");
    const subjectQueryParam = searchParams.get("subject");
    const teacherQueryParam = searchParams.get("teacher");
    if (nameQueryParam) {
      setName(nameQueryParam);
    }
    if (classQueryParam) {
      setSelectedClass(classQueryParam);
    }
    if (subjectQueryParam) {
      setSelectedSubject(subjectQueryParam);
    }
    if (teacherQueryParam) {
      setSelectedTeacher(teacherQueryParam);
    }
  }, []);

  useEffect(() => {
    updateURL();
  }, [name, selectedClass, selectedSubject, selectedTeacher]);

  return (
    <>
      <Accordion
        className="border rounded-[10px] border-border/20"
        type="single"
        defaultValue="classes"
        collapsible
      >
        <AccordionItem value="classes" className="border-0">
          <AccordionTrigger className="sm:text-lg font-bold text-foreground border-b border-border/20 py-[15px] sm:px-6 px-3 [&[data-state=open]>svg]:-rotate-90 [&[data-state=closed]]:border-b-0">
            بحث
            <ChevronLeft className="w-6 h-6 shrink-0 transition-transform duration-200 text-foreground/60" />
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
        className="border rounded-[10px] border-border/20"
        type="single"
        defaultValue="classes"
        collapsible
      >
        <AccordionItem value="classes" className="border-0">
          <AccordionTrigger className="sm:text-lg font-bold text-foreground border-b border-border/20 py-[15px] sm:px-6 px-3 [&[data-state=open]>svg]:-rotate-90 [&[data-state=closed]]:border-b-0">
            الصفوف الدراسية
            <ChevronLeft className="w-6 h-6 shrink-0 transition-transform duration-200 text-foreground/60" />
          </AccordionTrigger>
          <AccordionContent className="px-[22px] py-5 space-y-[14px] font-semibold">
            {classes?.map((course, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-x-3.5 text-foreground cursor-pointer whitespace-nowrap capitalize text-base",
                )}
                onClick={() =>
                  setSelectedClass((prev) =>
                    prev === course?.name ? null : course?.name,
                  )
                }
              >
                <Checkbox
                  id={course?.id}
                  checked={selectedClass === course?.name}
                />
                {course?.name}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion
        className="border rounded-[10px] border-border/20"
        type="single"
        defaultValue={searchParams.get("subject") ? "subjects" : ""}
        collapsible
      >
        <AccordionItem value="subjects" className="border-0">
          <AccordionTrigger className="sm:text-lg font-bold text-foreground border-b border-border/20 py-[15px] sm:px-6 px-3 [&[data-state=open]>svg]:-rotate-90 [&[data-state=closed]]:border-b-0">
            المواد
            <ChevronLeft className="w-6 h-6 shrink-0 transition-transform duration-200 text-foreground/60" />
          </AccordionTrigger>
          <AccordionContent className="px-[22px] py-5 space-y-[14px] font-semibold">
            {subjects?.map((subject, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-x-3.5 text-foreground cursor-pointer whitespace-nowrap capitalize text-base",
                )}
                onClick={() =>
                  setSelectedSubject((prev) =>
                    prev === subject?.name ? null : subject?.name,
                  )
                }
              >
                <Checkbox
                  id={subject?.id}
                  checked={selectedSubject === subject?.name}
                />
                {subject?.name}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion
        className="border rounded-[10px] border-border/20"
        type="single"
        defaultValue={searchParams.get("teacher") ? "teachers" : ""}
        collapsible
      >
        <AccordionItem value="teachers" className="border-0">
          <AccordionTrigger className="sm:text-lg font-bold text-foreground border-b border-border/20 py-[15px] sm:px-6 px-3 [&[data-state=open]>svg]:-rotate-90 [&[data-state=closed]]:border-b-0">
            المعلمين
            <ChevronLeft className="w-6 h-6 shrink-0 transition-transform duration-200 text-foreground/60" />
          </AccordionTrigger>
          <AccordionContent className="px-[22px] py-5 space-y-[14px] font-semibold">
            {teachers?.map((teacher, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-x-3.5 text-foreground cursor-pointer whitespace-nowrap capitalize text-base",
                )}
                onClick={() =>
                  setSelectedTeacher((prev) =>
                    prev === teacher?.fullName ? null : teacher?.fullName,
                  )
                }
              >
                <Checkbox
                  id={teacher?.id}
                  checked={selectedTeacher === teacher?.fullName}
                />
                {teacher?.fullName}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

export default CoursesFilter;
