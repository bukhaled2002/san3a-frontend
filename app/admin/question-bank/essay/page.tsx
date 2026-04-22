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
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
            بنك أسئلة Essay
          </h1>
          <p className="text-tech-grey text-sm mt-1">إدارة الأسئلة المقالية المتاحة في المنصة</p>
        </div>

        <Link href="/admin/question-bank/essay/add">
          <Button className="font-bold shadow-neon-glow rounded-xl h-12 px-6">
            اضافة ESSAY جديد
            <Plus className="ms-2 h-5 w-5" />
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
        {allEssay?.questions?.map((item: SingleEssayQuestion) => (
          <div key={item?.id} className="bg-card/40 backdrop-blur-md border border-primary/10 p-6 rounded-3xl shadow-xl hover:border-primary/30 transition-all group">
            <div className="flex items-start justify-between gap-4 mb-6">
              <h2 className="text-white font-bold text-lg leading-snug group-hover:text-primary transition-colors">
                {item?.question}
              </h2>
              {item?.attachment && (
                <Button size="sm" className="bg-primary/10 hover:bg-primary text-primary hover:text-background border border-primary/20" asChild>
                  <Link href={item?.attachment}>ملف</Link>
                </Button>
              )}
            </div>
            {/* Essay questions typically don't have predefined choices in the same way, but keeping the logic if needed */}
            {item?.choices && item.choices.length > 0 && (
              <div className="space-y-3">
                {item.choices.map((choice: SingleChoicesEssay) => (
                  <div
                    key={choice?.id}
                    className="px-4 py-2 rounded-xl text-sm font-medium border bg-primary/5 border-primary/10 text-tech-grey"
                  >
                    {choice?.answer}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
