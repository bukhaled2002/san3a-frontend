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
import { Loader2 } from "lucide-react";
type Props = {};

const FormSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "الاسم الاول يجب ان يكون اكثر من 3 احرف" }),
  lastName: z
    .string()
    .min(3, { message: "الاسم الثاني يجب ان يكون اكثر من 3 احرف" }),
  school: z.string().min(3, { message: "الرجاء ادخال اسم المدرسة" }),
  city: z.string().min(3, { message: "الرجاء ادخال اسم المدينة" }),
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

function StudentRegisterForm({}: Props) {
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
    <div className="w-full bg-card/40 backdrop-blur-md border border-primary/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] pointer-events-none" />
      <div className="w-full relative z-10">
        <h1 className="text-xl text-white font-bold sm:text-2xl text-center mb-8 flex flex-col gap-2">
          <span className="text-primary text-sm uppercase tracking-widest">
            انشاء حساب جديد
          </span>
          مرحبا بكم في منصة صنعة التعليمية
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 md:gap-5 gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="h-12 border-primary/10 focus:border-primary focus:ring-primary rounded-xl bg-card/50 text-white transition-all placeholder:text-tech-grey/50"
                        type="text"
                        placeholder="الاسم الأول"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="h-12 border-primary/10 focus:border-primary focus:ring-primary rounded-xl bg-card/50 text-white transition-all placeholder:text-tech-grey/50"
                        type="text"
                        placeholder="الاسم الأخير"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

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
            <div className="grid grid-cols-2 md:gap-5 gap-3">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="h-12 border-primary/10 focus:border-primary focus:ring-primary rounded-xl bg-card/50 text-white transition-all placeholder:text-tech-grey/50"
                        type="text"
                        placeholder="رقم هاتف ولي الأمر"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone2"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="h-12 border-primary/10 focus:border-primary focus:ring-primary rounded-xl bg-card/50 text-white transition-all placeholder:text-tech-grey/50"
                        type="text"
                        placeholder="رقم هاتف الطالب"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 md:gap-5 gap-3">
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
                        <SelectTrigger className="border-primary/10 focus:ring-primary h-12 rounded-xl bg-card/50 text-white">
                          <SelectValue placeholder="الجنس" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-primary/20 text-white">
                        <SelectItem value="Male">ذكر</SelectItem>
                        <SelectItem value="Female">أنثي</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
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
                        <SelectTrigger className="border-primary/10 focus:ring-primary h-12 rounded-xl bg-card/50 text-white">
                          <SelectValue placeholder="الصف الدراسي" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-primary/20 text-white">
                        {classes?.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 md:gap-5 gap-3">
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
                        <SelectTrigger className="border-primary/10 focus:ring-primary h-12 rounded-xl bg-card/50 text-white">
                          <SelectValue placeholder="المحافظة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-primary/20 text-white max-h-[300px]">
                        {governorates.map((gov) => (
                          <SelectItem
                            key={gov.id}
                            value={gov.governorate_name_ar}
                          >
                            {gov.governorate_name_ar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="h-12 border-primary/10 focus:border-primary focus:ring-primary rounded-xl bg-card/50 text-white transition-all placeholder:text-tech-grey/50"
                        type="text"
                        placeholder="اسم المدرسة"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 md:gap-5 gap-3">
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
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="h-12 border-primary/10 focus:border-primary focus:ring-primary rounded-xl bg-card/50 text-white transition-all placeholder:text-tech-grey/50"
                        type="password"
                        placeholder="تأكيد كلمة السر"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-primary text-background font-bold text-lg shadow-neon-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "انشاء حساب جديد"
                )}
              </Button>
            </div>
            <div className="space-y-4 pt-4 border-t border-primary/10">
              <div className="text-sm text-tech-grey flex items-center justify-center gap-2">
                <span>تسجيل كـ:</span>
                <Link
                  href="/auth/parent/register"
                  className="text-primary font-bold hover:underline"
                >
                  ولي امر
                </Link>
                <span className="text-primary/20">|</span>
                <Link
                  href="/auth/teacher/register"
                  className="text-primary font-bold hover:underline"
                >
                  معلم
                </Link>
              </div>
              <div className="text-sm text-tech-grey text-center">
                لديك حساب بالفعل؟{" "}
                <Link
                  href="/auth/student/login"
                  className="text-primary font-bold hover:underline"
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
