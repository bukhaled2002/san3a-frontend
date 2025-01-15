import { hestyAPI } from "./axios";

type PostQuiz = {
  title: string;
  questions: {
    question: string;
    figure: string[];
    choices?: {
      answer: string;
      isCorrect: boolean;
    }[] | undefined;
  }[];
};
type PostQuizEssay = {
  title: string;
  QuestionEssay: {
    question: string;
    explanation: string;
    attachment: string;
    figure: string[];
  }[];
};
export type PostExam = {
  title: string;
  duration: string;
  lectureId?: string | string[];
  chapterId?: string;
  Quiz?: PostQuiz | undefined;
  QuizEssay?: PostQuizEssay | undefined;
};


interface Choice {
  id: string;
  answer: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  question: string;
  choices: Choice[];
}

interface Quiz {
  id: string;
  title: string;
  lectureId: string | null;
  duration: string | null;
  OpenLectureId: string | null;
  chapterId: string | null;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}

interface QuestionEssay {
  id: string;
  question: string;
  figure: string[];
  explanation: string;
  attachment: string;
}

interface QuizEssay {
  id: string;
  title: string;
  qrCode: string | null;
  duration: string | null;
  lectureId: string | null;
  chapterId: string | null;
  createdAt: string;
  updatedAt: string;
  QuestionEssay: QuestionEssay[];
}

interface Lecture {
  id: string;
  title: string;
  chapterId: string;
  is_locked: boolean;
  code: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Chapter {
  id: string;
  name: string;
  description: string;
  subjectId: string | null;
  createdAt: string;
  updatedAt: string;
  courseId: string;
}

export interface Exam {
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
  lecture: Lecture;
  chapter: Chapter;
  Quiz: Quiz;
  QuizEssay: QuizEssay;
}

type ExamData = Exam[];


export async function createExam(data: PostExam) {
  const res = await hestyAPI.post(`/exam`, data);
  return res.data;
}

export async function getAllExams() {
  try {
    const res = await hestyAPI.get(`/exam`);
    return res.data as Quiz[];
  } catch (error) {
    console.error("Error fetching exams:", error);
    throw error;
  }
}

export async function getExamsByCourse(courseId: string) {
  try {
    const res = await hestyAPI.get(`/course/exams/${courseId}`);
    return res.data as Exam[];
  } catch (error) {
    console.error("Error fetching exam:", error);
    throw error;
  }
}

export async function GetExamStudents(examId: string) {
  try {
    const res = await hestyAPI.get(`/exam/${examId}/students`);
    return res.data;
  } catch (error) {
    console.error("Error fetching exam:", error);
    throw error;
  }
}

// export async function GetEssay(courseId: string): Promise<Quiz[]> {
//   try {
//     const res = await hestyAPI.get(`/essay/${courseId}`);
//     return res.data as Quiz[];
//   } catch (error) {
//     console.error("Error fetching quizzes:", error);
//     throw error;
//   }
// }

export async function deleteExam(examId: string) {
  try {
    const res = await hestyAPI.delete(`/exam/${examId}`);
    console.log("Exam deleted successfully:", res);
    return res.data;
  } catch (error) {
    console.error("Error deleting exam:", error);
    throw error;
  }
}
