"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { deleteExam, Exam } from "@/services/exam";
import { deleteQuiz, Quiz } from "@/services/quiz";
import { deleteEssay, Essay } from "@/services/quizEssay";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Eye, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
type AllQuizsProps = {
  quizzes: { quiz: Quiz[] } | undefined; // Use the Quiz type here
  essays: { essay: Essay[] } | undefined;
  exams: { exam: Exam[] } | undefined;
  courseId: string;
};

const AllQuizs = ({ quizzes, exams, essays, courseId }: AllQuizsProps) => {
  // Pass courseId to fetch specific course quizzes
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null); // Track the selected quiz to delete
  const [selectedEssayId, setSelectedEssayId] = useState<string | null>(null); // Track the selected essay to delete
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null); // Track the selected exam to delete
  const router = useRouter();

  const { mutate: DeleteQuiz, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteQuiz(id),
    onSuccess: () => {
      toast({
        title: "تم حذف الامتحان بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-quizs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-quizs", courseId] });
      setDeleteOpen(false);
      setSelectedQuizId(null);
      router.push("/admin/courses");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast({
          title: error.response?.data.message || "حدث خطأ ما",
          variant: "destructive",
        });
      } else {
        toast({
          title: "حدث خطأ ما",
          variant: "destructive",
        });
      }
    },
  });

  const { mutate: DeleteEssay, isPending: isDeletingEssay } = useMutation({
    mutationFn: (id: string) => deleteEssay(id),
    onSuccess: () => {
      toast({
        title: "تم حذف المقال بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-essays"] });
      queryClient.invalidateQueries({ queryKey: ["admin-essays", courseId] });
      setDeleteOpen(false);
      setSelectedEssayId(null);
      router.push("/admin/courses");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast({
          title: error.response?.data.message || "حدث خطأ ما",
          variant: "destructive",
        });
      } else {
        toast({
          title: "حدث خطأ ما",
          variant: "destructive",
        });
      }
    },
  });

  const { mutate: DeleteExam, isPending: isDeletingExam } = useMutation({
    mutationFn: (id: string) => deleteExam(id),
    onSuccess: () => {
      toast({
        title: "تم حذف الامتحان بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-exams"] });
      queryClient.invalidateQueries({ queryKey: ["admin-exams", courseId] });
      setDeleteOpen(false);
      setSelectedExamId(null);
      router.push("/admin/courses");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast({
          title: error.response?.data.message || "حدث خطأ ما",
          variant: "destructive",
        });
      } else {
        toast({
          title: "حدث خطأ ما",
          variant: "destructive",
        });
      }
    },
  });

  const handleDeleteQuizClick = (quizId: string) => {
    setSelectedQuizId(quizId);
    setDeleteOpen(true);
  };

  const handleDeleteEssayClick = (essayId: string) => {
    setSelectedEssayId(essayId);
    setDeleteOpen(true);
  };

  const handleDeleteExamClick = (examId: string) => {
    setSelectedExamId(examId);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedQuizId) {
      DeleteQuiz(selectedQuizId); // Perform the delete mutation
    }
    if (selectedEssayId) {
      DeleteEssay(selectedEssayId);
    }
    if (selectedExamId) {
      DeleteExam(selectedExamId);
    }
  };

  return (
    <div>
      <div className="bg-white p-5 rounded-[12px] space-y-5">
        {(quizzes?.quiz?.length ?? 0) > 0 ||
        (essays?.essay?.length ?? 0) > 0 ||
        (exams?.exam?.length ?? 0) > 0 ? (
          <>
            {quizzes?.quiz.map((quiz, index) => (
              <div
                className="flex justify-between border border-black/15 rounded-lg px-4 py-6"
                key={index}
              >
                <h1 className="text-xl font-bold">{quiz.title}</h1>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      router.push(
                        `/admin/courses/${courseId}/quizs/${quiz.id}`
                      );
                    }}
                  >
                    <Eye className="text-secondary size-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleDeleteQuizClick(quiz.id); // Open the delete dialog for the selected quiz
                    }}
                  >
                    <TrashIcon className="text-red-500 size-4" />
                  </button>
                </div>
              </div>
            ))}
            {essays?.essay?.map((essay, index) => (
              <div
                className="flex justify-between border border-black/15 rounded-lg px-4 py-6"
                key={index}
              >
                <h1 className="text-xl font-bold">{essay.title}</h1>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      router.push(
                        `/admin/courses/${courseId}/quizs/${essay.id}`
                      );
                    }}
                  >
                    <Eye className="text-secondary size-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleDeleteEssayClick(essay.id);
                    }}
                  >
                    <TrashIcon className="text-red-500 size-4" />
                  </button>
                </div>
              </div>
            ))}
            {exams?.exam?.map((exam, index) => (
              <div
                className="flex justify-between border border-black/15 rounded-lg px-4 py-6"
                key={index}
              >
                <h1 className="text-xl font-bold">{exam.title}</h1>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      router.push(
                        `/admin/courses/${courseId}/quizs/${exam.id}`
                      );
                    }}
                  >
                    <Eye className="text-secondary size-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleDeleteExamClick(exam.id);
                    }}
                  >
                    <TrashIcon className="text-red-500 size-4" />
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <h1 className="text-xl font-bold text-center">
            لا يوجد امتحانات لهذه الدورة
          </h1>
        )}

        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-start">
                هل انت متأكد من حذف الامتحان؟
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-500 text-start">
                لا يمكنك التراجع بعد الحذف.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-x-2">
              <AlertDialogCancel
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteOpen(false); // Close the dialog
                }}
              >
                رجوع
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDelete(); // Confirm delete action
                }}
              >
                {isDeleting ? "جاري الحذف..." : "حذف"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AllQuizs;
