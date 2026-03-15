import ChooseLecture from "@/components/teacher/courses/quizes/choose-lecture";
import { getAllChapters } from "@/services/teacher/courses";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "اختيار الدرس - Teacher",
  description: "اختيار الدرس - Teacher في موقع حصتي",
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function SelectLecture({ params }: Props) {
  const queryClient = new QueryClient();
  const { id: courseId } = await params;
  await queryClient.prefetchQuery({
    queryKey: ["chapters", courseId],
    queryFn: () => getAllChapters(courseId as string),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChooseLecture courseId={courseId} />
    </HydrationBoundary>
  );
}

export default SelectLecture;
