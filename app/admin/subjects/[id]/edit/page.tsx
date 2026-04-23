import AdminSubjectForm from "@/components/admin/subjects/form";
import AdminTeachersForm from "@/components/admin/teachers/form";
import { getSubject } from "@/services/admin/subjects";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Metadata } from "next";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "تعديل المادة - Admin",
  description: "تعديل المادة - Admin في موقع صنعة",
};

async function AdminSubjectsEdit({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["subjects-admin", id],
    queryFn: () => (id ? getSubject(id) : null),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
            تعديل المادة
          </h1>
          <p className="text-tech-grey text-lg font-medium">
            قم بتحديث بيانات المادة الدراسية وتعديل المحتوى الخاص بها
          </p>
        </div>
        <AdminSubjectForm id={id} />
      </div>
    </HydrationBoundary>
  );
}

export default AdminSubjectsEdit;
