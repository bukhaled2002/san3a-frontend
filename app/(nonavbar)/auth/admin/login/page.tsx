import AdminLoginForm from "@/components/admin/loginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول - Admin",
  description: "تسجيل الدخول - Admin في موقع صنعة",
};

type Props = {};

function AdminLogin({}: Props) {
  return <AdminLoginForm />;
}

export default AdminLogin;
