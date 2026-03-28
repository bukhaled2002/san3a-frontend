"use client";
import { getWallet, requestPayment } from "@/services/student/wallet";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "../ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { isAxiosError } from "axios";

type Props = {};

const FormSchema = z.object({
  amount: z.coerce.number().min(1, "الرجاء ادخال قيمة صحيحة"),
  reference_number: z.string().min(12, "رقم العملية يجب ان يكون 12 رقم"),
});

type FormValues = z.infer<typeof FormSchema>;

function WalletContent({}: Props) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { data: walletData } = useQuery({
    queryKey: ["wallet"],
    queryFn: getWallet,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: 0,
      reference_number: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await requestPayment(values.amount, values.reference_number);
      form.reset();
      setIsOpen(false);
      toast({
        title: "ام ارسال الطلب بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: error.response?.data.message,
          variant: "destructive",
        });
      }
      toast({
        title: "حدث خطأ ما",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8 font-bold text-base">
      <div className="lg:grid grid-cols-9 gap-x-6 lg:space-y-0 space-y-6">
        <div className="xl:col-span-3 col-span-4">
          <div className="flex items-center gap-x-[14px] mb-[14px]">
            <h1 className="sm:text-[22px] text-lg text-[#d4d4d4] font-bold">
              محفظتي
            </h1>
            <Image
              src="/icons/wallet.webp"
              className="sm:size-[30px] h-6 w-7"
              width={30}
              height={30}
              alt="wallet"
            />
          </div>
          <div className="border-[1.04px] border-[#00000026] px-4 sm:px-[23px] py-5 sm:py-[25px] rounded-[10px] mb-4">
            <div className="flex items-center justify-between sm:flex-row flex-col gap-4 mb-7">
              <div className="text-[#d4d4d4] font-bold text-xl sm:text-[26px]">
                الرصيد المتاح
              </div>
              <div className="text-[#F65428] font-bold sm:text-3xl text-2xl">
                {walletData?.wallet.balance} جنيه
              </div>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="text-lg sm:w-fit w-full">
                  شحن الرصيد
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[650px] max-w-[90%] rounded-[22.317px] p-5 lg:p-20">
                <div className="flex items-center gap-x-2.5 sm:justify-start justify-between">
                  <h1 className="text-[#000] font-bold text-lg sm:text-[22px]">
                    اشحن علي محفظة فودافون 01066402706
                  </h1>
                  <Image
                    src="/icons/vodafone.svg"
                    className="sm:size-[42px] size-6"
                    width={42}
                    height={42}
                    alt="vodafone"
                  />
                </div>
                <p className="text-[#121212B2] text-sm sm:text-base font-semibold sm:mb-8">
                  هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم
                  توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذ
                </p>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className="py-4"
                              type="text"
                              placeholder="المبلغ"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="reference_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className="py-4"
                              type="text"
                              placeholder="رقم العملية"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center">
                      <Button
                        type="submit"
                        className="inline-block rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white w-full sm:h-12"
                        disabled={isSubmitting}
                      >
                        تحقق من عملية الشحن
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <p className="sm:text-lg text-[#121212B2] font-semibold leading-[27px]">
            هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا
            النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد
            من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.
          </p>
        </div>
        <div className="xl:col-span-6 col-span-5">
          <h1 className="sm:text-[22px] text-lg text-[#d4d4d4] font-bold mb-[14px]">
            العمليات الاخيرة
          </h1>
          {walletData && walletData?.transactions?.length > 0 ? (
            <div className="border-[1.04px] border-[#00000026] pb-7 sm:px-[25px] px-5 rounded-[10px] space-y-5 sm:space-y-[25px] divide-y-2">
              {walletData?.transactions.map((payment) => {
                return (
                  <div key={payment.id} className="pt-[25px]">
                    <div className="flex items-center justify-between mb-[14px]">
                      <div className="text-[#121212B2] font-medium text-base">
                        {new Date(payment.createdAt).toLocaleDateString(
                          "en-us",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          },
                        )}
                      </div>
                      <div
                        className={cn(
                          " text-xs py-0.5 ps-[8px] pe-[4px] rounded-[16px] flex items-center gap-x-1.5",
                          payment.status === "paid" &&
                            "text-[#027A48] bg-[#ECFDF3]",
                          payment.status === "pending" &&
                            "text-[#B54708] bg-[#FFFAEB]",
                          payment.status === "failed" &&
                            "text-[#B42318] bg-[#FEF3F2]",
                        )}
                      >
                        <span>
                          {payment.status === "paid"
                            ? "تمت بنجاح"
                            : payment.status === "pending"
                              ? "قيد المراجعة"
                              : "العملية مرفوضة"}
                        </span>
                        <div
                          className={cn(
                            "w-[8px] h-[8px] rounded-full inline-block ml-2",
                            payment.status === "paid" && "bg-[#12B76A]",
                            payment.status === "pending" && "bg-[#F79009]",
                            payment.status === "failed" && "bg-[#F04438]",
                          )}
                        />
                      </div>
                    </div>
                    <div className="font-semibold">
                      {payment.status === "paid" ? (
                        <>
                          تم شحن{" "}
                          <span className="text-secondary font-bold text-lg">
                            {payment.amount}
                          </span>{" "}
                          جنيه{" "}
                        </>
                      ) : payment.status === "pending" ? (
                        <>
                          طلبك بشحن{" "}
                          <span className="text-secondary font-bold text-lg">
                            {payment.amount}
                          </span>{" "}
                          جنيه قيد المراجعة
                        </>
                      ) : (
                        <>
                          تم رفض طلب شحن{" "}
                          <span className="text-secondary font-bold text-lg">
                            {payment.amount}
                          </span>{" "}
                          جنيه{" "}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-lg text-[#121212B2] font-semibold leading-[27px]">
              لا يوجد عمليات
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WalletContent;
