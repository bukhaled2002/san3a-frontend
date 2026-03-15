import ChooseQuiz from "@/components/admin/courses/quizes/ChooseQuiz";
import AdminCreateQuizeForm from "@/components/admin/courses/quizes/createQuizForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "اضافة امتحان جديد - Admin",
  description: "اضافة امتحان جديد - Admin في موقع حصتي",
};

type Props = {
  params: Promise<{
    id: string;
    selectedLecture: string;
  }>;
};

async function AdminCreateQuiz({ params }: Props) {
  const { id: courseId, selectedLecture: lectureId } = await params;
  return (
    <>
      {/* <AdminCreateQuizeForm courseId={courseId} lectureId={lectureId} /> */}
      <ChooseQuiz lectureId={lectureId} courseId={courseId} />
    </>
  );
}

export default AdminCreateQuiz;
