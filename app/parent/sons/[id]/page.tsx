import SonQuizesTable from "@/components/parent/sons/quizes/table";
import Transaction from "@/components/transaction";
import { getSon } from "@/services/parent/sons";
import { Users } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import { transformGoogleDriveUrl } from "@/lib/helper/ExtractImg";
export const metadata: Metadata = {
  title: "بيانات الطالب - ولي امر",
  description: "بيانات الطالب - ولي امر في موقع حصتي",
};

type Props = {
  params: {
    id: string;
  };
};

async function ParentSon({ params }: Props) {
  const son = await getSon(params.id);

  return (
    <>
      <h1 className="text-3xl font-bold mb-7">بيانات الطالب</h1>
      <div className="bg-white py-12 px-11 rounded-[12px] space-y-[61px]">
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-x-5">
            <Image
              src={
                transformGoogleDriveUrl(son.img_url) ||
                "/images/defaultAvatar.webp"
              }
              alt={son.firstName}
              width={100}
              height={100}
              className="rounded-full w-[100px] h-[100px] size-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-[#d4d4d4] mb-2 capitalize">
                {son.firstName + " " + son.lastName}
              </h1>
              <p className="text-lg text-[#121212B2]/70">
                {son.class?.name || "غير محدد"}
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
                {son.wallet.balance} ج.م
              </span>
            </div>
          </div>
        </section>
        <section className="mb-12">
          <div className="text-[22px] font-bold text-[#d4d4d4] mb-[14px]">
            الدورات الملتحق بها
          </div>
          {son.courses && son.courses.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {son.courses.map((course) => {
                return (
                  <div
                    key={course.id}
                    className={"block rounded-lg border border-[#00000026] p-2"}
                  >
                    <div className="h-60 relative">
                      <Image
                        alt=""
                        src="/images/card-bg-2.webp"
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
                          <div>% {course.progress.percentage}</div>
                        </div>
                        <progress
                          id="file"
                          value={course.progress.percentage ?? 0}
                          max="100"
                          className="mt-[6px] w-full h-[6px] [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-primary/40 [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary"
                        />
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
          {son.transactions && son.transactions?.length > 0 ? (
            <div className="border-[1.04px] border-[#00000026] pb-7 px-[25px] rounded-[10px] space-y-[25px] divide-y-2">
              {son.transactions?.map((transaction) => (
                <Transaction transaction={transaction} key={transaction.id} />
              ))}
            </div>
          ) : (
            <div className="text-lg text-[#121212B2] font-semibold leading-[27px]">
              لا توجد عمليات
            </div>
          )}
        </section>
        <section className="mb-12">
          <div className="text-[22px] font-bold text-[#d4d4d4] mb-[14px]">
            الأختبارات
          </div>
          {son.quizez && son.quizez?.length > 0 ? (
            <SonQuizesTable quizes={son.quizez} />
          ) : (
            <div className="text-lg text-[#121212B2] font-semibold leading-[27px]">
              لا توجد اختبارات
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default ParentSon;
