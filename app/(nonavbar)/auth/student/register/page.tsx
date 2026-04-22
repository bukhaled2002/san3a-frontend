import StudentRegisterForm from "@/components/student/registerForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "انشاء حساب جديد - طالب",
  description: "انشاء حساب جديد - طالب في موقع صنعة",
};

type Props = {};

function StudentRegister({}: Props) {
  return <StudentRegisterForm />;
}

export default StudentRegister;
