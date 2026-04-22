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
import { toast } from "@/components/ui/use-toast";
import {
  GetSingleStudentResponse,
  TCreateStudent,
  TUpdateStudent,
  createStudent,
  updateStudent,
} from "@/services/admin/students";
import { getClasses } from "@/services/public/classes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

type Props = {
  intialValues?: GetSingleStudentResponse;
};

const studentsAdminSchemaCreate = z
  .object({
    firstName: z.string().min(1, { message: "يجب ادخال الاسم الأول" }),
    lastName: z.string().min(1, { message: "يجب ادخال الاسم الأخير" }),
    email: z.string().email({ message: "يجب ادخال بريد الكتروني صحيح" }),
    gender: z.string().min(1, { message: "الرجاء اختيار الجنس" }),
    password: z
      .string()
      .min(6, { message: "كلمة السر يجب ان تكون 6 احرف على الاقل" }),
    password_confirmation: z.string(),
    img_url: z
      .string()
      .url({ message: "يجب ادخال رابط صورة الدورة" })
      .optional()
      .or(z.literal("")),

    phone: z.string().min(1, { message: "يجب ادخال رقم الهاتف" }),
    classId: z.string().min(1, { message: "يجب اختيار المادة" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "كلمة السر غير متطابقة",
  });

const studentsAdminSchemaEdit = z.object({
  firstName: z.string().min(1, { message: "يجب ادخال الاسم الأول" }),
  lastName: z.string().min(1, { message: "يجب ادخال الاسم الأخير" }),
  email: z.string().email({ message: "يجب ادخال بريد الكتروني صحيح" }),
  gender: z.string().min(1, { message: "الرجاء اختيار الجنس" }),
  img_url: z.string().url({ message: "يجب ادخال رابط صورة الدورة" }).optional().or(z.literal("")),

  phone: z.string().min(1, { message: "يجب ادخال رقم الهاتف" }),
  classId: z.string().min(1, { message: "يجب اختيار المادة" }),
});

function AdminStudentsForm({ intialValues }: Props) {
  const studentId = intialValues?.id;
  const schema = studentId
    ? studentsAdminSchemaEdit
    : studentsAdminSchemaCreate;
  type StudentAdminSchemaType = z.infer<
    typeof studentId extends string
      ? typeof studentsAdminSchemaEdit
      : typeof studentsAdminSchemaCreate
  >;

  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<StudentAdminSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: intialValues?.firstName || "",
      lastName: intialValues?.lastName || "",
      email: intialValues?.email || "",
      password: "",
      password_confirmation: "",
      phone: intialValues?.phone || "",
      classId: intialValues?.class?.id || "",
      img_url: intialValues?.img_url?.trim() || "",
      gender: intialValues?.gender || "",
    },
  });

  const { mutate: CreateStudent, isPending: isCreating } = useMutation({
    mutationFn: (data: TCreateStudent) => createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students-admin"] });
      toast({
        title: "تم انشاء الحساب بنجاح",
      });
      router.push("/admin/students");
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

  const { mutate: UpdateStudent, isPending: isUpdating } = useMutation({
    mutationFn: (data: TUpdateStudent) =>
      updateStudent(String(studentId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students-admin"] });
      toast({
        title: "تم تعديل الحساب بنجاح",
      });
      router.push("/admin/students");
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

  if (!classes)
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
      </div>
    );

  return (
    <div className="bg-card/40 backdrop-blur-md border border-primary/10 py-12 px-6 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            const { password_confirmation, ...rest } = data;
            if (studentId) {
              UpdateStudent(rest);
            } else {
              CreateStudent(rest as any);
            }
          })}
          className="mx-auto mb-0 mt-8 max-w-lg space-y-6 w-full relative z-10"
        >
          <div className="image w-fit m-auto mb-8 relative group">
            <div className="absolute inset-0 bg-primary/20 blur-[20px] rounded-full group-hover:bg-primary/40 transition-all duration-500" />
            <Image
              src={intialValues?.img_url?.trim() || "/images/camera.svg"}
              alt="Profile Picture"
              width={150}
              height={150}
              className="rounded-full object-cover w-36 h-36 border-4 border-card relative z-10 transition-transform duration-500 group-hover:scale-105 shadow-xl shadow-black/50"
              loading="eager"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <Input
                      className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                      placeholder="الاسم الأول"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />
            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <Input
                      className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                      placeholder="الاسم الأخير"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />
          </div>
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
                <FormMessage className="text-red-400 text-xs" />
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
                    <SelectTrigger className="border-primary/10 focus:ring-primary h-12 rounded-xl bg-card/50 text-white">
                      <SelectValue placeholder="الجنس" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-card border-primary/20 text-white">
                    <SelectItem value="Male">ذكر</SelectItem>
                    <SelectItem value="Female">أنثي</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-400 text-xs" />
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
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />
          <FormField
            name="classId"
            control={form.control}
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
                    {classes?.map((cls) => {
                      return (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-400 text-xs" />
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
                    placeholder="ادخل رابط الصورة (اختياري)"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />
          {!intialValues?.id && (
            <div className="grid grid-cols-4 gap-4">
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
                    <FormMessage className="text-red-400 text-xs mt-1" />
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
                    <FormMessage className="text-red-400 text-xs mt-1" />
                  </FormItem>
                )}
              />
            </div>
          )}
          <Button
            type="submit"
            className="w-full h-14 text-lg font-bold shadow-neon-glow mt-8 rounded-xl transition-all active:scale-[0.98]"
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? (
              <Loader2 className="animate-spin" />
            ) : (
              studentId ? "حفظ التعديلات" : "انشاء حساب الطالب"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default AdminStudentsForm;
