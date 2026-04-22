import { Metadata } from "next";
import AdminInitialEditBookForm from "@/components/admin/books/EditBookForm";
import { getbook } from "@/services/admin/books";
type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "تعديل الكتاب - Admin",
  description: "تعديل الكتاب - Admin في موقع صنعة",
};

async function AdminBookEdit({ params }: Props) {
  const { id } = await params;
  const book = await getbook(id);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
          تعديل بيانات الكتاب
        </h1>
        <p className="text-tech-grey text-lg font-medium">
          تعديل المعلومات الأساسية وفصول الكتاب التعليمي
        </p>
      </div>
      <AdminInitialEditBookForm intialValues={book} />
    </div>
  );
}

export default AdminBookEdit;
