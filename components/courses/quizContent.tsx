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
import { toast } from "@/components/ui/use-toast";
import { getQuizById, submitQuiz } from "@/services/public/quizes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import { getEssayById, submitEssay } from "@/services/public/essays";
import { Textarea } from "../ui/textarea";
import { getExamById, submitExam } from "@/services/public/exam";

const FormSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string(),
        choiceId: z.string(),
      })
    )
    .optional(),
  essayAnswers: z
    .array(
      z.object({
        questionEssayId: z.string(),
        answerEssay: z.string().min(1, "الإجابة مطلوبة"),
      })
    )
    .optional(),
  examAnswers: z
    .object({
      mcqAnswers: z
        .array(
          z.object({
            questionId: z.string(),
            choiceId: z.string(),
          })
        )
        .optional(),
      essayAnswers: z
        .array(
          z.object({
            questionEssayId: z.string(),
            answerEssay: z.string().min(1, "الإجابة مطلوبة"),
          })
        )
        .optional(),
    })
    .optional(),
});

type FormValues = z.infer<typeof FormSchema>;

type Props = {
  courseId: string;
  lectureId: string;
  quizId: string;
};

type MCQAnswer = {
  id: string;
  text?: string;
  answer?: string;
};

function QuizContent({ courseId, lectureId, quizId }: Props) {
  const router = useRouter();
  const [timer, setTimer] = useState<number>(0);

  const { data: mcqData, error: mcqError } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => getQuizById(quizId),
    retry: 1,
  });

  const { data: essayData, error: essayError } = useQuery({
    queryKey: ["essay", quizId],
    queryFn: () => getEssayById(quizId),
    retry: 1,
    enabled: !!mcqData && !mcqError,
  });

  const { data: examData, error: examError } = useQuery({
    queryKey: ["exam", quizId],
    queryFn: () => getExamById(quizId),
    retry: 1,
    enabled: !!mcqData && !essayData && !mcqError && !essayError,
  });

  let quizData;
  if (mcqData?.message) {
    quizData = examData || essayData;
  } else {
    quizData = mcqData || essayData || examData;
  }

  const questions =
    quizData === mcqData
      ? mcqData?.questions
      : quizData === essayData
      ? essayData?.QuestionEssay
      : [
          ...(examData?.Quiz?.questions || []),
          ...(examData?.QuizEssay?.QuestionEssay || []),
        ];

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      answers: [],
      essayAnswers: [],
      examAnswers: {
        mcqAnswers: [],
        essayAnswers: [],
      },
    },
  });

  useEffect(() => {
    if (quizData) {
      setTimer(parseInt(quizData.duration));
    }
  }, [quizData]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => Math.max(prev - 1, 0));
    }, 60000);

    return () => clearInterval(interval);
  }, [timer]);

  const { mutate: SubmitQuiz, isPending: isSubmitting } = useMutation({
    mutationFn: (data: FormValues) => {
      console.log("Submitting MCQ quiz:", data);
      return submitQuiz(quizId, data.answers || []);
    },
    onSuccess: () => {
      toast({ title: "تم تسليم الاختبار بنجاح" });
      router.push(
        `/courses/${courseId}/lecture/${lectureId}/quiz/${quizId}/results`
      );
    },
    onError: (error) => {
      console.error("Quiz submission error:", error);
    },
  });

  const { mutate: SubmitEssay, isPending: isSubmittingEssay } = useMutation({
    mutationFn: (data: FormValues) => {
      const essayAnswers = data.essayAnswers?.map((answer) => ({
        questionEssayId: answer.questionEssayId,
        answerEssay: answer.answerEssay,
      }));
      console.log("Submitting essay:", essayAnswers);
      return submitEssay(quizId, essayAnswers || []);
    },
    onSuccess: () => {
      toast({ title: "تم تسليم الاختبار بنجاح" });
      router.push(
        `/courses/${courseId}/lecture/${lectureId}/quiz/${quizId}/results`
      );
    },
    onError: (error) => {
      console.error("Essay submission error:", error);
    },
  });

  const { mutate: SubmitExam, isPending: isSubmittingExam } = useMutation({
    mutationFn: (data: {
      mcqAnswers: { questionId: string; choiceId: string }[];
      essayAnswers: { questionEssayId: string; answerEssay: string }[];
    }) => {
      console.log("Submitting exam:", data);
      return submitExam(quizId, data);
    },
    onSuccess: () => {
      toast({ title: "تم تسليم الاختبار بنجاح" });
      router.push(
        `/courses/${courseId}/lecture/${lectureId}/quiz/${quizId}/results`
      );
    },
    onError: (error) => {
      console.error("Exam submission error:", error);
    },
  });

  const handleSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    console.log(
      "Quiz type:",
      quizData === mcqData ? "MCQ" : quizData === essayData ? "Essay" : "Exam"
    );

    if (quizData === examData) {
      const mcqAnswers =
        data.examAnswers?.mcqAnswers?.filter(
          (answer) => answer.choiceId && answer.questionId
        ) || [];
      const essayAnswers =
        data.examAnswers?.essayAnswers?.filter(
          (answer) => answer.answerEssay && answer.questionEssayId
        ) || [];
      SubmitExam({ mcqAnswers, essayAnswers });
      return;
    }

    if (quizData === essayData) {
      const essayAnswers =
        data.essayAnswers?.filter((answer) => answer.answerEssay) || [];
      SubmitEssay({ essayAnswers });
      return;
    }

    const answers = data.answers?.filter((answer) => answer.choiceId) || [];
    SubmitQuiz({ answers });
  };

  if (!quizData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-secondary" size={80} />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between flex-wrap gap-7">
        <div className="md:text-lg text-[#121212B2]/70 font-medium flex items-center gap-x-[13px]">
          الاختبار:{" "}
          <span className="text-[#5949BE] md:text-2xl font-bold">
            {quizData?.title}
          </span>
        </div>
        <div className="md:text-lg text-[#121212B2]/70 font-medium flex items-center gap-x-[13px]">
          الوقت:{" "}
          <span
            className={`md:text-2xl font-bold ${
              timer <= 5 ? "text-red-500" : "text-[#5949BE]"
            }`}
          >
            {timer} دقيقة
          </span>
        </div>
        <div className="md:text-lg text-[#121212B2]/70 font-medium flex items-center gap-x-[13px]">
          عدد الاسئلة:{" "}
          <span className="text-[#5949BE] md:text-2xl font-bold">
            {questions?.length}
          </span>
        </div>
      </div>
      <Separator className="sm:my-10 my-5" />
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(form.getValues());
          }}
        >
          {questions?.map((question: any, index) => (
            <div key={question.id}>
              <h1 className="sm:text-2xl text-xl text-[#000] font-bold mb-6 sm:mb-[42px]">
                {index + 1}: {question.question}
              </h1>

              {quizData === mcqData && (
                <FormField
                  control={form.control}
                  name={`answers.${index}.choiceId`}
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            form.setValue(`answers.${index}`, {
                              questionId: question.id,
                              choiceId: value,
                            });
                          }}
                          defaultValue={field.value}
                        >
                          {question?.answers?.map((answer: MCQAnswer) => (
                            <FormItem key={answer.id} className="sm:mb-6 mb-3">
                              <FormControl>
                                <RadioGroupItem value={answer.id} />
                              </FormControl>
                              <FormLabel>{answer.text}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {quizData === essayData && (
                <FormField
                  control={form.control}
                  name={`essayAnswers.${index}.answerEssay`}
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <Textarea
                          placeholder="اكتب الاجابة هنا"
                          value={field.value}
                          onChange={(e) => {
                            form.setValue(`essayAnswers.${index}`, {
                              questionEssayId: question.id,
                              answerEssay: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {quizData === examData &&
                (question?.choices?.length ? (
                  <FormField
                    control={form.control}
                    name={`examAnswers.mcqAnswers.${index}.choiceId`}
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              form.setValue(`examAnswers.mcqAnswers.${index}`, {
                                questionId: question.id,
                                choiceId: value,
                              });
                            }}
                            defaultValue={field.value}
                          >
                            {question?.choices?.map((answer: MCQAnswer) => (
                              <FormItem
                                key={answer.id}
                                className="sm:mb-6 mb-3"
                              >
                                <FormControl>
                                  <RadioGroupItem
                                    value={answer.id}
                                    className="me-4"
                                  />
                                </FormControl>
                                <FormLabel>{answer.answer}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name={`examAnswers.essayAnswers.${index}.answerEssay`}
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <Textarea
                            placeholder="اكتب الاجابة هنا"
                            value={field.value}
                            onChange={(e) => {
                              form.setValue(
                                `examAnswers.essayAnswers.${index}`,
                                {
                                  questionEssayId: question.id,
                                  answerEssay: e.target.value,
                                }
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

              <Separator className="sm:my-10 my-5" />
            </div>
          ))}

          <Button
            size="lg"
            disabled={isSubmitting || isSubmittingEssay || isSubmittingExam}
            className="sm:w-auto w-full mt-5"
            type="submit"
          >
            {isSubmitting || isSubmittingEssay || isSubmittingExam
              ? "جاري التحميل..."
              : "تسليم"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default QuizContent;
