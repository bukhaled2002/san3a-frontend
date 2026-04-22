import ParentRegisterForm from "@/components/parent/registerForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "انشاء حساب جديد - ولي امر",
  description: "انشاء حساب جديد - ولي امر في موقع صنعة",
};

type Props = {};

function ParentRegister({}: Props) {
  return <ParentRegisterForm />;
}

export default ParentRegister;
