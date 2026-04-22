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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { getSubjects } from "@/services/subjects";
import {
  TUpdateTeacher,
  changePassword,
  getTeacherProfile,
  updateTeacher,
} from "@/services/teacher/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "../ui/separator";
import { transformGoogleDriveUrl } from "@/lib/helper/ExtractImg";

type Props = {};

const FormSchema = z.object({
  fullName: z.string().min(1, { message: "يجب ادخال الاسم" }),
  info: z.string().min(1, { message: "يجب ادخال المعلومات" }),
  email: z.string().email({ message: "يجب ادخال بريد الكتروني صحيح" }),
  img_url: z.string().url({ message: "يجب ادخال رابط صورة صحيح" }).optional(),
  phone: z.string().min(1, { message: "يجب ادخال رقم الهاتف" }),
  city: z.string().min(1, { message: "يجب ادخال المدينة" }),
});

const PasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, { message: "كلمة السر يجب ان تكون اكثر من 6 احرف" }),
    newPassword: z
      .string()
      .min(6, { message: "كلمة السر يجب ان تكون اكثر من 6 احرف" }),
    newPassword_confirmation: z
      .string()
      .min(6, { message: "كلمة السر يجب ان تكون اكثر من 6 احرف" }),
  })
  .refine((data) => data.newPassword === data.newPassword_confirmation, {
    message: "كلمة السر غير متطابقة",
    path: ["newPassword_confirmation"],
  });

type FormTypes = z.infer<typeof FormSchema>;

type PasswordTypes = z.infer<typeof PasswordSchema>;

function TeacherSettingsForm({}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: myData } = useQuery({
    queryKey: ["teacher"],
    queryFn: getTeacherProfile,
  });

  const form = useForm<FormTypes>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: myData?.fullName || "",
      email: myData?.email || "",
      phone: myData?.phone || "",
      info: myData?.info || "",
      img_url: myData?.img_url?.trim() || "",
      city: myData?.city || "",
    },
  });

  const passwordForm = useForm<PasswordTypes>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      newPassword_confirmation: "",
    },
  });

  const { mutate: UpdateTeacher, isPending: isUpdating } = useMutation({
    mutationFn: (data: FormTypes) =>
      updateTeacher(String(myData?.id) ?? "1", data),
    onSuccess: () => {
      (queryClient.invalidateQueries({ queryKey: ["teacher"] }),
        toast({
          title: "تم تعديل الحساب بنجاح",
        }));
    },
    onError: (error) => {
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
    },
  });

  const { mutate: ChangePassword, isPending: isChanging } = useMutation({
    mutationFn: (data: Omit<PasswordTypes, "newPassword_confirmation">) =>
      changePassword(data),
    onSuccess: () => {
      toast({
        title: "تم تعديل كلمة السر بنجاح",
      });
      router.push("/teacher/dashboard");
    },
    onError: (error) => {
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
    },
  });

  useEffect(() => {
    if (myData) {
      form.reset({
        fullName: myData.fullName,
        email: myData.email,
        phone: myData.phone,
        info: myData.info,
        img_url: myData.img_url?.trim(),
        city: myData.city,
      });
    }
  }, [myData]);

  if (!myData)
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-secondary" />
      </div>
    );
  return (
    <div className="bg-card/40 backdrop-blur-md border border-primary/10 py-12 px-8 rounded-3xl shadow-2xl relative overflow-hidden space-y-16">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10">
        <div className="space-y-2 mb-10 text-center">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
            <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
            إعدادات الحساب
          </h1>
          <p className="text-tech-grey text-lg font-medium">تعديل البيانات الشخصية ومعلومات المعلم</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              UpdateTeacher(data);
            })}
            className="mx-auto max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="md:col-span-2 flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-[20px] rounded-full group-hover:bg-primary/40 transition-all duration-500" />
                <Image
                  src={transformGoogleDriveUrl(myData?.img_url) || "/images/camera.svg"}
                  alt="Profile Picture"
                  width={150}
                  height={150}
                  className="rounded-full object-cover w-40 h-40 border-4 border-card relative z-10 transition-transform duration-500 group-hover:scale-105 shadow-xl"
                  loading="eager"
                />
              </div>
            </div>

            <FormField
              name="fullName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all placeholder:text-tech-grey/50"
                      placeholder="الأسم كامل"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all placeholder:text-tech-grey/50"
                      placeholder="البريد الالكتروني"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all placeholder:text-tech-grey/50"
                      placeholder="رقم الهاتف"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              name="city"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all placeholder:text-tech-grey/50"
                      placeholder="المدينة"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="info"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="border-primary/10 focus:border-primary focus:ring-primary rounded-xl bg-card/50 text-white placeholder:text-tech-grey/50 min-h-[120px] resize-none transition-all"
                        placeholder="المعلومات"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-2">
              <FormField
                name="img_url"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all placeholder:text-tech-grey/50"
                        placeholder="رابط الصورة الشخصية"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-2 pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full text-background h-14 text-lg font-bold shadow-neon-glow rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
                disabled={isUpdating}
              >
                {isUpdating ? "جاري التحديث..." : "حفظ التعديلات"}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <Separator className="bg-primary/10 h-[1px] w-full max-w-2xl mx-auto" />

      <div className="relative z-10">
        <div className="space-y-2 mb-10 text-center">
          <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <div className="w-1 h-6 bg-primary rounded-full shadow-neon-glow opacity-70" />
            تغيير كلمة السر
          </h1>
          <p className="text-tech-grey text-base font-medium">قم بتأمين حسابك بكلمة سر قوية</p>
        </div>

        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit((data) => {
              const { newPassword_confirmation, ...rest } = data;
              ChangePassword(rest);
            })}
            className="mx-auto max-w-lg space-y-6"
          >
            <FormField
              name="currentPassword"
              control={passwordForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all placeholder:text-tech-grey/50"
                      placeholder="كلمة السر الحالية"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              name="newPassword"
              control={passwordForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all placeholder:text-tech-grey/50"
                      placeholder="كلمة السر الجديدة"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              name="newPassword_confirmation"
              control={passwordForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all placeholder:text-tech-grey/50"
                      placeholder="تأكيد كلمة السر الجديدة"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full text-background h-14 text-lg font-bold shadow-neon-glow rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
                disabled={isChanging}
              >
                {isChanging ? "جاري التحديث..." : "تحديث كلمة السر"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default TeacherSettingsForm;
