"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCourse, getCourseById } from "@/services/public/courses";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export function ExamsList({ courseId }: { courseId: string }) {
// const [course, setCourse] = useState([])

  const router = useRouter();

  // useEffect(() => {
  //   const fetchCourse = async () => {
  //     const res = await getCourse(courseId);
  //     setCourse(res);
  //   };
  //   fetchCourse();
  // }, []);

  const {
    data: course,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["teacher-course", courseId],
    queryFn: () => getCourseById(courseId),
  });

  const chapters = course?.chapters || [];
  const combinedArray = chapters.flatMap((chapter) =>
    chapter.lectures.flatMap((lecture) => [
      ...(lecture.quizizz || []).map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        type: "MCQ",
      })),
      ...(lecture.QuizEssay || []).map((quizEssay) => ({
        id: quizEssay.id,
        title: quizEssay.title,
        type: "ESSAY",
      })),
      ...(lecture.Exam || []).map((exam) => ({
        id: exam.id,
        title: exam.title,
        type: "EXAM",
      })),
    ])
  );

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-secondary" size={50} />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>حدث خطأ في جلب البيانات.</p>
      </div>
    );

    console.log(course);

  return (
    <div className="rounded-md border">
      <Table dir="rtl">
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">عنوان الاختبار</TableHead>
            <TableHead className="text-right">نوع الامتحان</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {combinedArray.map((exam) => (
            <TableRow key={exam.id}>
              <TableCell>{exam.title}</TableCell>
              <TableCell>
                <div
                  className={`px-2 py-1 rounded-md w-fit ${
                    exam.type === "MCQ"
                      ? "bg-blue-500 text-white"
                      : exam.type === "ESSAY"
                      ? "bg-orange-500 text-white"
                      : exam.type === "EXAM"
                      ? "bg-purple-500 text-white"
                      : ""
                  }`}
                >
                  {exam.type === "MCQ" && "الامتحان المتعدد الاختياري"}
                  {exam.type === "ESSAY" && "الامتحان المقالي"}
                  {exam.type === "EXAM" && "الامتحان الاختباري"}
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() =>
                    router.push(
                      `/teacher/courses/${courseId}/quizzes/${exam.id}`
                    )
                  }
                  className="text-secondary hover:bg-secondary/5"
                >
                  عرض التفاصيل
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
