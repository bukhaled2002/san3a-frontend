import AdminTeachersForm from "@/components/admin/teachers/form";
import { getTeacher } from "@/services/teacher";
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
  title: "تعديل حساب المعلم - Admin",
  description: "تعديل حساب المعلم - Admin في موقع صنعة",
};

async function AdminTeacherEdit({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["teacher-admin", id],
    queryFn: () => (id ? getTeacher(id) : null),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
            تعديل حساب المعلم
          </h1>
          <p className="text-tech-grey text-lg font-medium">
            قم بتحديث بيانات المعلم وتفاصيل المادة الدراسية
          </p>
        </div>
        <AdminTeachersForm id={id} />
      </div>
    </HydrationBoundary>
  );
}

export default AdminTeacherEdit;
