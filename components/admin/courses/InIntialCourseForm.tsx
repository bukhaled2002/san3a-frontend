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
    <div className="bg-card/40 backdrop-blur-md border border-primary/10 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            if (courseId) {
              UpdateCourse(data);
            } else {
              CreateCourse(data);
            }
          })}
          className="mb-0 space-y-[32px] w-full px-16 pt-14 pb-10 relative z-10"
        >
          <div className="grid grid-cols-4 gap-x-[57px]">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 ">
                  <FormLabel className="text-white text-lg font-bold mb-3 block">
                    اسم الدورة
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
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
                  <FormLabel className="text-white text-lg font-bold mb-3 block">
                    المادة
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all">
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
                <FormLabel className="text-white text-lg font-bold mb-3 block">
                  وصف الدورة
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="border-primary/10 focus:border-primary focus:ring-primary rounded-xl bg-card/50 text-white placeholder:text-tech-grey/50 min-h-[190px] resize-none transition-all"
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
                  <FormLabel className="text-white text-lg font-bold mb-3 block">
                    سعر الدورة
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
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
                  <FormLabel className="text-white text-lg font-bold mb-3 block">
                    نسبة الخصم
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
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
                <FormLabel className="text-white text-lg font-bold mb-3 block">
                  اختار المعلم
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all">
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
                <FormLabel className="text-white text-lg font-bold mb-3 block">
                  اختار الصف
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all">
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
                <FormLabel className="text-white text-lg font-bold mb-3 block">
                  صور الدورة التعليمة
                </FormLabel>
                <FormControl>
                  <Input
                    className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
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
                  <FormLabel className="text-white font-bold">الدورة مفعلة؟</FormLabel>
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
            className="w-full text-background h-14 text-lg font-bold shadow-neon-glow rounded-xl transition-all active:scale-[0.98] mt-4"
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
