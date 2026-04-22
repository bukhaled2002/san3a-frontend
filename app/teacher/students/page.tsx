import StudentsTable from "@/components/teacher/students/table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الطلاب - Teacher",
  description: "الطلاب - Teacher في موقع صنعة",
};

type Props = {};

async function TeacherStudents({}: Props) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white neon-glow">الطلاب</h1>
          <p className="text-tech-grey text-sm mt-1">عرض ومتابعة سجلات الطلاب المشتركين في دوراتك</p>
        </div>
      </div>
      <StudentsTable />
    </div>
  );
}

export default TeacherStudents;
