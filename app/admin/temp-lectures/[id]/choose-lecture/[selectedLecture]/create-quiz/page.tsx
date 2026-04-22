import AdminCreateQuizeForm from "@/components/admin/courses/quizes/createQuizForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "اضافة امتحان جديد - Admin",
  description: "اضافة امتحان جديد - Admin في موقع صنعة",
};

type Props = {
  params: {
    id: string;
    selectedLecture: string;
  };
};

function AdminCreateQuiz({ params }: Props) {
  const courseId = params.id;
  const lectureId = params.selectedLecture;
  return <AdminCreateQuizeForm courseId={courseId} lectureId={lectureId} />;
}

export default AdminCreateQuiz;
