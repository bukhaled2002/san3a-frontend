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
import {
  GetSingleTeacherResponse,
  TCreateTeacher,
  TUpdateTeacher,
  createTeacher,
  getTeacher,
  updateTeacher,
} from "@/services/admin/teachers";
import { getSubjects } from "@/services/subjects";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { transformGoogleDriveUrl } from "@/lib/helper/ExtractImg";
type Props = {
  teacher?: GetSingleTeacherResponse;
  id?: string;
};

const teachersAdminSchemaCreate = z
  .object({
    fullName: z.string().min(1, { message: "يجب ادخال الاسم" }),
    info: z.string().min(1, { message: "يجب ادخال المعلومات" }),
    email: z.string().email({ message: "يجب ادخال بريد الكتروني صحيح" }),
    password: z
      .string()
      .min(6, { message: "كلمة السر يجب ان تكون 6 احرف على الاقل" }),
    password_confirmation: z.string(),
    img_url: z.string().url({ message: "يجب ادخال رابط صورة صحيح" }).optional(),
    phone: z.string().min(1, { message: "يجب ادخال رقم الهاتف" }),
    city: z.string().min(1, { message: "يجب ادخال المدينة" }),
    subjectId: z.string().min(1, { message: "يجب اختيار المادة" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "كلمة السر غير متطابقة",
  });

const teachersAdminSchemaUpdate = z.object({
  fullName: z.string().min(1, { message: "يجب ادخال الاسم" }),
  info: z.string().min(1, { message: "يجب ادخال المعلومات" }),
  email: z.string().email({ message: "يجب ادخال بريد الكتروني صحيح" }),
  img_url: z.string().url({ message: "يجب ادخال رابط صورة الدورة" }).optional(),
  phone: z.string().min(1, { message: "يجب ادخال رقم الهاتف" }),
  city: z.string().min(1, { message: "يجب ادخال المدينة" }),
  subjectId: z.string().min(1, { message: "يجب اختيار المادة" }),
});

function AdminTeachersForm({ id }: Props) {
  const { data: teacher } = useQuery({
    queryKey: ["teacher-admin", id],
    queryFn: () => (id ? getTeacher(id as string) : null),
  });
  const teacherId = id;
  const schema = teacherId
    ? teachersAdminSchemaUpdate
    : teachersAdminSchemaCreate;
  type TeachersAdminSchemaType = z.infer<
    typeof teacherId extends string
      ? typeof teachersAdminSchemaUpdate
      : typeof teachersAdminSchemaCreate
  >;

  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<TeachersAdminSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: teacher?.fullName || "",
      email: teacher?.email || "",
      password: "",
      password_confirmation: "",
      phone: teacher?.phone || "",
      city: teacher?.city || "",
      subjectId: teacher?.subject.id || "",
      img_url: teacher?.img_url?.trim() || "",
      info: teacher?.info || "",
    },
  });

  const { mutate: CreateTeacher, isPending: isCreating } = useMutation({
    mutationFn: (data: TCreateTeacher) => createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers-admin"] });
      toast({
        title: "تم انشاء الحساب بنجاح",
      });
      router.push("/admin/teachers");
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

  const { mutate: UpdateTeacher, isPending: isUpdating } = useMutation({
    mutationFn: (data: TUpdateTeacher) =>
      updateTeacher(String(teacherId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers-admin"] });
      toast({
        title: "تم تعديل الحساب بنجاح",
      });
      router.push("/admin/teachers");
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
    if (teacher) {
      form.reset({
        fullName: teacher.fullName,
        email: teacher.email,
        phone: teacher.phone,
        city: teacher.city,
        subjectId: teacher.subject.id,
        img_url: teacher.img_url?.trim(),
        info: teacher.info,
      });
    }
  }, [teacher]);

  if (!subjects || (!teacher && id))
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-secondary" />
      </div>
    );
  return (
    <div className="bg-card/40 backdrop-blur-md border border-primary/10 py-12 px-6 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            const { password_confirmation, ...rest } = data;
            teacherId ? UpdateTeacher(rest) : CreateTeacher(rest);
          })}
          className="mx-auto mb-0 mt-8 max-w-lg space-y-6 w-full relative z-10"
        >
          <div className="image w-fit m-auto mb-8 relative group">
            <div className="absolute inset-0 bg-primary/20 blur-[20px] rounded-full group-hover:bg-primary/40 transition-all duration-500" />
            <Image
              src={transformGoogleDriveUrl(teacher?.img_url) || "/images/camera.svg"}
              alt="Profile Picture"
              width={150}
              height={150}
              className="rounded-full object-cover w-36 h-36 border-4 border-card relative z-10 transition-transform duration-500 group-hover:scale-105 shadow-xl shadow-black/50"
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
                    className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
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
                    className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
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
                    className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
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
                    className="border-primary/10 focus:border-primary focus:ring-primary rounded-xl bg-card/50 text-white placeholder:text-tech-grey/50 min-h-[120px] resize-none transition-all"
                    placeholder="المعلومات"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-primary/10 focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all">
                      <SelectValue placeholder="المادة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-card border-primary/20 text-white">
                    {subjects?.data.map((subject) => {
                      return (
                        <SelectItem key={subject.id} value={subject.id} className="focus:bg-primary/20 focus:text-white">
                          {subject.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
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
                    className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
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
                    className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                    placeholder="ادخل رابط الصورة"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          {!teacher?.id && (
            <div className="grid grid-cols-4 gap-x-[18px]">
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Input
                        className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                        placeholder="كلمة السر"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <div className="mt-3">
                      {form?.formState?.errors?.password?.type && (
                        <FormMessage className="text-red-500" />
                      )}
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                name="password_confirmation"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Input
                        className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                        placeholder="تأكيد كلمة السر"
                        type="password"
                        {...field}
                      />
                    </FormControl>

                    <div className="flex justify-between items-center mt-3">
                      {form?.formState?.errors?.password_confirmation?.type && (
                        <FormMessage className="text-red-500" />
                      )}
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full text-background h-14 text-lg font-bold shadow-neon-glow mt-8 rounded-xl transition-all active:scale-[0.98]"
            disabled={isCreating || isUpdating}
          >
            {teacherId ? "حفظ التعديلات" : "انشاء حساب المعلم"}
            {(isCreating || isUpdating) && (
              <Loader2 className="animate-spin ms-3" />
            )}{" "}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default AdminTeachersForm;
