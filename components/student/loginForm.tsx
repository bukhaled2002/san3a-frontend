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
import { toast } from "@/components/ui/use-toast";
import { authenticate } from "@/lib/actions/authenticate";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {};

const FormSchema = z.object({
  username: z.string().refine(
    (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^01[0-2]\d{8}$/;
      return emailRegex.test(value) || phoneRegex.test(value);
    },
    {
      message: "البريد الالكتروني او رقم الهاتف غير صحيح",
    }
  ),
  password: z.string().min(6, { message: "كلمة السر يجب ان تكون 6 احرف" }),
});

type FormValues = z.infer<typeof FormSchema>;

function StudentLoginForm({}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      const res = await authenticate({
        username: data.username,
        password: data.password,
        role: "student",
      });
      if (res === true) {
        localStorage.setItem("isLoggedIn", "true");
        toast({
          title: "تم تسجيل الدخول بنجاح",
        });
        router.push("/");
      } else {
        toast({
          title: "البريد الالكتروني او كلمة السر غير صحيحة",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast({
          title: error.response?.data.message,
          variant: "destructive",
        });
      }
      toast({
        title: "حدث خطأ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full bg-card/40 backdrop-blur-md border border-primary/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] pointer-events-none" />
      <div className="w-full relative z-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white md:text-[38px] leading-tight flex items-center gap-3">
            بيتك و مكانك
            <span className="text-primary shadow-neon-glow-text px-2">صنعة</span>
          </h2>
          <p className="text-tech-grey md:mt-4 font-medium sm:leading-[30px] ">
            جاهز تكمل تفوقك و نجاحك مع أقوى هيئة تدريس في مصر
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="h-12 border-primary/10 focus:border-primary focus:ring-primary rounded-xl bg-card/50 text-white transition-all placeholder:text-tech-grey/50"
                      type="text"
                      placeholder="البريد الالكتروني او رقم الهاتف"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <div className="flex flex-col">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="h-12 border-primary/10 focus:border-primary focus:ring-primary rounded-xl bg-card/50 text-white transition-all placeholder:text-tech-grey/50"
                        type="password"
                        placeholder="كلمة السر"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between mt-2 px-1">
                      {form.formState.errors.password ? (
                        <FormMessage className="text-red-500" />
                      ) : (
                        <div></div>
                      )}
                      <Link
                        href="/auth/forgot-password"
                        className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                      >
                        نسيت كلمة السر؟
                      </Link>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-primary text-background font-bold text-lg shadow-neon-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {isLoading ? <Image src="/images/loading.svg" alt="loading" width={24} height={24} className="animate-spin" /> : "تسجيل الدخول"}
              </Button>
            </div>
            <div className="space-y-4 pt-4 border-t border-primary/10">
              <div className="text-sm text-tech-grey flex items-center justify-center gap-2">
                <span>تسجيل الدخول كـ:</span>
                <Link
                  href="/auth/parent/login"
                  className="text-primary font-bold hover:underline"
                >
                  ولي امر
                </Link>
                <span className="text-primary/20">|</span>
                <Link
                  href="/auth/teacher/login"
                  className="text-primary font-bold hover:underline"
                >
                  معلم
                </Link>
              </div>
              <div className="text-sm text-tech-grey text-center">
                ليس لديك حساب؟{" "}
                <Link
                  href="/auth/student/register"
                  className="text-primary font-bold hover:underline"
                >
                  انشاء حساب جديد
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default StudentLoginForm;
