import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "بنك الاسئلة - Admin",
  description: "بنك الاسئلة - Admin في موقع صنعة",
};

export default function QuestionBank() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-white tracking-tight">
          بنك <span className="text-primary neon-glow">الأسئلة</span>
        </h1>
        <p className="text-tech-grey text-xl max-w-md mx-auto">
          اختر نوع الأسئلة التي ترغب في إدارتها أو إضافتها إلى المنصة
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full max-w-4xl px-6">
        <Link href="/admin/question-bank/mcq" className="w-full sm:w-1/2 group">
          <div className="h-64 bg-card/40 backdrop-blur-md border border-primary/10 rounded-3xl p-8 flex flex-col items-center justify-center gap-6 hover:border-primary/50 hover:bg-card/60 transition-all duration-500 shadow-2xl relative overflow-hidden group-hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] group-hover:bg-primary/10 transition-all" />
            <div className="text-6xl font-black text-primary/20 group-hover:text-primary/40 transition-all">MCQ</div>
            <div className="text-2xl font-bold text-white">أسئلة الاختيار من متعدد</div>
            <Button size="lg" className="w-full font-bold shadow-neon-glow rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
              دخول البنك
            </Button>
          </div>
        </Link>

        <Link href="/admin/question-bank/essay" className="w-full sm:w-1/2 group">
          <div className="h-64 bg-card/40 backdrop-blur-md border border-primary/10 rounded-3xl p-8 flex flex-col items-center justify-center gap-6 hover:border-primary/50 hover:bg-card/60 transition-all duration-500 shadow-2xl relative overflow-hidden group-hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] group-hover:bg-primary/10 transition-all" />
            <div className="text-6xl font-black text-primary/20 group-hover:text-primary/40 transition-all">ESSAY</div>
            <div className="text-2xl font-bold text-white">الأسئلة المقالية</div>
            <Button size="lg" className="w-full font-bold shadow-neon-glow rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
              دخول البنك
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
}
