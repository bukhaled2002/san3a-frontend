import ForgotPasswordForm from "@/components/forgotPassword/forgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "نسيت كلمة السر",
  description: "نسيت كلمة السر في موقع صنعة",
};
type Props = {};

function ForgotPassword({}: Props) {
  return <ForgotPasswordForm />;
}

export default ForgotPassword;
