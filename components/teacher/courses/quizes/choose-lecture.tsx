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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { getAllChapters } from "@/services/teacher/courses";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  selectedLecture: z.string().nonempty({ message: "برجاء اختيار الدرس" }),
});

type FormValues = z.infer<typeof FormSchema>;

type Props = {
  courseId: string | string[] | undefined;
};

function ChooseLecture({ courseId }: Props) {
  const router = useRouter();
  const { data: chapters, isLoading } = useQuery({
    queryKey: ["chapters", courseId],
    queryFn: () => getAllChapters(courseId as string),
  });
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      selectedLecture: "",
    },
  });
  useEffect(() => {
    if (chapters) {
      if (chapters.length === 0) {
        toast({
          variant: "destructive",
          title: "لا يوجد دروس لهذا الكورس",
        });
        router.push(`/teacher/courses`);
      }
    }
  }, [chapters]);
  if (!chapters)
    return (
      <div className=" flex items-center justify-center">
        <Loader2 className="animate-spin text-secondary" size={50} />
      </div>
    );
  return (
    <div className="bg-card/40 backdrop-blur-md border border-primary/10 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="relative z-10 px-10 pt-10 mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">برجاء تحديد الدرس</h2>
        <p className="text-tech-grey text-lg font-medium">
          اختر الدرس الذي ترغب في اضافة الاختبار اليه من القائمة التالية
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) =>
            router.push(
              `/teacher/courses/${courseId}/choose-lecture/${data.selectedLecture}/create-quiz`,
            ),
          )}
          className="relative z-10 px-10 pb-10"
        >
          <FormField
            control={form.control}
            name="selectedLecture"
            render={({ field }) => (
              <FormItem className="space-y-3 mb-8">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-6"
                  >
                    {chapters.map((chapter) => {
                      return (
                        <div
                          key={chapter.id}
                          className="bg-card/30 border border-primary/10 rounded-2xl p-6 relative overflow-hidden group/chapter"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] pointer-events-none" />
                          <h1 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                            <div className="w-2 h-2 bg-primary rounded-full shadow-neon-glow" />
                            {chapter.name}
                          </h1>
                          <div className="flex flex-col space-y-3 relative z-10">
                            {chapter.lectures.map((lecture) => {
                              const isSelected = field.value === lecture.id;
                              return (
                                <FormItem
                                  key={lecture.id}
                                  className={cn(
                                    "flex items-center justify-between bg-card/20 border rounded-xl space-y-0 transition-all cursor-pointer group/item",
                                    isSelected
                                      ? "border-primary/50 bg-primary/5 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
                                      : "border-primary/5 hover:border-primary/20 hover:bg-card/40",
                                  )}
                                  onClick={() => field.onChange(lecture.id)}
                                >
                                  <FormLabel
                                    className={cn(
                                      "text-lg font-medium transition-colors flex-1 p-5 cursor-pointer",
                                      isSelected
                                        ? "text-primary"
                                        : "text-tech-grey group-hover/item:text-white",
                                    )}
                                  >
                                    {lecture.title}
                                  </FormLabel>
                                  <FormControl>
                                    <div className="pe-5">
                                      <RadioGroupItem
                                        className="border-primary/50 text-primary focus:ring-primary"
                                        value={lecture.id}
                                      />
                                    </div>
                                  </FormControl>
                                </FormItem>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-end pt-4 border-t border-primary/10">
            <Button
              size="lg"
              type="submit"
              disabled={isLoading || !form.getValues("selectedLecture")}
              className="text-background h-14 px-12 text-lg font-bold shadow-neon-glow rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "جاري التحميل..." : "التالي"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default ChooseLecture;
