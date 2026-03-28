import { Button } from "@/components/ui/button";
import { getStats } from "@/services/teacher/stats";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import Barchart from "@/components/teacher/barchart";

export const metadata: Metadata = {
  title: "الرئيسية - معلم",
  description: "الرئيسية - معلم في موقع صنعة",
};

type Props = {};

async function TeacherHome({}: Props) {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">يسعدنا رؤيتك مرة أخرى</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-[14px] shadow-sm p-4 relative flex items-start justify-between flex-col w-full h-[161px] max-h-full">
          <h1 className="text-[#202224]/70 text-base font-semibold">
            عدد الطلاب
          </h1>
          <div className="text-[#202224] font-bold text-[28px]">
            {stats.students}
          </div>
          <Image
            src={"/icons/groupPic.svg"}
            className="absolute top-3 end-3"
            width={62}
            height={60}
            alt="groupImage"
          />
          <div>
            {/* <div className="flex items-center gap-x-1.5 font-semibold">
              <span className="text-[#00B69B] flex items-center gap-1">
                <TrendingUp size={20} />
                8.5%
              </span>
              <div className="text-[#606060]">زيادة عن شهر فبراير</div>
            </div> */}
          </div>
        </div>
        <div className="bg-white rounded-[14px] shadow-sm p-4 relative flex items-start justify-between flex-col w-full h-[161px] max-h-full">
          <h1 className="text-[#202224]/70 text-base font-semibold">
            عدد الكورسات
          </h1>
          <div className="text-[#202224] font-bold text-[28px]">
            {stats.courses}
          </div>
          <Image
            src={"/icons/groupPic.svg"}
            className="absolute top-3 end-3"
            width={62}
            height={60}
            alt="groupImage"
          />
          <div></div>
        </div>
        <div className="bg-white rounded-[14px] shadow-sm p-4 relative flex items-start justify-between flex-col w-full h-[161px] max-h-full">
          <h1 className="text-[#202224]/70 text-base font-semibold">
            اجمالي الربح
          </h1>
          <div className="text-[#202224] font-bold text-[28px]">
            {stats.totalPayment} جنيه
          </div>
          <Image
            src={"/icons/groupPic.svg"}
            className="absolute top-3 end-3"
            width={62}
            height={60}
            alt="groupImage"
          />
          <div></div>
        </div>
      </div>
      <div className="bg-white rounded-[25px] shadow-sm p-4 pb-10 h-[522px] max-h-full mb-10">
        <h1 className="text-[#202224] text-[22px] font-bold">
          الصفوف الدراسية
        </h1>
        <Barchart data={stats.studentsCountInCourses} />
      </div>
      <div className="bg-white rounded-[14px] shadow-sm col-span-5">
        <div className="flex items-center justify-between mb-5 px-8 py-6">
          <h1 className="text-[#202224] text-[22px] font-bold">
            عمليات الشحن الحديثة
          </h1>
          <Link href="/teacher/charge-requests">
            <Button className="bg-[#dad7f1] hover:bg-[#d1ccf7] text-[#4635B7] font-bold border border-[#4635b799]">
              رؤية الكل
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TeacherHome;
