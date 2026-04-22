import AdminIntialCourseForm from "@/components/admin/courses/InIntialCourseForm";
import { getCourse } from "@/services/admin/courses";
import { Metadata } from "next";

type Props = {
  params: {
    id: string;
  };
};

export const metadata: Metadata = {
  title: "تعديل الدورة - Admin",
  description: "تعديل الدورة - Admin في موقع صنعة",
};

async function AdminCourseEdit({ params }: Props) {
  const course = await getCourse(params.id);

  return (
    <div>
      <h1 className="text-2xl font-bold">تعديل الدورة</h1>
      <h2 className="text-[#121212B2]/70 text-lg font-semibold mb-4">
        من فضلك قم بمليء جميع تفاصيل المادة
      </h2>
      <AdminIntialCourseForm intialValues={course} />
    </div>
  );
}

export default AdminCourseEdit;
