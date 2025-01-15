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

  let quizData;
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">إجابات الطلاب</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizData?.data.map((student: Student) => (
              <button
                key={student.id || student.studentId}
                onClick={() =>
                  setSelectedStudentId(student.id || student.studentId!!)
                }
                className={`p-4 rounded-lg text-right transition-colors ${
                  selectedStudentId === (student.id || student.studentId)
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
              >
                <h3 className="font-medium">
                  {student.firstName} {student.lastName}
                </h3>
                <p className="text-sm mt-1">{student.grade}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedStudentId && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
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
                    <div key={answer.id} className="space-y-2">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">
                          السؤال : {answer.questionEssay.question}
                        </h4>
                        <p className="text-gray-700 mb-2">{answer.answer}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-500">
                            الدرجة: {answer.grade || "لم يتم التقييم"}
                          </p>
                          <button
                            onClick={() =>
                              setExpandedAnswerId(
                                expandedAnswerId === answer.id
                                  ? null
                                  : answer.id
                              )
                            }
                            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
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
