"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AdminCreateQuizeForm from "./createQuizForm";
interface ChooseQuizType {
  lectureId: string;
  courseId: string;
}
const ChooseQuiz: React.FC<ChooseQuizType> = ({ lectureId, courseId }) => {
  const [quizType, setQuizType] = useState("not-selected");
  return (
    <>
      {quizType === "not-selected" && (
        <div className="bg-white rounded-[8px] p-[16px] flex items-center justify-center gap-[16px]">
          <Button onClick={() => setQuizType("mcq")}>MCQ</Button>
          <Button>Essay</Button>
        </div>
      )}
      {quizType === "mcq" && (
        <AdminCreateQuizeForm courseId={courseId} lectureId={lectureId} />
      )}
    </>
  );
};
export default ChooseQuiz;
