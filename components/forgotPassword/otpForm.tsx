"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { resendOtp, verifyOtp } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  otp: z.string().min(5),
});

type FormValues = z.infer<typeof FormSchema>;

type Props = {
  email: string;
};

function OtpForm({ email }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(59);
  const router = useRouter();
  const resendOTP = async () => {
    try {
      await resendOtp(email);
      toast({
        title: "تم اعادة ارسال رمز التحقق",
      });
      setTimer(59);
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: error.response?.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "خطأ",
          description: "حدث خطأ ما",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (!email) {
      router.push("/auth/forgot-password");
    }
  }, [email]);

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      await verifyOtp(email, data.otp);
      toast({
        title: "تم تأكيد رمز التحقق",
      });
      router.push(`/auth/reset-password?email=${email}&OTP=${data.otp}`);
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: error.response?.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "خطأ",
          description: "حدث خطأ ما",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full bg-card/40 backdrop-blur-md border border-primary/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] pointer-events-none" />
      <div className="w-full relative z-10">
        <h1 className="text-xl text-white font-bold sm:text-2xl text-center mb-8">
          ادخال رمز التأكيد
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex justify-center">
                  <FormControl>
                    <InputOTP
                      maxLength={5}
                      render={({ slots }) => (
                        <InputOTPGroup dir="ltr" className="gap-3">
                          {slots.map((slot, index) => (
                            <InputOTPSlot
                              key={index}
                              className={cn(
                                "w-12 h-14 rounded-xl border-primary/10 bg-card/50 text-white text-2xl font-bold transition-all focus:border-primary focus:ring-1 focus:ring-primary",
                                form.formState.errors.otp && "border-red-500/50 text-red-500"
                              )}
                              {...slot}
                            />
                          ))}
                        </InputOTPGroup>
                      )}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-xl bg-primary text-background font-bold text-lg shadow-neon-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {isSubmitting ? "جاري التأكيد..." : "تأكيد الرمز"}
              </Button>
            </div>
            <div className="flex items-center justify-between px-2 pt-4 border-t border-primary/10">
              <button
                type="button"
                className="text-sm text-primary font-bold hover:underline disabled:opacity-30 disabled:no-underline transition-all"
                onClick={resendOTP}
                disabled={timer > 0}
              >
                اعادة ارسال الرمز
              </button>
              {timer > 0 && (
                <div className="text-sm text-tech-grey font-mono bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                  {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default OtpForm;
