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
import { getAllChapters } from "@/services/admin/courses";
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
        router.push(`/admin/courses`);
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
      <div className="relative z-10 px-10 pt-10">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
          <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
          برجاء تحديد الدرس
        </h1>
        <h2 className="text-tech-grey text-lg font-medium mb-8">
          اختر الدرس الذي ترغب في اضافة الاختبار اليه
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) =>
            router.push(
              `/admin/courses/${courseId}/choose-lecture/${data.selectedLecture}/create-quiz`
            )
          )}
          className="relative z-10 px-10 pb-10"
        >
          <FormField
            control={form.control}
            name="selectedLecture"
            render={({ field }) => (
              <FormItem className="space-y-3 mb-5">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {chapters.map((chapter) => {
                      return (
                        <div
                          key={chapter.id}
                          className="bg-card/30 border border-primary/10 rounded-2xl p-6 mb-6"
                        >
                          <h1 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            {chapter.name}
                          </h1>
                          <div className="flex flex-col space-y-4">
                            {chapter.lectures.map((lecture) => {
                              return (
                                <FormItem
                                  key={lecture.id}
                                  className="flex items-center justify-between bg-card/20 border border-primary/5 hover:border-primary/20 rounded-xl space-y-0 transition-all group"
                                >
                                  <FormLabel className="text-lg font-medium text-tech-grey group-hover:text-white flex-1 p-4 cursor-pointer">
                                    {lecture.title}
                                  </FormLabel>
                                  <FormControl>
                                    <RadioGroupItem
                                      className="me-4 border-primary/50 text-primary"
                                      value={lecture.id}
                                    />
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
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              size="lg"
              type="submit"
              disabled={isLoading || !form.formState.isDirty}
              className="text-background h-12 px-10 text-lg font-bold shadow-neon-glow rounded-xl transition-all active:scale-[0.98]"
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
