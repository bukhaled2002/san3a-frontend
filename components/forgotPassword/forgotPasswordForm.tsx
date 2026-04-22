"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../ui/use-toast";
import { useState } from "react";
import { sendOtp } from "@/services/auth";

type Props = {};

const FormSchema = z.object({
  email: z.string().email({ message: "الرجاء ادخال ايميل صحيح" }),
});

type FormValues = z.infer<typeof FormSchema>;

function ForgotPasswordForm({}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      await sendOtp(data.email);
      toast({
        title: "تم ارسال رمز التحقق الى بريدك الالكتروني",
      });
      router.push("/auth/forgot-password/otp?email=" + data.email);
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
          نسيت كلمة السر ؟
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="h-12 border-primary/10 focus:border-primary focus:ring-primary rounded-xl bg-card/50 text-white transition-all placeholder:text-tech-grey/50"
                      type="email"
                      placeholder="البريد الالكتروني"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-primary text-background font-bold text-lg shadow-neon-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {isSubmitting ? "جاري الارسال..." : "ارسال رمز التحقق"}
              </Button>
            </div>
            <div className="text-sm text-tech-grey text-center pt-4 border-t border-primary/10">
              هل هناك مشكلة؟{" "}
              <Link href="/contact" className="text-primary font-bold hover:underline">
                اتصل بنا
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
