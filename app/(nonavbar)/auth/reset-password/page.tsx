import ResetPasswordForm from "@/components/forgotPassword/restPasswordForm";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
};

export const metadata: Metadata = {
  title: "تغيير كلمة السر",
  description: "تغيير كلمة السر في موقع صنعة",
};

function ResetPassword({ searchParams }: Props) {
  const email = searchParams?.email as string;
  const otp = searchParams?.OTP as string;

  return <ResetPasswordForm email={email} otp={otp} />;
}

export default ResetPassword;

