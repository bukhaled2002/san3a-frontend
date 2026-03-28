"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  GetSingleCourseResponse,
  createCourse,
  updateCourse,
} from "@/services/admin/courses";
import { getSubjects } from "@/services/admin/subjects";
import { getTeachers } from "@/services/admin/teachers";
import { getClasses } from "@/services/public/classes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  name: z.string().min(1, { message: "يجب ادخال اسم الدورة" }),
  description: z.string().min(1, { message: "يجب ادخال الوصف" }),
  img_url: z.string().url({ message: "يجب ادخال رابط صورة الدورة" }).optional(),
  teacherId: z.string().min(1, { message: "يجب اختيار المعلم" }),
  subjectId: z.string().min(1, { message: "يجب اختيار المادة" }),
  price: z.string().regex(/^\d+$/, {
    message: "يجب ادخال رقم",
  }),
  discountPercentage: z.coerce
    .number({
      invalid_type_error: "يجب ادخال رقم",
    })
    .min(0, {
      message: "يجب ادخال رقم اكبر من 0",
    })
    .max(100, {
      message: "يجب ادخال رقم اقل من 100",
    })
    .optional(),
  classId: z.string().min(1, { message: "يجب اختيار المادة" }),
  IsActive: z.boolean(),
});

type schemaType = z.infer<typeof schema>;

type Props = {
  intialValues?: GetSingleCourseResponse;
};

function AdminIntialCourseForm({ intialValues }: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const courseId = intialValues?.id;

  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });

  const { data: teachers } = useQuery({
    queryKey: ["teachers-admin"],
    queryFn: () => getTeachers(),
  });

  const { data: subjects } = useQuery({
    queryKey: ["admin-subjects"],
    queryFn: () => getSubjects(),
  });

  const form = useForm<schemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: intialValues?.name || "",
      description: intialValues?.description || "",
      img_url: intialValues?.img_url?.trim() || "",
      teacherId: intialValues?.teacherId || "",
      subjectId: intialValues?.subjectId || "",
      price: intialValues?.price || "",
      discountPercentage: intialValues?.discountPercentage || 0,
      classId: intialValues?.classId || "",
      IsActive: intialValues?.IsActive ?? true,
    },
  });

  const { mutate: CreateCourse, isPending: isCreating } = useMutation({
    mutationFn: (data: schemaType) => createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses-admin"] });
      toast({
        title: "تم انشاء االدورة بنجاح",
      });
      router.push("/admin/courses");
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

  const { mutate: UpdateCourse, isPending: isUpdating } = useMutation({
    mutationFn: (data: schemaType) => updateCourse(String(courseId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses-admin"] });
      toast({
        title: "تم تعديل االدورة بنجاح",
      });
      router.push("/admin/courses");
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

  if (!classes || !teachers || !subjects)
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-secondary" />
      </div>
    );

  return (
    <div className="bg-card p-5 rounded-[12px] border border-border/20">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            if (courseId) {
              UpdateCourse(data);
            } else {
              CreateCourse(data);
            }
          })}
          className="mb-0 space-y-[24px] w-full bg-card px-16 pt-14 pb-5"
        >
          <div className="grid grid-cols-4 gap-x-[57px]">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 ">
                  <FormLabel className="text-foreground text-lg font-semibold">
                    اسم الدورة
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-secondary bg-background h-12 border border-border/20 rounded-[4px]"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              name="subjectId"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 focus-visible:ring-secondary">
                  <FormLabel className="text-foreground text-lg font-semibold">
                    المادة
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="focus-visible:ring-secondary bg-background h-12 border border-border/20 rounded-[4px]">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects?.data.map((subject) => {
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
          </div>
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#202224] text-lg font-semibold">
                  وصف الدورة
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="focus-visible:ring-secondary bg-background h-[190px] resize-none border border-border/20 rounded-[4px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-4 gap-x-[57px]">
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-foreground text-lg font-semibold">
                    سعر الدورة
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-secondary bg-background h-12 border border-border/20 rounded-[4px]"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              name="discountPercentage"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-foreground text-lg font-semibold">
                    نسبة الخصم
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-secondary bg-background h-12 border border-border/20 rounded-[4px]"
                      min={0}
                      max={100}
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
            name="teacherId"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-[#202224] text-lg font-semibold">
                  اختار المعلم
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="text-foreground focus-visible:ring-secondary bg-background h-12 border border-border/20 rounded-[4px]">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teachers?.data.map((teacher) => {
                      return (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.fullName}
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
            name="classId"
            control={form.control}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="text-[#202224] text-lg font-semibold">
                  اختار الصف
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="text-foreground focus-visible:ring-secondary bg-background h-12 border border-border/20 rounded-[4px]">
                      <SelectValue />
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
              <FormItem className="col-span-2">
                <FormLabel className="text-[#202224] text-lg font-semibold">
                  صور الدورة التعليمة
                </FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-secondary bg-[#F5F6F8] h-12 border border-[#00000026]/15 rounded-[4px]"
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
            name="IsActive"
            render={({ field }) => (
              <FormItem className="">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">الدورة مفعلة؟</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="lg"
            variant="secondary"
            className="w-full text-white h-12 text-lg"
            disabled={isCreating || isUpdating}
          >
            {courseId ? "تعديل" : "انشاء"}
            {(isCreating || isUpdating) && (
              <Loader2 className="animate-spin ms-3" />
            )}{" "}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default AdminIntialCourseForm;
