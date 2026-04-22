import ParentLoginForm from "@/components/parent/loginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول - ولي امر",
  description: "تسجيل الدخول - ولي امر في موقع صنعة",
};

type Props = {};

function ParentLogin({}: Props) {
  return <ParentLoginForm />;
}

export default ParentLogin;
