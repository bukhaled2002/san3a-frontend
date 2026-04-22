import TeacherCreateQuizForm from "@/components/teacher/courses/quizes/createQuizForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "اضافة امتحان جديد - Teacher",
  description: "اضافة امتحان جديد - Teacher في موقع صنعة",
};

type Props = {
  params: {
    id: string;
    selectedLecture: string;
  };
};

function TeacherCreateQuiz({ params }: Props) {
  const courseId = params.id;
  const lectureId = params.selectedLecture;
  return <TeacherCreateQuizForm courseId={courseId} lectureId={lectureId} />;
}

export default TeacherCreateQuiz;
