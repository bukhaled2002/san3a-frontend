"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getQuizResults } from "@/services/public/quizes";
import { useQuery } from "@tanstack/react-query";
import { Check, Loader2, X } from "lucide-react";
import { Separator } from "../ui/separator";

type Props = {
  quizId: string;
  studentId: string;
};

function QuizResultsContent({ quizId, studentId }: Props) {
  const { data: quizResults } = useQuery({
    queryKey: ["quiz-results", quizId, studentId],
    queryFn: () => getQuizResults(quizId, studentId),
  });

  const allQuestions =
    quizResults?.correctQuestions?.concat(quizResults?.wrongQuestions) ?? [];

  if (!quizResults)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-secondary" size={80} />
      </div>
    );
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between flex-wrap gap-7">
        <div className="md:text-lg text-[#121212B2]/70 font-medium flex items-center gap-x-[13px]">
          الاختبار:{" "}
          <span className="text-[#5949BE] md:text-2xl font-bold">
            {quizResults.quizTitle}
          </span>
        </div>
        <div className="md:text-lg text-[#121212B2]/70 font-medium flex items-center gap-x-[13px]">
          الحالة:{" "}
          <span
            className={cn(
              " md:text-2xl font-bold",
              quizResults?.status === "failed" && "text-[#FF0000]",
              quizResults?.status === "passed" && "text-[#008000]"
            )}
          >
            {quizResults?.status === "failed" ? "راسب" : "ناجح"}
          </span>
        </div>
        <div className="md:text-lg text-[#121212B2]/70 font-medium flex items-center gap-x-[13px]">
          الدرجة:{" "}
          <span className="text-[#5949BE] md:text-2xl font-bold">
            {quizResults?.score}
          </span>
        </div>
      </div>
      <Tabs defaultValue="all" className="w-full pt-16 ">
        <TabsList className="bg-[#f9fafb] w-full sm:py-9 py-6 px-3 h-[88px] rounded-[8px] ">
          <TabsTrigger
            value="all"
            className="flex-1 h-14 sm:h-[70px] text-sm sm:text-lg data-[state=active]:text-[#F65428] border-0 ring-0"
          >
            جميع الاجابات ( {allQuestions.length} )
          </TabsTrigger>
          <TabsTrigger
            value="correct"
            className="flex-1 h-14 sm:h-[70px] text-sm sm:text-lg data-[state=active]:text-[#F65428] border-0 ring-0"
          >
            الاجابات الصحيحة ( {quizResults?.correctQuestions?.length} )
          </TabsTrigger>
          <TabsTrigger
            value="wrong"
            className="flex-1 h-14 sm:h-[70px] text-sm sm:text-lg data-[state=active]:text-[#F65428] border-0 ring-0"
          >
            الاجابات الخاطئة ( {quizResults.wrongQuestions?.length} )
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="sm:pt-14 pt-8">
          {allQuestions.map((question, index) => (
            <div key={question.question}>
              <h1 className="sm:text-2xl text-xl text-[#000] font-bold sm:mb-[42px] mb-6">
                {index + 1}: {question.question}
              </h1>
              <div className="sm:space-y-6 space-y-3">
                {question.choices.map((choice) => {
                  return (
                    <div
                      key={choice.answer}
                      className={cn(
                        "text-[#141414] sm:text-2xl text-xl font-bold rounded-[12px] sm:min-w-[242px] sm:w-fit px-[12px] py-[16px]",
                        choice.isCorrect &&
                          "border border-[#22BB64] bg-[#effef4] text-[#22BB64]",
                        choice.selected &&
                          !choice.isCorrect &&
                          "border border-[#D80B0B] bg-[#FFF0F0] text-[#D80B0B]"
                      )}
                    >
                      {choice.answer}{" "}
                      {choice.isCorrect && (
                        <Check
                          className="inline-block bg-[#22BB64] text-white rounded-full p-0.5"
                          size={16}
                        />
                      )}
                      {choice.selected && !choice.isCorrect && (
                        <X
                          className="inline-block bg-[#D80B0B] text-white rounded-full p-0.5"
                          size={16}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <Separator className="sm:my-10 my-5" />
            </div>
          ))}
        </TabsContent>
        <TabsContent value="correct" className="sm:pt-14 pt-8 ">
          {quizResults?.correctQuestions?.map((correctQuestion, index) => (
            <div key={correctQuestion.question}>
              <h1 className="sm:text-2xl text-xl text-[#000] font-bold mb-6 sm:mb-[42px]">
                {index + 1}: {correctQuestion.question}
              </h1>
              <div className="sm:space-y-6 space-y-3">
                {correctQuestion.choices.map((choice) => {
                  return (
                    <div
                      key={choice.answer}
                      className={cn(
                        "text-[#141414] sm:text-2xl text-xl font-bold rounded-[12px] sm:min-w-[242px] sm:w-fit px-[12px] py-[16px]",
                        choice.isCorrect &&
                          "border border-[#22BB64] bg-[#effef4] text-[#22BB64]",
                        choice.selected &&
                          !choice.isCorrect &&
                          "border border-[#D80B0B] bg-[#FFF0F0] text-[#D80B0B]"
                      )}
                    >
                      {choice.answer}{" "}
                      {choice.isCorrect && (
                        <Check
                          className="inline-block bg-[#22BB64] text-white rounded-full p-0.5"
                          size={16}
                        />
                      )}
                      {choice.selected && !choice.isCorrect && (
                        <X
                          className="inline-block bg-[#D80B0B] text-white rounded-full p-0.5"
                          size={16}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <Separator className="sm:my-10 my-5" />
            </div>
          ))}
        </TabsContent>
        <TabsContent value="wrong" className="sm:pt-14 pt-8">
          {quizResults?.wrongQuestions?.map((wrongQuestion, index) => (
            <div key={wrongQuestion.question}>
              <h1 className="sm:text-2xl text-xl text-[#000] font-bold mb-6 sm:mb-[42px]">
                {index + 1}: {wrongQuestion.question}
              </h1>
              <div className="space-y-3 sm:space-y-6">
                {wrongQuestion.choices.map((choice) => {
                  return (
                    <div
                      key={choice.answer}
                      className={cn(
                        "text-[#141414] sm:text-2xl text-xl font-bold rounded-[12px] sm:min-w-[242px] sm:w-fit px-[12px] py-[16px]",
                        choice.isCorrect &&
                          "border border-[#22BB64] bg-[#effef4] text-[#22BB64]",
                        choice.selected &&
                          !choice.isCorrect &&
                          "border border-[#D80B0B] bg-[#FFF0F0] text-[#D80B0B]"
                      )}
                    >
                      {choice.answer}{" "}
                      {choice.isCorrect && (
                        <Check
                          className="inline-block bg-[#22BB64] text-white rounded-full p-0.5"
                          size={16}
                        />
                      )}
                      {choice.selected && !choice.isCorrect && (
                        <X
                          className="inline-block bg-[#D80B0B] text-white rounded-full p-0.5"
                          size={16}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <Separator className="sm:my-10 my-5" />
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default QuizResultsContent;
