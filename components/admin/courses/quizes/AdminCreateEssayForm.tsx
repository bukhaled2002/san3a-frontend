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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  AllEssay,
  getEssay,
  SingleEssayQuestion,
} from "@/services/admin/essay";
import { SingleMCQQuestion } from "@/services/admin/mcq";
import { createQuizEssay, getAllEssays } from "@/services/quizEssay";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { PlusIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  title: z.string().nonempty("اسم الامتحان مطلوب"),
  duration: z.string().nonempty("الوقت مطلوب"),

  QuestionEssay: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      figure: z.array(z.string()),
      // .refine(
      //   (choices) => {
      //     const correctChoices = choices.filter((choice) => choice.isCorrect);
      //     return correctChoices.length === 1;
      //   },
      //   {
      //     message: "يجب ان يكون اختيار واحد صحيح",
      //   }
      // ),
    })
  ),
});

type FormValues = z.infer<typeof FormSchema>;

type Props = {
  courseId: string | string[] | undefined;
  lectureId: string | string[] | undefined;
};

function AdminCreateEssayForm({ courseId, lectureId }: Props) {
  const router = useRouter();
  const [toggleStates, setToggleStates] = useState<boolean[]>([]);
  const {
    data: allEssays,
    isFetching,
    error,
  } = useQuery<AllEssay>({
    queryKey: ["allEssays"],
    queryFn: () => getEssay(),
  });
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      duration: "",
      QuestionEssay: [
        {
          id: "",
          question: "",
          figure: [""],
        },
      ],
    },
  });
  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    name: "QuestionEssay",
    control: form.control,
  });

  function addQuestion() {
    appendQuestion({
      id: "",
      question: "",
      figure: [],
    });
    setToggleStates((prev) => [...prev, false]);
  }

  useEffect(() => {
    if (!courseId || !lectureId) {
      router.push(`/admin/courses`);
    }
  }, [courseId, lectureId]);

  function toggleSwitch(index: number) {
    setToggleStates((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  }
  async function onSubmit(data: FormValues) {
    const cleanedData = {
      ...data,
      QuestionEssay: data.QuestionEssay.map((question) => {
        const { id, ...rest } = question;
        return id ? { id, ...rest } : rest;
      }),
      lectureId: lectureId as string,
    };
    try {
      await createQuizEssay(cleanedData);
      toast({
        title: "تم انشاء الامتحان المقالي بنجاح",
      });
      router.push(`/admin/courses`);
    } catch (error) {
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
          قم بإضافة أسئلة مقالية وتحديد تفاصيل الامتحان للطلاب
        </h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <Separator className="bg-primary/10 md:w-[600px] mx-auto h-1 rounded-full my-8" />
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel
                    className={cn(
                      "text-white text-lg font-bold mb-3 block",
                      form.formState.errors?.title && "text-red-500"
                    )}
                  >
                    اسم الامتحان
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
            <FormField
              name="duration"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={cn(
                      "text-white text-lg font-bold mb-3 block",
                      form.formState.errors?.duration && "text-red-500"
                    )}
                  >
                    وقت الامتحان (بالدقائق)
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
          </div>
          {questionFields.map((question, index) => {
            return (
              <div key={question.id}>
                <Separator className="bg-primary/10 md:w-[600px] mx-auto h-1 rounded-full my-16" />
                <div className="flex items-center gap-[24px] mb-[24px]">
                  <Label htmlFor="question-bank" className="text-white text-lg font-bold">
                    اختر من بنك الاسئلة
                  </Label>
                  <Switch
                    id={`question-bank-${index}`}
                    checked={toggleStates[index] || false}
                    onCheckedChange={() => toggleSwitch(index)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                {toggleStates[index] && (
                  <>
                    <div className="flex items-end gap-x-5 mb-5">
                      <FormField
                        name={`QuestionEssay.${index}.id`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel
                              className={cn(
                                "text-white text-lg font-bold mb-3 block",
                                form.formState.errors?.QuestionEssay?.[index]
                                  ?.question && "text-red-500"
                              )}
                            >
                              اختر السؤال من البنك
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all">
                                  <SelectValue placeholder="اختر السؤال" />
                                </SelectTrigger>
                                <SelectContent>
                                  {allEssays?.questions?.map(
                                    (item: SingleEssayQuestion) => (
                                      <SelectItem
                                        value={item?.id}
                                        key={item?.id}
                                      >
                                        {item?.question}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
                {!toggleStates[index] && (
                  <>
                    <div className="flex items-end gap-x-5 mb-5">
                      <FormField
                        name={`QuestionEssay.${index}.question`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel
                              className={cn(
                                "text-white text-lg font-bold mb-3 block",
                                form.formState.errors?.QuestionEssay?.[index]
                                  ?.question && "text-red-500"
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

                      {questionFields.length > 1 && (
                          <Button
                            onClick={() => removeQuestion(index)}
                            type="button"
                            className="group bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 font-bold transition-all"
                          >
                            <Trash2 className="w-5 h-5 me-[6px] transition-transform group-hover:scale-110" />
                            حذف السؤال
                          </Button>
                      )}
                    </div>
                    <FormField
                      name={`QuestionEssay.${index}.figure`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel
                            className={cn(
                              "text-white text-lg font-bold mb-3 block",
                              form.formState.errors?.QuestionEssay?.[index]
                                ?.figure && "text-red-500"
                            )}
                          >
                            الصور التوضيحية (Figures)
                          </FormLabel>
                          <div className="space-y-4">
                            {form
                              .getValues(`QuestionEssay.${index}.figure`)
                              .map((figure, figIndex) => (
                                <div
                                  key={figIndex}
                                  className="flex items-center gap-4"
                                >
                                  <Input
                                    className="flex-1 border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                                    {...form.register(
                                      `QuestionEssay.${index}.figure.${figIndex}`
                                    )}
                                    defaultValue={figure}
                                  />
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      const currentFigures = form.getValues(
                                        `QuestionEssay.${index}.figure`
                                      );
                                      form.setValue(
                                        `QuestionEssay.${index}.figure`,
                                        currentFigures.filter(
                                          (_, removeIndex) =>
                                            removeIndex !== figIndex
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
                                  `QuestionEssay.${index}.figure`
                                );
                                form.setValue(`QuestionEssay.${index}.figure`, [
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
                  </>
                )}
                {index === questionFields.length - 1 && (
                  <div className="flex justify-between gap-x-5 mt-5">
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
            );
          })}
        </form>
      </Form>
    </div>
  );
}

export default AdminCreateEssayForm;
