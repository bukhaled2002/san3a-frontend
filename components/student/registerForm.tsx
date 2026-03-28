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
import { registerStudent } from "@/services/student/auth";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { governorates } from "@/lib/helper/egypt-governorates-and-cities";
type Props = {};

const FormSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "الاسم الاول يجب ان يكون اكثر من 3 احرف" }),
  lastName: z
    .string()
    .min(3, { message: "الاسم الثاني يجب ان يكون اكثر من 3 احرف" }),
  school: z
    .string()
    .min(3, { message: "الرجاء ادخال اسم المدرسة" }),
  city: z
    .string()
    .min(3, { message: "الرجاء ادخال اسم المدينة" }),
  classId: z.string().min(1, {
    message: "الرجاء ادخال الصف الدراسي",
  }),
  email: z.string().email({ message: "الرجاء ادخال ايميل صحيح" }),
  phone: z.string().min(1, { message: "الرجاء ادخال رقم الهاتف" }),
  phone2: z.string().min(1, { message: "الرجاء ادخال رقم هاتف ولي الامر" }),
  password: z.string().min(6, { message: "كلمة السر يجب ان تكون 6 احرف" }),
  password_confirmation: z
    .string()
    .min(6, { message: "كلمة السر يجب ان تكون 6 احرف" }),
  gender: z.string().min(1, { message: "الرجاء اختيار الجنس" }),
});

type FormValues = z.infer<typeof FormSchema>;

function StudentRegisterForm({ }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      city: "",
      school: "",
      email: "",
      phone: "",
      phone2: "",
      classId: "",
      password: "",
      password_confirmation: "",
      gender: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      await registerStudent(data);
      toast({
        title: "تم تسجيل الحساب بنجاح",
      });
      router.push("/auth/student/login");
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
        <h1 className="text-xl text-[#7B758C] font-bold sm:text-2xl text-center mb-6">
          مرحبا بكم في منصة صنعة التعليمية
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 md:gap-5 gap-3">

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="row-span-2">
                  <FormControl>
                    <Input
                      className="py-4"
                      type="text"
                      placeholder="الاسم الأول"
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
                      className="py-4"
                      type="text"
                      placeholder="الاسم الأخير"
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
              name="email"
              render={({ field }) => (
                <FormItem className="row-span-2">
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="البريد الالكتروني"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="row-span-2">
                  <FormControl>
                    <Input type="text" placeholder="رقم هاتف ولي الأمر" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone2"
              render={({ field }) => (
                <FormItem className="row-span-2">
                  <FormControl>
                    <Input type="text" placeholder="رقم هاتف الطالب" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="الجنس" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">ذكر</SelectItem>
                      <SelectItem value="Female">أنثي</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="الصف الدراسي" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes?.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="المحافظة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {governorates.map((gov) => (
                        <SelectItem key={gov.id} value={gov.governorate_name_ar}>
                          {gov.governorate_name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="school"
              render={({ field }) => (
                <FormItem className="row-span-2">
                  <FormControl>
                    <Input
                      className="py-4"
                      type="text"
                      placeholder="اسم المدرسة"
                      {...field}
                    />
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
                  href="/auth/teacher/register"
                  className="text-secondary font-bold"
                >
                  كمعلم
                </Link>
              </div>
              <div className="sm:text-sm text-xs sm:text-start text-center text-[#7B758C]">
                لديك حساب بالفعل؟{" "}
                <Link
                  href="/auth/student/login"
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

export default StudentRegisterForm;
