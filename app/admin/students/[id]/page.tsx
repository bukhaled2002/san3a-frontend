import Transaction from "@/components/transaction";
import { getStudent } from "@/services/admin/students";
import { Clock, Users } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { transformGoogleDriveUrl } from "@/lib/helper/ExtractImg";
export const metadata: Metadata = {
  title: "الطالب - Admin",
  description: "الطالب - Admin في موقع حصتي",
};

type Props = {
  params: {
    id: string;
  };
};

async function AdminSingleStudent({ params }: Props) {
  const student = await getStudent(params.id);

  return (
    <>
      <h1 className="text-3xl font-bold mb-7">بيانات الطالب</h1>
      <div className="bg-white py-12 px-11 rounded-[12px] space-y-[61px]">
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-x-5">
            <Image
              src={
                transformGoogleDriveUrl(student.img_url?.trim()) ||
                "/images/defaultAvatar.webp"
              }
              alt={student.firstName}
              width={100}
              height={100}
              className="rounded-full w-[100px] h-[100px] size-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-[#d4d4d4] mb-2 capitalize">
                {student.firstName + " " + student.lastName}
              </h1>
              <p className="text-lg text-[#121212B2]/70">
                {student.class?.name || "غير محدد"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <Image
              src="/icons/chest-wallet.svg"
              width={28}
              height={28}
              alt="walletIcon"
            />
            <div className="inline-block font-semibold text-lg">
              الرصيد المتاح في حساب ايمن الأن هو
              <span className="text-primary font-bold">
                {" "}
                {student.wallet.balance} ج.م
              </span>
            </div>
          </div>
        </section>
        <section className="mb-12">
          <div className="text-[22px] font-bold text-[#d4d4d4] mb-[14px]">
            الدورات الملتحق بها
          </div>
          {student.courses.data && student.courses.data.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {student.courses.data.map((course) => {
                return (
                  <div
                    key={course.id}
                    className={"block rounded-lg border border-[#00000026] p-2"}
                  >
                    <div className="h-60 relative">
                      <Image
                        alt=""
                        src={
                          transformGoogleDriveUrl(course.img_url) ??
                          "/images/card-bg-2.webp"
                        }
                        width={500}
                        height={500}
                        className="h-full w-full rounded-md object-cover"
                      />
                      <div className="absolute bottom-0 flex border-b-[6px] border-primary items-center justify-between text-white bg-black bg-opacity-30 w-full px-4 py-2 text-sm">
                        <div>
                          {course.students} طالب
                          <Users size={16} className="inline ms-1" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-[#121212B2]/70">
                        <h1 className="font-bold text-lg mb-1">
                          {course.name}
                        </h1>
                        <h2 className="text-base font-semibold">
                          {course.description}
                        </h2>
                      </div>
                      <div className="text-[#F65428] font-bold text-sm mt-2">
                        <div className="flex items-center justify-between">
                          <div>مستوي التقدم</div>
                          <div>% 80</div>
                        </div>
                        <progress
                          id="file"
                          value="80"
                          max="100"
                          className="mt-[6px] w-full h-[6px] [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-primary/40 [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary"
                        >
                          80%
                        </progress>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-lg text-[#121212B2] font-semibold leading-[27px]">
              لا يوجد دورات
            </div>
          )}
        </section>
        <section className="mb-12">
          <div className="text-[22px] font-bold text-[#d4d4d4] mb-[14px]">
            العمليات الاخيرة
          </div>
          {student.transactions && student.transactions?.length > 0 ? (
            <div className="border-[1.04px] border-[#00000026] pb-7 px-[25px] rounded-[10px] space-y-[25px] divide-y-2">
              {student.transactions?.map((transaction) => (
                <Transaction transaction={transaction} key={transaction.id} />
              ))}
            </div>
          ) : (
            <div className="text-lg text-[#121212B2] font-semibold leading-[27px]">
              لا يوجد عمليات
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default AdminSingleStudent;
