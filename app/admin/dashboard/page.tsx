import Barchart from "@/components/admin/barchart";
import LatestChargeRequestsTable from "@/components/admin/home/table";
import { Button } from "@/components/ui/button";
import { getStats } from "@/services/admin/stats";
import { Book, BookOpen, Clock, UserCog } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {};

async function AdminHome({}: Props) {
  const stats = await getStats();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white neon-glow">
          يسعدنا رؤيتك مرة أخرى
        </h1>
        <div className="text-tech-grey text-sm font-medium">
          لوحة التحكم <span className="text-primary mx-2">/</span> الرئيسية
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 relative group hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/5 cursor-default h-[160px]">
          <div className="flex flex-col justify-between h-full">
            <h2 className="text-tech-grey text-sm font-bold uppercase tracking-wider">
              عدد الطلاب
            </h2>
            <div className="text-white font-bold text-4xl">
              {stats.students}
            </div>
            <div className="h-1 w-12 bg-primary/30 rounded-full group-hover:w-full transition-all duration-500" />
          </div>
          <div className="absolute top-6 end-6 p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-all">
            <UserCog size={24} />
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 relative group hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/5 cursor-default h-[160px]">
          <div className="flex flex-col justify-between h-full">
            <h2 className="text-tech-grey text-sm font-bold uppercase tracking-wider">
              عدد المحاضرين
            </h2>
            <div className="text-white font-bold text-4xl">
              {stats.teachers}
            </div>
            <div className="h-1 w-12 bg-primary/30 rounded-full group-hover:w-full transition-all duration-500" />
          </div>
          <div className="absolute top-6 end-6 p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-all">
            <BookOpen size={24} />
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 relative group hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/5 cursor-default h-[160px]">
          <div className="flex flex-col justify-between h-full">
            <h2 className="text-tech-grey text-sm font-bold uppercase tracking-wider">
              عدد الكورسات
            </h2>
            <div className="text-white font-bold text-4xl">{stats.courses}</div>
            <div className="h-1 w-12 bg-primary/30 rounded-full group-hover:w-full transition-all duration-500" />
          </div>
          <div className="absolute top-6 end-6 p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-all">
            <Clock size={24} />
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 relative group hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/5 cursor-default h-[160px]">
          <div className="flex flex-col justify-between h-full">
            <h2 className="text-tech-grey text-sm font-bold uppercase tracking-wider">
              اجمالي الربح
            </h2>
            <div className="text-white font-bold text-3xl">
              {stats.totalPayment}{" "}
              <span className="text-sm font-normal text-tech-grey ms-1">
                جنيه
              </span>
            </div>
            <div className="h-1 w-12 bg-primary/30 rounded-full group-hover:w-full transition-all duration-500" />
          </div>
          <div className="absolute top-6 end-6 p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-all">
            <Book size={24} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card/40 backdrop-blur-md border border-primary/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px]" />
          <h1 className="text-white text-xl font-bold mb-8 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-primary rounded-full shadow-neon-glow" />
            الصفوف الدراسية
          </h1>
          <div className="h-[400px]">
            <Barchart data={stats.classData} />
          </div>
        </div>

        <div className="bg-card/40 backdrop-blur-md border border-primary/10 rounded-3xl shadow-2xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 blur-[80px]" />
          <div className="flex items-center justify-between p-8 border-b border-white/5">
            <h1 className="text-white text-lg font-bold">عمليات الشحن</h1>
            <Link href="/admin/charge-requests">
              <Button
                variant="ghost"
                className="text-primary hover:bg-primary/10 font-bold border border-primary/20"
              >
                رؤية الكل
              </Button>
            </Link>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <LatestChargeRequestsTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
