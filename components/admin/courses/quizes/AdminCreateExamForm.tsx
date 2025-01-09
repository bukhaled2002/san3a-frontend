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

      console.log(payload);

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
    <div className="bg-white p-10 rounded-[12px]">
      <div className="mb-7">
        <h1 className="text-2xl font-bold">برجاء اضافة الاسئلة</h1>
        <h2 className="text-[#121212B2]/70 text-lg font-semibold mb-[28.5px]">
          برجاء تحديد الدورة التعليمية والفصل والدرس الذي سيتم اجراء امتحان خاص
          بهم
        </h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-[665px] m-auto">
            <Separator className="my-6 h-1 w-[600px] m-auto rounded-lg mb-[41.5px]" />
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel
                    className={cn(
                      "text-[#202224] text-lg font-semibold",
                      form.formState.errors?.title && "text-red-500"
                    )}
                  >
                    اسم الامتحان
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-secondary bg-[#F5F6F8] h-12 border border-[#00000026]/15 rounded-[4px]"
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
                      "text-[#202224] text-lg font-semibold",
                      form.formState.errors?.duration && "text-red-500"
                    )}
                  >
                    وقت الامتحان
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-secondary bg-[#F5F6F8] h-12 border border-[#00000026]/15 rounded-[4px]"
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
              <Separator className="h-1 w-[600px] m-auto rounded-lg my-[74px]" />

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-[24px]">
                  <Label htmlFor="question-bank" className="text-[16px]">
                    اختر من بنك الاسئلة
                  </Label>
                  <Switch
                    id={`question-bank-${index}`}
                    checked={toggleStates[index] || false}
                    onCheckedChange={() => toggleSwitch(index)}
                  />
                </div>

                <div className="flex items-center gap-[24px]">
                  <Label htmlFor="question-type" className="text-[16px]">
                    نوع السؤال:{" "}
                    {questionTypes[index] === "mcq" ? "اختيار متعدد" : "مقالي"}
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
                            "text-[#202224] text-lg font-semibold mb-5",
                            form.formState.errors?.questions?.[index]
                              ?.question && "text-red-500"
                          )}
                        >
                          اختر السؤال
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
                            <SelectTrigger className="focus-visible:ring-secondary bg-[#F5F6F8] h-12 border border-[#00000026]/15 rounded-[4px]">
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
                              "text-[#202224] text-lg font-semibold mb-5",
                              form.formState.errors?.questions?.[index]
                                ?.question && "text-red-500"
                            )}
                          >
                            عنوان السؤال
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="focus-visible:ring-secondary bg-[#F5F6F8] h-12 border border-[#00000026]/15 rounded-[4px]"
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
                        className="group bg-red-500 hover:bg-red-700 text-white border border-red-600 font-bold"
                      >
                        <Trash2 className="w-5 h-5 me-[6px] rounded-full text-white" />
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
                            "text-[#202224] text-lg font-semibold mb-5",
                            form.formState.errors?.questions?.[index]?.figure &&
                              "text-red-500"
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
                                  className="flex-1 focus-visible:ring-secondary bg-[#F5F6F8] h-12 border border-[#00000026]/15 rounded-[4px]"
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
                                  className="bg-red-500 hover:bg-red-700 text-white"
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
                            className="bg-[#E4E0FF] hover:bg-[#4635B7] text-[#4635B7] hover:text-[#E4E0FF]"
                          >
                            <PlusIcon className="w-5 h-5" />
                            اضافة Figure
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
                    className="group bg-[#E4E0FF] hover:bg-[#4635B7] text-[#4635B7] hover:text-[#E4E0FF] border border-[#7864FF] font-bold"
                  >
                    <PlusIcon className="w-5 h-5 me-[6px] bg-[#4635B7] group-hover:bg-[#E4E0FF] rounded-full text-[#E4E0FF] group-hover:text-[#4635B7]" />
                    اضافة سؤال
                  </Button>
                  <Button
                    variant="secondary"
                    className="text-white"
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
