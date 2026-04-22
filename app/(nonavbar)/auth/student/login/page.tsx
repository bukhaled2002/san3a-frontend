import StudentLoginForm from "@/components/student/loginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول - طالب",
  description: "تسجيل الدخول - طالب في موقع صنعة",
};

type Props = {};

function StudentLogin({}: Props) {
  return <StudentLoginForm />;
}

export default StudentLogin;
