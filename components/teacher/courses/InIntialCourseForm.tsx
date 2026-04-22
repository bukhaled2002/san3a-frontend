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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  GetSingleCourseResponse,
  createCourse,
  updateCourse,
} from "@/services/teacher/courses";
import { getClasses } from "@/services/public/classes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { getSubjects } from "@/services/teacher/subjects";
import { Switch } from "@/components/ui/switch";

type Props = {
  intialValues?: GetSingleCourseResponse;
};

const schema = z.object({
  name: z.string().min(1, { message: "يجب ادخال اسم الدورة" }),
  description: z.string().min(1, { message: "يجب ادخال الوصف" }),
  img_url: z.string().url({ message: "يجب ادخال رابط صورة الدورة" }).optional(),
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

function TeacherIntialCourseForm({ intialValues }: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const courseId = intialValues?.id;

  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });

  const { data: subjects } = useQuery({
    queryKey: ["teacher-subjects"],
    queryFn: () => getSubjects(),
  });

  const form = useForm<schemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: intialValues?.name || "",
      description: intialValues?.description || "",
      img_url: intialValues?.img_url?.trim() || "",
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
      queryClient.invalidateQueries({ queryKey: ["courses-teacher"] });
      toast({
        title: "تم انشاء االدورة بنجاح",
      });
      router.push("/teacher/courses");
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
      queryClient.invalidateQueries({ queryKey: ["courses-teacher"] });
      toast({
        title: "تم تعديل االدورة بنجاح",
      });
      router.push("/teacher/courses");
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
    <div className="bg-card/40 backdrop-blur-md border border-primary/10 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            if (courseId) {
              UpdateCourse(data);
            } else {
              CreateCourse(data);
            }
          })}
          className="mb-0 space-y-8 w-full px-12 py-12 relative z-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-lg font-bold mb-3 block">
                    اسم الدورة
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all placeholder:text-tech-grey/50"
                      type="text"
                      placeholder="أدخل اسم الدورة التعليمية"
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
                <FormItem>
                  <FormLabel className="text-white text-lg font-bold mb-3 block">
                    المادة
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all">
                        <SelectValue placeholder="اختر المادة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card border-primary/10 text-white">
                      {subjects?.map((subject) => {
                        return (
                          <SelectItem key={subject.id} value={subject.id} className="focus:bg-primary/20 focus:text-white cursor-pointer">
                            {subject.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
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
                    className="border-primary/10 focus:border-primary focus:ring-primary rounded-xl bg-card/50 text-white placeholder:text-tech-grey/50 min-h-[160px] resize-none transition-all"
                    placeholder="اكتب وصفاً تفصيلياً للدورة..."
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-lg font-bold mb-3 block">
                    سعر الدورة (جنيه)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                      type="text"
                      placeholder="0"
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
                <FormItem>
                  <FormLabel className="text-white text-lg font-bold mb-3 block">
                    نسبة الخصم (%)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                      min={0}
                      max={100}
                      type="text"
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              name="classId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-lg font-bold mb-3 block">
                    الصف الدراسي
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all">
                        <SelectValue placeholder="اختر الصف" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card border-primary/10 text-white">
                      {classes?.map((cls) => {
                        return (
                          <SelectItem key={cls.id} value={cls.id} className="focus:bg-primary/20 focus:text-white cursor-pointer">
                            {cls.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              name="img_url"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-lg font-bold mb-3 block">
                    رابط صورة الدورة
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all placeholder:text-tech-grey/50"
                      type="text"
                      placeholder="https://..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <FormField
              control={form.control}
              name="IsActive"
              render={({ field }) => (
                <FormItem className="flex items-center gap-4 space-y-0">
                  <FormLabel className="text-white font-bold text-lg cursor-pointer">هل الدورة مفعلة؟</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full text-background h-14 text-xl font-bold shadow-neon-glow rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  <span>جاري الحفظ...</span>
                </div>
              ) : (
                courseId ? "حفظ التعديلات" : "انشاء الدورة التعليمية"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default TeacherIntialCourseForm;
