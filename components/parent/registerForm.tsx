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
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getClasses } from "@/services/public/classes";
import { registerParent } from "@/services/parent/auth";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {};

const FormSchema = z
  .object({
    firstName: z
      .string()
      .min(3, { message: "الاسم الاول يجب ان يكون اكثر من 3 احرف" }),
    lastName: z
      .string()
      .min(3, { message: "الاسم الاخير يجب ان يكون اكثر من 3 احرف" }),
    phone: z.string().min(1, { message: "الرجاء ادخال رقم الهاتف" }),
    password: z.string().min(6, { message: "كلمة السر يجب ان تكون 6 احرف" }),
    password_confirmation: z
      .string()
      .min(6, { message: "كلمة السر يجب ان تكون 6 احرف" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "كلمة السر غير متطابقة",
    path: ["password_confirmation"],
  });

type FormValues = z.infer<typeof FormSchema>;

function ParentRegisterForm({}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      password: "",
      password_confirmation: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    const { password_confirmation, ...rest } = data;
    try {
      await registerParent(rest);
      toast({
        title: "تم تسجيل الحساب بنجاح",
      });
      router.push("/auth/teacher/login");
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: error.response?.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "حدث خطأ ما",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <div className="w-full">
        <h1 className="text-xl text-[#7 B758C] font-bold sm:text-2xl text-center mb-6">
          مرحبا بكم في منصة صنعة التعليمية
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="row-span-2">
                    <FormControl>
                      <Input
                        className="py-4"
                        type="text"
                        placeholder="الاسم الاول"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="row-span-2">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="الاسم الاخير"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="row-span-2">
                  <FormControl>
                    <Input type="text" placeholder="رقم الهاتف" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="row-span-2">
                  <FormControl>
                    <Input type="password" placeholder="كلمة السر" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem className="row-span-2">
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="تأكيد كلمة السر"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="inline-block rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white w-full sm:h-12 h-10"
              >
                انشاء حساب
              </Button>
            </div>
            <div className="flex items-center justify-between sm:flex-row flex-col gap-3">
              <div className="sm:text-sm text-xs sm:text-start text-center text-[#7B758C]">
                تسجيل الدخول{" "}
                <Link
                  href="/auth/parent/register"
                  className="text-secondary font-bold"
                >
                  كولي امر
                </Link>{" "}
                او{" "}
                <Link
                  href="/auth/student/register"
                  className="text-secondary font-bold"
                >
                  كطالب
                </Link>
              </div>
              <div className="sm:text-sm text-xs sm:text-start text-center text-[#7B758C]">
                لديك حساب بالفعل؟{" "}
                <Link
                  href="/auth/teacher/login"
                  className="text-secondary font-bold"
                >
                  تسجيل الدخول
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ParentRegisterForm;
