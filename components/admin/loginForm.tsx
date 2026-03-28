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

function AdminLoginForm({}: Props) {
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
        role: "admin",
      });
      if (res === true) {
        localStorage.setItem("isLoggedIn", "true");
        toast({
          title: "تم تسجيل الدخول بنجاح",
        });
        router.push("/admin/dashboard");
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
    <div className="w-full">
      <div className="w-full">
        <h1 className="text-xl text-[#7B758C] font-bold sm:text-2xl text-center mb-6">
          مرحبا بكم في منصة صنعة التعليمية
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="py-4"
                      type="text"
                      placeholder="ادحل البريد الالكتروني او رقم الهاتف"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                        type="password"
                        placeholder="كلمة السر"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between mt-2">
                      {form.formState.errors.password ? (
                        <FormMessage />
                      ) : (
                        <div></div>
                      )}
                      <Link
                        href="/auth/forgot-password"
                        className="text-secondary font-medium text-sm"
                      >
                        نسيت كلمة السر؟
                      </Link>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center justify-between">
              <Button
                type="submit"
                disabled={isLoading}
                className="inline-block rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white w-full sm:h-12 h-10"
              >
                تسجيل الدخول
              </Button>
            </div>
            <div className="flex items-center justify-between sm:flex-row flex-col gap-3">
              <div className="text-sm text-[#7B758C]">
                تسجيل الدخول{" "}
                <Link
                  href="/auth/student/login"
                  className="text-secondary font-bold"
                >
                  كطالب
                </Link>{" "}
                او{" "}
                <Link
                  href="/auth/teacher/login"
                  className="text-secondary font-bold"
                >
                  كمعلم
                </Link>
              </div>
              <div className="text-sm text-[#7B758C]">
                ليس لديك حساب؟{" "}
                <Link
                  href="/auth/parent/register"
                  className="text-secondary font-bold"
                >
                  انشاء حساب
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default AdminLoginForm;
