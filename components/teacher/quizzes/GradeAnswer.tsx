"use client";

import { patchGrade } from "@/services/public/exam";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { useForm } from "react-hook-form";

interface GradeAnswerProps {
  answer: any;
  onGradeSuccess: () => void;
}

const GradeAnswer = ({ answer, onGradeSuccess }: GradeAnswerProps) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ score: number }>();

  const mutation = useMutation({
    mutationFn: (data: { score: number; questionEssayId: string }) =>
      patchGrade(answer.quizEssayId, answer.studentId, {
        questionGrades: [
          {
            questionEssayId: data.questionEssayId,
            grade: data.score,
          },
        ],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-answers"] });
      queryClient.setQueryData(["student-answers"], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((item: any) =>
          item.id === answer.id
            ? { ...item, grade: Number(answer.grade) }
            : item
        );
      });
      onGradeSuccess();
    },
  });

  const onSubmit = (data: { score: number }) => {
    mutation.mutate({
      score: Number(data.score),
      questionEssayId: answer.questionEssayId,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-card/40 backdrop-blur-md border border-primary/10 rounded-2xl p-8 space-y-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] pointer-events-none" />
      <div className="space-y-3 relative z-10">
        <label className="block text-lg font-bold text-white">
          إجابة الطالب
        </label>
        <div className="p-5 bg-card/30 border border-primary/5 rounded-xl text-white text-base leading-relaxed">
          {answer.answer}
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        <label
          htmlFor="score"
          className="block text-lg font-bold text-white"
        >
          الدرجة
        </label>
        <input
          id="score"
          type="number"
          min={0}
          defaultValue={answer.grade || 0}
          {...register("score", { required: true })}
          className="block w-full px-4 py-3 bg-card/50 border border-primary/10 rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
        />
      </div>

      <div className="pt-6 border-t border-primary/10 relative z-10">
        <button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className={`
            w-full sm:w-auto px-10 py-3.5 rounded-xl text-background text-lg font-bold
            transition-all shadow-neon-glow active:scale-[0.98]
            ${
              isSubmitting || mutation.isPending
                ? "bg-tech-grey cursor-not-allowed opacity-50"
                : "bg-primary hover:opacity-90"
            }
          `}
        >
          {mutation.isPending ? "جاري الحفظ..." : "حفظ التقييم"}
        </button>
      </div>
    </form>
  );
};
export default GradeAnswer;
