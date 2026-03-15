import OtpForm from "@/components/forgotPassword/otpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تأكيد رمز التحقق",
  description: "تأكيد رمز التحقق لإعادة تعيين كلمة المرور في موقع حصتي",
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
};

function Otp({ searchParams }: Props) {
  const email = searchParams?.email as string;
  return <OtpForm email={email} />;
}

export default Otp;

