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
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import AdminNestedQuizQuestions from "./quiz-questions";
import { toast } from "@/components/ui/use-toast";
import { isAxiosError } from "axios";
import { createQuiz } from "@/services/quiz";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { AllMCQ, getMCQ, SingleMCQQuestion } from "@/services/admin/mcq";

const FormSchema = z.object({
  title: z.string().nonempty("اسم الامتحان مطلوب"),
  duration: z.string().nonempty("الوقت مطلوب"),

  questions: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      figure: z.array(z.string()),
      choices: z.array(
        z.object({
          answer: z.string(),
          isCorrect: z.boolean(),
        })
      ),
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

function AdminCreateQuizeForm({ courseId, lectureId }: Props) {
  const router = useRouter();
  const [toggleStates, setToggleStates] = useState<boolean[]>([]);
  const {
    data: allmcq,
    isFetching,
    error,
  } = useQuery<AllMCQ>({
    queryKey: ["allmcq"],
    queryFn: () => getMCQ(),
  });
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      duration: "",
      questions: [
        {
          id: "",
          question: "",
          figure: [""],
          choices: [
            {
              answer: "",
              isCorrect: false,
            },
            {
              answer: "",
              isCorrect: false,
            },
          ],
        },
      ],
    },
  });
  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    name: "questions",
    control: form.control,
  });

  function addQuestion() {
    appendQuestion({
      id: "",
      question: "",
      figure: [],
      choices: [
        {
          answer: "",
          isCorrect: false,
        },
        {
          answer: "",
          isCorrect: false,
        },
      ],
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
      questions: data.questions.map((question) => {
        const { id, ...rest } = question;
        return id ? { id, ...rest } : rest;
      }),
      lectureId: lectureId as string,
    };
    try {
      await createQuiz(cleanedData);
      toast({
        title: "تم انشاء الامتحان بنجاح",
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
    <div className="bg-card/40 backdrop-blur-md border border-primary/10 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="mb-7 relative z-10 px-10 pt-10">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
          <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
          برجاء اضافة الاسئلة
        </h1>
        <h2 className="text-tech-grey text-lg font-medium">
          قم بتحديد تفاصيل الامتحان والأسئلة الخاصة بالدرس
        </h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-[665px] m-auto">
            <Separator className="my-6 h-[1px] bg-primary/10 w-[600px] m-auto mb-[41.5px]" />
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
                    وقت الامتحان
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
                <Separator className="h-[1px] bg-primary/10 w-[600px] m-auto my-[74px]" />
                <div className="flex items-center gap-[24px] mb-[24px]">
                  <Label htmlFor="question-bank" className="text-white font-bold">
                    اختر من بنك الاسئلة
                  </Label>
                  <Switch
                    id={`question-bank-${index}`}
                    checked={toggleStates[index] || false}
                    onCheckedChange={() => toggleSwitch(index)}
                  />
                </div>
                {toggleStates[index] && (
                  <>
                    <div className="flex items-end gap-x-5 mb-5">
                      <FormField
                        name={`questions.${index}.id`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel
                              className={cn(
                                "text-white text-lg font-bold mb-3 block",
                                form.formState.errors?.questions?.[index]
                                  ?.question && "text-red-500"
                              )}
                            >
                              اختر السؤال
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all">
                                  <SelectValue placeholder="اختر السؤال" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-primary/10 text-white">
                                  {allmcq?.questions?.map(
                                    (item: SingleMCQQuestion) => (
                                      <SelectItem
                                        value={item?.id}
                                        key={item?.id}
                                        className="focus:bg-primary/20 focus:text-white"
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
                        name={`questions.${index}.question`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel
                              className={cn(
                                "text-white text-lg font-bold mb-3 block",
                                form.formState.errors?.questions?.[index]
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
                      name={`questions.${index}.figure`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel
                            className={cn(
                              "text-white text-lg font-bold mb-3 block",
                              form.formState.errors?.questions?.[index]
                                ?.figure && "text-red-500"
                            )}
                          >
                            Figure
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
                                          (_, removeIndex) =>
                                            removeIndex !== figIndex
                                        )
                                      );
                                    }}
                                    className="bg-red-500/10 hover:bg-red-500 text-red-500 border border-red-500/20"
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
                              className="group bg-primary/10 hover:bg-primary text-primary hover:text-background border border-primary/20 font-bold transition-all"
                            >
                              <PlusIcon className="w-5 h-5 me-[6px] transition-transform group-hover:rotate-90" />
                              اضافة Figuare
                            </Button>
                          </div>
                        </FormItem>
                      )}
                    />

                    <AdminNestedQuizQuestions
                      key={index}
                      choiceIndex={index}
                      form={form}
                    />
                  </>
                )}
                {index === questionFields.length - 1 && (
                  <div className="flex justify-between gap-x-5">
                    <Button
                      onClick={addQuestion}
                      type="button"
                      className="group bg-primary/10 hover:bg-primary text-primary hover:text-background border border-primary/20 font-bold transition-all"
                    >
                      <PlusIcon className="w-5 h-5 me-[6px] transition-transform group-hover:rotate-90" />
                      اضافة سؤال
                    </Button>
                    <Button
                      type="submit"
                      className="text-background h-12 text-lg font-bold shadow-neon-glow rounded-xl transition-all active:scale-[0.98]"
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

export default AdminCreateQuizeForm;
