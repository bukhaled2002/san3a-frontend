"use client";

import { GetExamStudents } from "@/services/exam";
import { getEssayResults, patchGrade } from "@/services/public/exam";
import { GetQuizStudents } from "@/services/quiz";
import { GetEssayStudents } from "@/services/quizEssay";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import GradeAnswer from "./GradeAnswer";
import { toast } from "@/components/ui/use-toast";

type Student = {
  id?: string;
  studentId?: string;
  firstName: string;
  lastName: string;
  grade: number;
};

const StudentAnswers = ({ examId }: { examId: string }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [expandedAnswerId, setExpandedAnswerId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const {
    data: mcqData,
    isLoading: isLoadingMcq,
    error: mcqError,
    isSuccess: isMcqSuccess,
  } = useQuery({
    queryKey: ["admin-quiz-students", examId],
    queryFn: () => GetQuizStudents(examId),
    retry: 1,
  });

  const {
    data: essayData,
    isLoading: isLoadingEssay,
    error: essayError,
    isSuccess: isEssaySuccess,
  } = useQuery({
    queryKey: ["admin-essay-students", examId],
    queryFn: () => GetEssayStudents(examId),
    enabled: !!mcqError || (isMcqSuccess && !!mcqData?.message),
    retry: 1,
  });

  const {
    data: examData,
    isLoading: isLoadingExam,
    error: examError,
  } = useQuery({
    queryKey: ["admin-exam-students", examId],
    queryFn: () => GetExamStudents(examId),
    enabled:
      (!!mcqError || (isMcqSuccess && !!mcqData?.message)) &&
      (!!essayError || (isEssaySuccess && !!essayData?.message)),
    retry: 1,
  });

  let quizData: any;
  if (mcqData?.message) {
    quizData = examData || essayData;
  } else {
    quizData = mcqData || essayData || examData;
  }

  const {
    data: studentAnswers,
    isLoading: isLoadingAnswers,
    error: answersError,
  } = useQuery({
    queryKey: ["student-answers", selectedStudentId],
    queryFn: async () => {
      try {
        const result = await getEssayResults(examId, selectedStudentId ?? "");
        if (!result || result.length === 0) {
          if (quizData?.data?.[0]?.quizEssayId) {
            const quizResult = await getEssayResults(
              quizData.data[0].quizEssayId,
              selectedStudentId ?? ""
            );
            if (!quizResult || quizResult.length === 0) {
              toast({ title: "لا توجد إجابات متاحة" });
            }
            return quizResult;
          } else {
            toast({ title: "لا توجد إجابات متاحة" });
          }
        }
      } catch (error) {
        if (quizData?.data?.[0]?.quizEssayId) {
          try {
            const quizResult = await getEssayResults(
              quizData.data[0].quizEssayId,
              selectedStudentId ?? ""
            );
            if (!quizResult || quizResult.length === 0) {
              toast({ title: "لا توجد إجابات متاحة" });
            }
            return quizResult;
          } catch {
            toast({ title: "لا توجد إجابات متاحة" });
          }
        }
        toast({ title: "لا توجد إجابات متاحة" });
      }
    },
    enabled: !!selectedStudentId,
  });

  const isLoading = isLoadingMcq || isLoadingEssay || isLoadingExam;
  const error = mcqError && essayError && examError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-secondary" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
        role="alert"
      >
        <p>حدث خطأ أثناء تحميل البيانات</p>
      </div>
    );
  }

  console.log(quizData?.data);
  console.log(quizData?.data?.[0]?.quizEssayId, selectedStudentId);
  console.log(studentAnswers);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-card/40 backdrop-blur-md border border-primary/10 rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
        <div className="px-10 py-6 border-b border-primary/10 relative z-10">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-1.5 h-6 bg-primary rounded-full shadow-neon-glow" />
            إجابات الطلاب
          </h2>
        </div>
        <div className="p-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizData?.data.map((student: Student) => (
              <button
                key={student.id || student.studentId}
                onClick={() =>
                  setSelectedStudentId(student.id || student.studentId!!)
                }
                className={`p-6 rounded-2xl text-right transition-all border ${
                  selectedStudentId === (student.id || student.studentId)
                    ? "bg-primary text-background border-primary shadow-neon-glow scale-[1.02]"
                    : "bg-card/30 border-primary/5 hover:border-primary/20 text-white"
                }`}
              >
                <h3 className="font-bold text-lg mb-1">
                  {student.firstName} {student.lastName}
                </h3>
                <p className={`text-sm ${selectedStudentId === (student.id || student.studentId) ? "text-background/80" : "text-tech-grey"}`}>
                  الدرجة: {student.grade}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedStudentId && (
        <div className="bg-card/40 backdrop-blur-md border border-primary/10 rounded-3xl shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
          <div className="px-10 py-6 border-b border-primary/10 relative z-10">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full shadow-neon-glow" />
              إجابات{" "}
              {
                quizData?.data.find(
                  (s: any) => s.id || s.studentId === selectedStudentId
                )?.firstName
              }{" "}
              {
                quizData?.data.find(
                  (s: any) => s.id || s.studentId === selectedStudentId
                )?.lastName
              }
            </h3>
          </div>
          <div className="p-6">
            {isLoadingAnswers ? (
              <div className="text-center">جاري تحميل الإجابات...</div>
            ) : answersError ? (
              <div className="text-red-600">حدث خطأ أثناء تحميل الإجابات</div>
            ) : (
              <div className="space-y-4">
                {studentAnswers?.map((answer) => {
                  console.log("answer", answer);
                  return (
                    <div key={answer.id} className="space-y-4">
                      <div className="bg-card/30 border border-primary/5 rounded-2xl p-8 hover:border-primary/20 transition-all group">
                        <h4 className="font-bold text-primary mb-4 flex items-center gap-2 text-lg">
                          <span className="text-sm bg-primary/10 px-3 py-1 rounded-md">السؤال</span>
                          {answer.questionEssay.question}
                        </h4>
                        <div className="bg-card/20 p-6 rounded-xl text-white text-lg font-medium leading-relaxed mb-6">
                          {answer.answer}
                        </div>
                        <div className="flex justify-between items-center pt-6 border-t border-primary/10">
                          <p className="text-lg font-bold text-tech-grey">
                            الدرجة: <span className="text-white">{answer.grade || "لم يتم التقييم"}</span>
                          </p>
                          <button
                            onClick={() =>
                              setExpandedAnswerId(
                                expandedAnswerId === answer.id
                                  ? null
                                  : answer.id
                              )
                            }
                            className="px-8 py-3 bg-primary text-background font-bold rounded-xl shadow-neon-glow hover:opacity-90 transition-all active:scale-[0.98]"
                          >
                            {answer.grade ? "تعديل التقييم" : "تقييم"}
                          </button>
                        </div>
                      </div>

                      {expandedAnswerId === answer.id && (
                        <GradeAnswer
                          answer={answer}
                          onGradeSuccess={() =>
                            queryClient.invalidateQueries({
                              queryKey: ["student-answers"],
                            })
                          }
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAnswers;
