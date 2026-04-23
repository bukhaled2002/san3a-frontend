import TeacherCreateQuizForm from "@/components/teacher/courses/quizes/createQuizForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "اضافة امتحان جديد - Teacher",
  description: "اضافة امتحان جديد - Teacher في موقع صنعة",
};

type Props = {
  params: Promise<{
    id: string;
    selectedLecture: string;
  }>;
};

async function TeacherCreateQuiz({ params }: Props) {
  const { id, selectedLecture } = await params;
  return <TeacherCreateQuizForm courseId={id} lectureId={selectedLecture} />;
}

export default TeacherCreateQuiz;
