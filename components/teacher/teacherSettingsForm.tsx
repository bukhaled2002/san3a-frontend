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
        title: "تم تعديلل كلمة السر بنجاح",
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
    <div className="bg-white py-12 rounded-[12px] space-y-20">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            UpdateTeacher(data);
          })}
          className="mx-auto mb-0 mt-8 max-w-lg space-y-[18px] w-full bg-white"
        >
          <div className="image w-fit m-auto mb-5 md:mb-10">
            <Image
              src={
                transformGoogleDriveUrl(myData?.img_url) || "/images/camera.svg"
              }
              alt="Profile Picture"
              width={150}
              height={150}
              className="rounded-full object-cover w-36 h-36"
              loading="eager"
            />
          </div>
          <FormField
            name="fullName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    className="focus-visible:ring-secondary"
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
                    className="focus-visible:ring-secondary"
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
                    className="focus-visible:ring-secondary"
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
            control={form.control}
            name="info"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    className="focus-visible:ring-secondary border-[1.5px] border-black border-opacity-40 placeholder:text-[#808080B2] resize-none"
                    placeholder="المعلومات"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
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
                    className="focus-visible:ring-secondary"
                    placeholder="المدينة"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            name="img_url"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="focus-visible:ring-secondary"
                    placeholder="ادخل رابط الصورة"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="lg"
            variant="secondary"
            className="w-full text-white h-12 text-lg"
            disabled={isUpdating}
          >
            {isUpdating ? "جاري التحديث..." : "تحديث الحساب"}
          </Button>
        </form>
      </Form>
      <Separator className="h-1 w-[600px] rounded-lg mx-auto" />
      <Form {...passwordForm}>
        <form
          onSubmit={passwordForm.handleSubmit((data) => {
            const { newPassword_confirmation, ...rest } = data;
            ChangePassword(rest);
          })}
          className="mx-auto mb-0 mt-8 max-w-lg space-y-[18px] w-full bg-white"
        >
          <h1 className="text-2xl font-bold text-[#d4d4d4]">تحديث كلمة السر</h1>
          <div className="space-y-6">
            <FormField
              name="currentPassword"
              control={passwordForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-secondary"
                      placeholder="كلمة السر الحالية"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <div className="mt-3">
                    {passwordForm?.formState?.errors?.currentPassword?.type && (
                      <FormMessage className="text-red-500" />
                    )}
                  </div>
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
                      className="focus-visible:ring-secondary"
                      placeholder="كلمة السر الجديدة"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center mt-3">
                    {passwordForm?.formState?.errors?.newPassword?.type && (
                      <FormMessage className="text-red-500" />
                    )}
                  </div>
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
                      className="focus-visible:ring-secondary"
                      placeholder="تأكيد كلمة السر الجديدة"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center mt-3">
                    {passwordForm?.formState?.errors?.newPassword_confirmation
                      ?.type && <FormMessage className="text-red-500" />}
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            variant="secondary"
            className="w-full text-white h-12 text-lg"
            disabled={isChanging}
          >
            {isChanging ? "جاري التحديث..." : "تحديث كلمة السر"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default TeacherSettingsForm;
