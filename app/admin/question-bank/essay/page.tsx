import { Button } from "@/components/ui/button";
import {
  getEssay,
  SingleChoicesEssay,
  SingleEssayQuestion,
} from "@/services/admin/essay";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function MCQ() {
  const allEssay = await getEssay();
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-x-5">
          <h1 className="text-3xl font-bold">ESSAY</h1>
        </div>

        <Button variant="secondary" size="sm" className="text-white" asChild>
          <Link href="/admin/question-bank/essay/add">
            اضافة ESSAY جديد
            <Plus className="ms-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-[24px]">
        {allEssay?.questions?.map((item: SingleEssayQuestion) => (
          <div key={item?.id} className="border rounded-[8px] p-[12px]">
            <div className="flex items-center justify-between gap-[8px]">
              <h2 className="text-foreground font-[600] text-[18px]">
                {item?.question}
              </h2>
              {item?.attachment && (
                <Button variant="secondary" className="text-white" asChild>
                  <Link href={item?.attachment}>ملف</Link>
                </Button>
              )}
            </div>
            {item?.choices?.map((choice: SingleChoicesEssay) => (
              <div
                key={choice?.id}
                className={`${
                  choice?.isCorrect ? "text-green-600" : "text-red-500"
                }`}
              >
                {choice?.answer}
              </div>
            ))}
            <div className="flex items-center gap-[8px] mt-[16px]"></div>
          </div>
        ))}
      </div>
    </>
  );
}
