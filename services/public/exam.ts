import { hestyAPI } from "../axios";

type QuizChoice = {
  id: string;
  answer: string;
  questionId: string;
  isCorrect: boolean;
  createdAt: string;
  updatedAt: string;
  mcqQuestionBankId: string | null;
};

type QuizQuestion = {
  id: string;
  question: string;
  quizId: string;
  figure: string[];
  attachment: string;
  explanation: string;
  createdAt: string;
  updatedAt: string;
  choices: QuizChoice[];
};

type Quiz = {
  id: string;
  title: string;
  lectureId: string | null;
  duration: string | null;
  OpenLectureId: string | null;
  chapterId: string | null;
  createdAt: string;
  updatedAt: string;
  questions: QuizQuestion[];
};

type QuestionEssay = {
  id: string;
  question: string;
  quizEssayId: string;
  figure: string[];
  attachment: string;
  explanation: string;
  createdAt: string;
  updatedAt: string;
};

type QuizEssay = {
  id: string;
  title: string;
  qrCode: string | null;
  duration: string | null;
  lectureId: string | null;
  chapterId: string | null;
  createdAt: string;
  updatedAt: string;
  QuestionEssay: QuestionEssay[];
};

type GetExamByIdResponse = {
  id: string;
  title: string;
  duration: string;
  quizId: string;
  quizEssayId: string;
  lectureId: string;
  OpenLectureId: string | null;
  chapterId: string;
  createdAt: string;
  updatedAt: string;
  Quiz: Quiz;
  QuizEssay: QuizEssay;
};

export type GetEssayResultsResponse = {
  id: string;
  answer: string;
  studentId: string;
  quizEssayId: string;
  questionEssayId: string;
  grade: number;
  createdAt: string;
  updatedAt: string;
  questionEssay: {
    id: string;
    question: string;
    quizEssayId: string;
    figure: string[];
    attachment: string;
    explanation: string;
    createdAt: string;
    updatedAt: string;
  };
}[];

export type PostExam = {
  mcqAnswers: {
    questionId: string;
    choiceId: string;
  }[];
  essayAnswers: {
    questionEssayId: string;
    answerEssay: string;
  }[];
};

export type GradeData = {
  questionGrades: {
    questionEssayId: string;
    grade: number;
  }[];
};

export async function getExamById(examId: string) {
  const res = await hestyAPI.get<GetExamByIdResponse>(`/exam/${examId}`);
  return res.data;
}

// export async function getAllQuizzes() {
//   const res = await hestyAPI.get("/student-submit/all");
//   return res.data;
// }

export async function submitExam(examId: string, data: PostExam) {
  const res = await hestyAPI.post(`/exam/submitExam/${examId}`, data);
  return res.data;
}

export async function getEssayResults(essayId: string, studentId: string) {
  const res = await hestyAPI.get<GetEssayResultsResponse>(
    `/student-submit/get-student-answer-essay/${essayId}/${studentId}`
  );
  return res.data;
}

export async function patchGrade(
  essayId: string,
  studentId: string,
  data: GradeData
) {
  const res = await hestyAPI.patch(
    `/student-submit/add-grade?quizEssayId=${essayId}&studentId=${studentId}`,
    data
  );
  return res.data;
}
