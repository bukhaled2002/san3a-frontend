import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "بنك الاسئلة - Admin",
  description: "بنك الاسئلة - Admin في موقع حصتي",
};
export default function QuestionBank() {
  return (
    <>
      <div className="h-screen flex items-center justify-center gap-[16px]">
        <Button variant="secondary" className="text-white text-[32px]" asChild>
          <Link href="/admin/question-bank/mcq">MCQ</Link>
        </Button>
        <Button variant="secondary" className="text-white text-[32px]" asChild>
          <Link href="/admin/question-bank/essay">Essay</Link>
        </Button>
      </div>
    </>
  );
}
