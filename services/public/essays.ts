import { hestyAPI } from "../axios";

export type GetEssayByIdResponse = {
  id: string;
  title: string;
  qrCode: string;
  duration: string;
  lectureId: string;
  chapterId: string;
  QuestionEssay: {
    id: string;
    question: string;
    attachment: null;
    figure: [];
    explanation: string;
  }[];
  message?: string;
};

// export type GetQuizResultsResponse = {
//   quizTitle: string;
//   score: number;
//   status: "passed" | "failed";
//   count_correct: number;
//   count_wrong: number;
//   correctQuestions: {
//     question: string;
//     choices: {
//       answer: string;
//       isCorrect: boolean;
//       selected: boolean;
//     }[];
//   }[];
//   wrongQuestions: {
//     question: string;
//     choices: {
//       answer: string;
//       isCorrect: boolean;
//       selected: boolean;
//     }[];
//   }[];
// };

export type PostEssay = {
  questionEssayId: string;
  answerEssay: string;
};

export async function getEssayById(essayId: string) {
  const res = await hestyAPI.get<GetEssayByIdResponse>(`/essay/${essayId}`);
  return res.data;
}

// export async function getAllQuizzes() {
//   const res = await hestyAPI.get("/student-submit/all");
//   return res.data;
// }

export async function submitEssay(quizEssayId: string, data: PostEssay[]) {
  const res = await hestyAPI.post(
    `/student-submit/create-answer-essay/${quizEssayId}`,
    data
  );
  console.log(data)
  return res.data;
}

// export async function getQuizResults(quizId: string, studentId: string) {
//   const res = await hestyAPI.get<GetQuizResultsResponse>(
//     `/student-submit/studentAnswersQuiz/${quizId}/${studentId}`
//   );
//   return res.data;
// }
