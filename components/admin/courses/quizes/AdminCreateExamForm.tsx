import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { PlusIcon, Trash2 } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

import AdminNestedQuizQuestions from "./quiz-questions";
import { AllMCQ, getMCQ } from "@/services/admin/mcq";
import { AllEssay, getEssay } from "@/services/admin/essay";
import { createExam } from "@/services/exam";

const FormSchema = z.object({
  title: z.string().nonempty("اسم الامتحان مطلوب"),
  duration: z.string().nonempty("الوقت مطلوب"),
  questions: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      type: z.enum(["mcq", "essay"]),
      figure: z.array(z.string()),
      choices: z
        .array(
          z.object({
            answer: z.string(),
            isCorrect: z.boolean(),
          })
        )
        .optional(),
    })
  ),
});

type FormValues = z.infer<typeof FormSchema>;

type Props = {
  courseId: string | string[] | undefined;
  lectureId: string | string[] | undefined;
};

function AdminCreateExamForm({ courseId, lectureId }: Props) {
  const router = useRouter();
  const [toggleStates, setToggleStates] = useState<boolean[]>([]);
  const [questionTypes, setQuestionTypes] = useState<("mcq" | "essay")[]>([]);

  const { data: allmcq } = useQuery<AllMCQ>({
    queryKey: ["allmcq"],
    queryFn: () => getMCQ(),
  });

  const { data: allessays } = useQuery<AllEssay>({
    queryKey: ["allessays"],
    queryFn: () => getEssay(),
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
          type: "mcq",
          figure: [""],
          choices: [
            { answer: "", isCorrect: false },
            { answer: "", isCorrect: false },
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
      type: "mcq",
      figure: [""],
      choices: [
        { answer: "", isCorrect: false },
        { answer: "", isCorrect: false },
      ],
    });
    setToggleStates((prev) => [...prev, false]);
    setQuestionTypes((prev) => [...prev, "mcq"]);
  }

  function toggleQuestionType(index: number) {
    const newTypes = [...questionTypes];
    newTypes[index] = newTypes[index] === "mcq" ? "essay" : "mcq";
    setQuestionTypes(newTypes);

    const currentQuestion = form.getValues(`questions.${index}`);
    if (newTypes[index] === "essay") {
      form.setValue(`questions.${index}`, {
        ...currentQuestion,
        type: "essay",
        choices: undefined,
      });
    } else {
      form.setValue(`questions.${index}`, {
        ...currentQuestion,
        type: "mcq",
        choices: [
          { answer: "", isCorrect: false },
          { answer: "", isCorrect: false },
        ],
      });
    }
  }

  function toggleSwitch(index: number) {
    setToggleStates((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  }

  useEffect(() => {
    if (!courseId || !lectureId) {
      router.push(`/admin/courses`);
    }
  }, [courseId, lectureId]);

  useEffect(() => {
    setToggleStates(form.getValues("questions").map(() => false));
    setQuestionTypes(form.getValues("questions").map((q) => q.type));
  }, [form]);

  async function onSubmit(data: FormValues) {
    try {
      const mcqQuestions = data.questions
        .filter((q) => q.type === "mcq")
        .map((question) => ({
          question: question.question,
          explanation: "explanation",
          attachment: "attachment_Url",
          figure: question.figure,
          choices: question.choices?.map((choice) => ({
            answer: choice.answer,
            isCorrect: choice.isCorrect,
          })),
        }));
      const essayQuestions = data.questions
        .filter((q) => q.type === "essay")
        .map((question) => ({
          question: question.question,
          explanation: "explanation",
          attachment: "attachment_Url",
          figure: question.figure,
        }));

      const payload = {
        title: data.title,
        duration: data.duration,
        lectureId: lectureId as string,
        // chapterId: "e7ae75f1-8a8b-4e4d-97c3-5fc996772bf7",
        Quiz:
          mcqQuestions.length > 0
            ? {
                title: `${data.title} - MCQ Section`,
                questions: mcqQuestions,
              }
            : undefined,
        QuizEssay:
          essayQuestions.length > 0
            ? {
                title: `${data.title} - Essay Section`,
                QuestionEssay: essayQuestions,
              }
            : undefined,
      };


      await createExam(payload);

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
    <div className="bg-card/40 backdrop-blur-md border border-primary/10 py-12 px-6 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="mb-12 relative z-10">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-primary rounded-full shadow-neon-glow" />
          برجاء اضافة الاسئلة
        </h1>
        <h2 className="text-tech-grey text-lg font-medium">
          قم بإضافة أسئلة متنوعة (MCQ ومقالي) وتحديد تفاصيل الامتحان الشامل
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

          {questionFields.map((question, index) => (
            <div key={question.id}>
              <Separator className="bg-primary/10 md:w-[600px] mx-auto h-1 rounded-full my-16" />

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-[24px]">
                  <Label htmlFor="question-bank" className="text-white text-lg font-bold">
                    اختر من بنك الاسئلة
                  </Label>
                  <Switch
                    id={`question-bank-${index}`}
                    checked={toggleStates[index] || false}
                    onCheckedChange={() => toggleSwitch(index)}
                  />
                </div>

                <div className="flex items-center gap-[24px]">
                  <Label htmlFor="question-type" className="text-white text-lg font-bold">
                    نوع السؤال:{" "}
                    <span className="text-primary">
                      {questionTypes[index] === "mcq" ? "اختيار متعدد" : "مقالي"}
                    </span>
                  </Label>
                  <Switch
                    id={`question-type-${index}`}
                    checked={questionTypes[index] === "mcq"}
                    onCheckedChange={() => toggleQuestionType(index)}
                  />
                </div>
              </div>

              {toggleStates[index] ? (
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
                          اختر السؤال من البنك
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(selectedId) => {
                              const selectedQuestion = (
                                questionTypes[index] === "mcq"
                                  ? allmcq?.questions
                                  : allessays?.questions
                              )?.find((q) => q.id === selectedId);

                              field.onChange(selectedId);
                              form.setValue(
                                `questions.${index}.question`,
                                selectedQuestion?.question || ""
                              );
                              if (
                                questionTypes[index] === "mcq" &&
                                selectedQuestion?.choices
                              ) {
                                form.setValue(
                                  `questions.${index}.choices`,
                                  selectedQuestion.choices
                                );
                              } else {
                                form.setValue(`questions.${index}.choices`, []);
                              }
                            }}
                            value={field.value}
                          >
                            <SelectTrigger className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all">
                              <SelectValue placeholder="اختر السؤال" />
                            </SelectTrigger>
                            <SelectContent>
                              {(questionTypes[index] === "mcq"
                                ? allmcq?.questions
                                : allessays?.questions
                              )?.map((item) => (
                                <SelectItem value={item?.id} key={item?.id}>
                                  {item?.question}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
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
                            form.formState.errors?.questions?.[index]?.figure &&
                              "text-red-500"
                          )}
                        >
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

                  {questionTypes[index] === "mcq" && (
                    <AdminNestedQuizQuestions choiceIndex={index} form={form} />
                  )}
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
          ))}
        </form>
      </Form>
    </div>
  );
}

export default AdminCreateExamForm;
