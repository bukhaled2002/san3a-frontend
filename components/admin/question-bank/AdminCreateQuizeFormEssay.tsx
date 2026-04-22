"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { isAxiosError } from "axios";
import { createEssay } from "@/services/admin/essay";

const FormSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().nonempty("السؤال مطلوب"),
      figure: z.array(z.string().nonempty("المدخل مطلوب")),
    })
  ),
});

type FormValues = z.infer<typeof FormSchema>;

function AdminCreateQuizeFormEssay() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      questions: [
        {
          question: "",
          figure: [""],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  function addQuestion() {
    append({
      question: "",
      figure: [""],
    });
  }

  async function onSubmit(data: FormValues) {
    try {
      await createEssay(data.questions as any);
      toast({ title: "تم انشاء الامتحان بنجاح" });
      router.push("/admin/question-bank/essay");
    } catch (error) {
      const errorMessage = isAxiosError(error)
        ? error.response?.data.message || "حدث خطأ ما"
        : "حدث خطأ ما";
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="bg-card/40 backdrop-blur-md border border-primary/10 py-12 px-6 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="mb-12 relative z-10">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-primary rounded-full shadow-neon-glow" />
          برجاء اضافة الاسئلة
        </h1>
        <h2 className="text-tech-grey text-lg font-medium">
          قم بإضافة أسئلة مقالية إلى بنك الأسئلة
        </h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <div key={field.id}>
              <Separator className="bg-primary/10 md:w-[600px] mx-auto h-1 rounded-full my-16" />
              <div className="flex items-end gap-x-5 mb-5">
                <FormField
                  name={`questions.${index}.question`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel
                        className={cn(
                          "text-white text-lg font-bold mb-3 block",
                          form.formState.errors?.questions?.[index]?.question &&
                            "text-red-500"
                        )}
                      >
                        عنوان السؤال
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {fields.length > 1 && (
                  <Button
                    onClick={() => remove(index)}
                    type="button"
                    className="group bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 font-bold transition-all"
                  >
                    <Trash2 className="w-5 h-5 me-[6px] transition-transform group-hover:scale-110" />
                    حذف السؤال
                  </Button>
                )}
              </div>

              <FormField
                name={`questions.${index}.figure`}
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel className="text-white text-lg font-bold mb-3 block">
                      الصور التوضيحية (Figures)
                    </FormLabel>
                    <div className="space-y-4">
                      {form
                        .getValues(`questions.${index}.figure`)
                        .map((figure, figIndex) => (
                          <div
                            key={figIndex}
                            className="flex items-center gap-4"
                          >
                            <Input
                              className="flex-1 border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                              {...form.register(
                                `questions.${index}.figure.${figIndex}`
                              )}
                              defaultValue={figure}
                            />
                            <Button
                              type="button"
                              onClick={() => {
                                const currentFigures = form.getValues(
                                  `questions.${index}.figure`
                                );
                                form.setValue(
                                  `questions.${index}.figure`,
                                  currentFigures.filter(
                                    (_, removeIndex) => removeIndex !== figIndex
                                  )
                                );
                              }}
                              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        ))}
                      <Button
                        type="button"
                        onClick={() => {
                          const currentFigures = form.getValues(
                            `questions.${index}.figure`
                          );
                          form.setValue(`questions.${index}.figure`, [
                            ...currentFigures,
                            "",
                          ]);
                        }}
                        className="w-fit group bg-primary/10 hover:bg-primary text-primary hover:text-background border border-primary/20 font-bold transition-all"
                      >
                        <PlusIcon className="w-5 h-5 me-2 transition-transform group-hover:rotate-90" />
                        اضافة صورة توضيحية
                      </Button>
                    </div>
                  </FormItem>
                )}
              />

              {index === fields.length - 1 && (
                <div className="flex justify-between gap-x-5 mt-8">
                  <Button
                    onClick={addQuestion}
                    type="button"
                    className="group bg-primary/10 hover:bg-primary text-primary hover:text-background border border-primary/20 font-bold transition-all"
                  >
                    <PlusIcon className="w-5 h-5 me-[6px] transition-transform group-hover:rotate-90" />
                    اضافة سؤال
                  </Button>
                  <Button
                    className="text-background h-12 px-10 text-lg font-bold shadow-neon-glow rounded-xl transition-all active:scale-[0.98]"
                    type="submit"
                  >
                    انشاء الامتحان
                  </Button>
                </div>
              )}
            </div>
          ))}
        </form>
      </Form>
    </div>
  );
}

export default AdminCreateQuizeFormEssay;
