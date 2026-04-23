import AdminCreateQuizeForm from "@/components/admin/courses/quizes/createQuizForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "اضافة امتحان جديد - Admin",
  description: "اضافة امتحان جديد - Admin في موقع صنعة",
};

type Props = {
  params: Promise<{
    id: string;
    selectedLecture: string;
  }>;
};

async function AdminCreateQuiz({ params }: Props) {
  const { id, selectedLecture } = await params;
  return <AdminCreateQuizeForm courseId={id} lectureId={selectedLecture} />;
}

export default AdminCreateQuiz;
