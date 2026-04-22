import AdminCreateQuizeFormMCQ from "@/components/admin/question-bank/AdminCreateQuizeFormMCQ";

export default function AddMCQ() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
          إضافة أسئلة MCQ جديدة
        </h1>
        <p className="text-tech-grey text-lg font-medium">
          قم بإضافة أسئلة الاختيار من متعدد إلى بنك الأسئلة
        </p>
      </div>
      <AdminCreateQuizeFormMCQ />
    </div>
  );
}
