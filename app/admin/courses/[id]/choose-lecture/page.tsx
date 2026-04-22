import ChooseLecture from "@/components/admin/courses/quizes/choose-lecture";
import { getAllChapters } from "@/services/admin/courses";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "اختيار الدرس - Admin",
  description: "اختيار الدرس - Admin في موقع صنعة",
};

type Props = {
  params: {
    id: string;
  };
};

async function SelectLecture({ params }: Props) {
  const queryClient = new QueryClient();
  const courseId = params.id;
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
