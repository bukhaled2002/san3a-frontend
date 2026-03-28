import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Error() {
  return (
    <div className=" h-full flex flex-col items-center justify-center container">
      <div className="relative">
        {/* <Image
          src="/images/404.webp"
          width={1006}
          height={350}
          alt="404"
          className="w-full h-auto mb-4"
        /> */}
        <div className="text-center">
          <h1 className="md:text-5xl sm:text-3xl text-2xl font-bold text-[#d4d4d4]">
            للأسف هذه الصفحة غير موجودة
          </h1>
          <p className="md:text-2xl text-lg font-semibold text-foreground/70 sm:my-5 my-2.5">
            يبدو ان هذه الصفحة قد تم نقلها او حذفت او غير موجودة اساسا
          </p>
          <div className="sm:w-3/5 w-full m-auto">
            <Link href="/" className="w-full">
              <Button className="w-full sm:text-[22px] sm:py-6 py-3 font-semibold">
                الذهاب للصفحة الرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
