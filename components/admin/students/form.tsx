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
      .optional(),

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
  img_url: z.string().url({ message: "يجب ادخال رابط صورة الدورة" }).optional(),

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
      classId: intialValues?.class.id || "",
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
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-secondary" />
      </div>
    );
  return (
    <div className=" bg-white py-12 rounded-[12px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            const { password_confirmation, ...rest } = data;
            if (studentId) {
              UpdateStudent(rest);
            } else {
              CreateStudent(rest);
            }
          })}
          className="mx-auto mb-0 mt-8 max-w-lg space-y-[18px] w-full bg-white"
        >
          <div className="image w-fit m-auto mb-5 md:mb-10">
            <Image
              src={intialValues?.img_url?.trim() || "/images/camera.svg"}
              alt="Profile Picture"
              width={150}
              height={150}
              className="rounded-full object-cover w-36 h-36"
              loading="eager"
            />
          </div>
          <div className="grid grid-cols-4 gap-x-[18px]">
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <Input
                      className="focus-visible:ring-secondary"
                      placeholder="الاسم الأول"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
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
                      className="focus-visible:ring-secondary"
                      placeholder="الاسم الأخير"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
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
            name="classId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="focus-visible:ring-secondary">
                      <SelectValue placeholder="الصف الدراسي" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classes?.map((subject) => {
                      return (
                        <SelectItem key={subject.id} value={subject.id}>
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
          {!intialValues?.id && (
            <div className="grid grid-cols-4 gap-x-[18px]">
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Input
                        className="focus-visible:ring-secondary"
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
                        className="focus-visible:ring-secondary"
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
            variant="secondary"
            className="w-full text-white h-12 text-lg"
            disabled={isCreating}
          >
            {studentId ? "تعديل" : "انشاء"}
            {isCreating && <Loader2 className="animate-spin ms-3" />}{" "}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default AdminStudentsForm;
