import PayForm from "@/components/student/payForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { checkOut } from "@/services/public/checkout";
import Image from "next/image";
import Link from "next/link";
import { transformGoogleDriveUrl } from "@/lib/helper/ExtractImg";
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const checkOutDetails = await checkOut(id);

  return {
    title: `${checkOutDetails.name}`,
    description: `${checkOutDetails.description}`,
  };
}

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function CheckOut({ params }: Props) {
  const { id } = await params;
  const checkOutDetails = await checkOut(id);

  return (
    <div className="container py-8 font-bold text-base">
      <div className="lg:grid grid-cols-4 gap-x-[54px] gap-y-[22px] lg:space-y-0 space-y-6">
        <div className="flex items-center col-span-2 border-[1.042px] border-black/20 shadow-sm rounded-[10px] py-[10px] sm:ps-[12px] sm:pe-[52px] px-3">
          <div className="flex sm:flex-row flex-col w-full items-start gap-[19px]">
            <Image
              src={transformGoogleDriveUrl(checkOutDetails.img_url)}
              width={175}
              height={138}
              className="rounded-lg sm:w-[175px] sm:h-[138px] sm:size-full w-full h-[300px] object-cover"
              alt={checkOutDetails.name}
            />
            <div className="flex-1 flex flex-col justify-between h-[138px] max-h-full">
              <h1 className="text-[#121212] text-lg font-bold">
                {checkOutDetails.name}
              </h1>
              <div className="text-[#121212B2] font-semibold text-lg">
                {checkOutDetails.count_lectures} درس
                <div className="w-2 h-2 rounded-full bg-[#121212B2] inline-block mx-2" />
                {checkOutDetails.num_hours} ساعة
              </div>
              <div className="text-xl font-bold text-[#121212]">
                {checkOutDetails.price_after_discount} جنيه
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 col-start-3 border-[1.042px] border-black/20 shadow-sm rounded-[10px] py-[26px] px-3 sm:px-[42px]">
          <div className="flex items-center justify-between gap-x-[19px] mb-6">
            <h1 className="text-[#121212] sm:text-[26px] text-xl font-bold ">
              الرصيد المتاح
            </h1>
            <div className="text-primary font-bold sm:text-3xl text-2xl">
              {checkOutDetails.wallet.balance} جنيه
            </div>
          </div>
          <Link className=" sm:w-fit w-full" href="/wallet">
            <Button className="px-6 text-lg rounded-lg sm:w-fit w-full">شحن الرصيد</Button>
          </Link>
        </div>
        <div className="col-span-2 row-start-2 ">
          <div className="border-[1.042px] border-black/20 shadow-sm rounded-[10px] py-[23px] sm:px-[41px] px-3 mb-[22px] space-y-[20px]">
            <div className="flex items-center justify-between">
              <div className="sm:text-[22px] font-semibold text-[#121212B2]">
                السعر
              </div>
              <div className="sm:text-[22px] font-bold text-[#121212]">
                {checkOutDetails.price} جنيه
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="sm:text-[22px] font-semibold text-[#121212B2]">
                الخصم
              </div>
              <div className="sm:text-[22px] font-bold text-[#121212]">
                {Number(checkOutDetails.price) -
                  Number(checkOutDetails.price_after_discount)}{" "}
                جنيه
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="sm:text-[22px] font-bold text-[#121212]">
                المجموع
              </div>
              <div className="sm:text-[22px] font-bold text-[#121212]">
                {checkOutDetails.price_after_discount} جنيه
              </div>
            </div>
          </div>
          <PayForm courseId={id} />
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
