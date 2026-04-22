import TeacherLoginForm from "@/components/teacher/loginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول - معلم",
  description: "تسجيل الدخول - معلم في موقع صنعة",
};

type Props = {};

function TeacherLogin({}: Props) {
  return <TeacherLoginForm />;
}

export default TeacherLogin;
