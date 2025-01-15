import { hestyAPI } from "../axios";

export type GetQuizByIdResponse = {
  id: string;
  title: string;
  duration: string;
  lecture: {
    id: string;
    title: string;
    chapterId: string;
    is_locked: boolean;
    quizId: null;
    createdAt: string;
    updatedAt: string;
  };
  questions: {
    question: string;
    id: string;
    attachment: null;
    figure: [];
    answers: {
      id: string;
      text: string;
    }[];
    correctAnswerId: string;
  }[];
  message: string;
};
    

export type GetQuizResultsResponse = {
  quizTitle: string;
  score: number;
  status: "passed" | "failed";
  count_correct: number;
  count_wrong: number;
  correctQuestions: {
    question: string;
    choices: {
      answer: string;
      isCorrect: boolean;
      selected: boolean;
    }[];
  }[];
  wrongQuestions: {
    question: string;
    choices: {
      answer: string;
      isCorrect: boolean;
      selected: boolean;
    }[];
  }[];
};

export type PostQuiz = {
  questionId: string;
  choiceId: string;
};

export async function getQuizById(quizId: string) {
  const res = await hestyAPI.get<GetQuizByIdResponse>(`/quiz/${quizId}`);
  return res.data;
}

export async function getAllQuizzes() {
  const res = await hestyAPI.get("/student-submit/all");
  return res.data;
}

export async function submitQuiz(quizId: string, data: PostQuiz[]) {
  const res = await hestyAPI.post(`/student-submit/create/${quizId}`, data);
  return res.data;
}

export async function getQuizResults(quizId: string, studentId: string) {
  const res = await hestyAPI.get<GetQuizResultsResponse>(
    `/student-submit/studentAnswersQuiz/${quizId}/${studentId}`
  );
  return res.data;
}
