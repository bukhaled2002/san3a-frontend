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
import AdminNestedQuizQuestions from "./quiz-questions";
import { toast } from "@/components/ui/use-toast";
import { isAxiosError } from "axios";
import { createQuiz } from "@/services/quiz";
import { createMSQ } from "@/services/admin/mcq";

const FormSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().nonempty("السؤال مطلوب"),
      figure: z.array(z.string().nonempty("المدخل مطلوب")),
      choices: z
        .array(
          z.object({
            answer: z.string().nonempty("الاجابة مطلوبة"),
            isCorrect: z.boolean(),
          })
        )
        .refine(
          (choices) => {
            const correctChoices = choices.filter((choice) => choice.isCorrect);
            return correctChoices.length === 1;
          },
          {
            message: "يجب ان يكون اختيار واحد صحيح",
          }
        ),
    })
  ),
});

type FormValues = z.infer<typeof FormSchema>;

function AdminCreateQuizeFormMCQ() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      questions: [
        {
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
    });
  }

  async function onSubmit(data: FormValues) {
    const newData = {
      ...data,
    };
    try {
      await createMSQ(newData);
      toast({
        title: "تم انشاء الامتحان بنجاح",
      });
      router.push("/admin/question-bank/mcq");
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
          {questionFields.map((question, index) => (
            <div key={question.id}>
              <Separator className="h-1 w-[600px] m-auto rounded-lg my-[74px]" />
              <div className="flex items-end gap-x-5 mb-5">
                <FormField
                  name={`questions.${index}.question`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel
                        className={cn(
                          "text-[#202224] text-lg font-semibold mb-5",
                          form.formState.errors?.questions?.[index]?.question &&
                            "text-red-500"
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
                render={() => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold mb-5">
                      Figures
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
                                    (_, removeIndex) => removeIndex !== figIndex
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
              {index === questionFields.length - 1 && (
                <div className="flex justify-between gap-x-5">
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

export default AdminCreateQuizeFormMCQ;
