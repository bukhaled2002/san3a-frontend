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
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4"
    >
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          إجابة الطالب
        </label>
        <div className="p-4 bg-gray-50 rounded-lg text-gray-700 text-sm">
          {answer.answer}
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="score"
          className="block text-sm font-medium text-gray-700"
        >
          الدرجة
        </label>
        <input
          id="score"
          type="number"
          min={0}
          defaultValue={answer.grade || 0}
          {...register("score", { required: true })}
          className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className={`
            w-full sm:w-auto px-6 py-2.5 rounded-md text-white text-sm font-medium
            transition-colors
            ${
              isSubmitting || mutation.isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 active:bg-primary/95"
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
