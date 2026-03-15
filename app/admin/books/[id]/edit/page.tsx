import { Metadata } from "next";
import AdminInitialEditBookForm from "@/components/admin/books/EditBookForm";
import { getbook } from "@/services/admin/books";
type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "تعديل الدورة - Admin",
  description: "تعديل الدورة - Admin في موقع حصتي",
};

async function AdminBookEdit({ params }: Props) {
  const { id } = await params;
  const book = await getbook(id);
  console.log('book',book)
  return (
    <div>
      <h1 className="text-2xl font-bold">تعديل الكتاب</h1>
      <h2 className="text-[#121212B2]/70 text-lg font-semibold mb-4">
        من فضلك قم بمليء جميع تفاصيل الكتاب
      </h2>
      <AdminInitialEditBookForm intialValues={book} />
    </div>
  );
}

export default AdminBookEdit;
