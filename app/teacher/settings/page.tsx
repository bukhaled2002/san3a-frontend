import TeacherSettingsForm from "@/components/teacher/teacherSettingsForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "اعدادات الحساب - Teacher",
  description: "اعدادات الحساب - Teacher في موقع صنعة",
};

type Props = {};

function TeacherSettings({}: Props) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-7">اعدادات الحساب</h1>
      <TeacherSettingsForm />
    </div>
  );
}

export default TeacherSettings;
