import { Button } from "@/components/ui/button";
import { getStats } from "@/services/teacher/stats";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import Barchart from "@/components/teacher/barchart";
import { Users, BookOpen, Wallet, ChevronLeft, CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "الرئيسية - معلم",
  description: "الرئيسية - معلم في موقع صنعة",
};

type Props = {};

async function TeacherHome({}: Props) {
  const stats = await getStats();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white neon-glow">يسعدنا رؤيتك مرة أخرى</h1>
          <p className="text-tech-grey text-sm mt-1">نظرة عامة على نشاطك التعليمي وأداء طلابك</p>
        </div>
        <div className="text-tech-grey text-xs font-bold uppercase tracking-widest bg-card/30 px-4 py-2 rounded-full border border-primary/10">
          لوحة تحكم <span className="text-primary mx-1">/</span> المعلم
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="group relative bg-card/40 backdrop-blur-md border border-primary/10 rounded-2xl p-6 transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col justify-between h-full space-y-4">
            <h2 className="text-tech-grey text-sm font-bold uppercase tracking-wider">
              عدد الطلاب
            </h2>
            <div className="text-white font-bold text-4xl neon-glow">
              {stats.students}
            </div>
            <div className="h-1 w-12 bg-primary/30 rounded-full group-hover:w-full transition-all duration-500" />
          </div>
          <div className="absolute top-6 end-6 p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-all">
            <Users size={28} />
          </div>
        </div>

        <div className="group relative bg-card/40 backdrop-blur-md border border-primary/10 rounded-2xl p-6 transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col justify-between h-full space-y-4">
            <h2 className="text-tech-grey text-sm font-bold uppercase tracking-wider">
              عدد الكورسات
            </h2>
            <div className="text-white font-bold text-4xl neon-glow">
              {stats.courses}
            </div>
            <div className="h-1 w-12 bg-primary/30 rounded-full group-hover:w-full transition-all duration-500" />
          </div>
          <div className="absolute top-6 end-6 p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-all">
            <BookOpen size={28} />
          </div>
        </div>

        <div className="group relative bg-card/40 backdrop-blur-md border border-primary/10 rounded-2xl p-6 transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col justify-between h-full space-y-4">
            <h2 className="text-tech-grey text-sm font-bold uppercase tracking-wider">
              اجمالي الربح
            </h2>
            <div className="text-white font-bold text-3xl neon-glow">
              {stats.totalPayment} <span className="text-sm font-normal text-tech-grey ms-1">جنيه</span>
            </div>
            <div className="h-1 w-12 bg-primary/30 rounded-full group-hover:w-full transition-all duration-500" />
          </div>
          <div className="absolute top-6 end-6 p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-all">
            <Wallet size={28} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-3 bg-card/40 backdrop-blur-md border border-primary/10 rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <h1 className="text-white text-lg font-bold flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full shadow-neon-glow" />
              توزيع الطلاب على الكورسات
            </h1>
          </div>
          <div className="p-8 h-[400px]">
            <Barchart data={stats.studentsCountInCourses} />
          </div>
        </div>

        {/* Recent Actions Section */}
        <div className="lg:col-span-2 bg-card/40 backdrop-blur-md border border-primary/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <h1 className="text-white text-lg font-bold">عمليات الشحن الحديثة</h1>
            <Link href="/teacher/charge-requests">
              <Button variant="ghost" className="text-primary hover:bg-primary/10 font-bold border border-primary/20 transition-all rounded-xl">
                رؤية الكل
                <ChevronLeft size={16} className="ms-1" />
              </Button>
            </Link>
          </div>
          <div className="p-8 flex flex-col items-center justify-center h-[340px] text-center space-y-4 opacity-50">
             <div className="p-6 rounded-full bg-primary/5 border border-primary/10">
               <CreditCard size={48} className="text-primary" />
             </div>
             <p className="text-tech-grey font-medium">سيتم عرض قائمة بآخر عمليات الشحن هنا</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherHome;
