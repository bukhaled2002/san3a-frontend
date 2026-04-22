import AdminIntialBookForm from "@/components/admin/books/InIntialBookForm";

type Props = {};

function AdminCourseCreate({}: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
          اضافة كتاب جديد
        </h1>
        <p className="text-tech-grey text-lg font-medium">
          أدخل تفاصيل الكتاب التعليمي الجديد بدقة
        </p>
      </div>
      <AdminIntialBookForm />
    </div>
  );
}

export default AdminCourseCreate;
