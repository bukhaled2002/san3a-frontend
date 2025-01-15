import { hestyAPI } from "./axios";

export type PostQuiz = {
  title: string;
  duration: string;
  lectureId: string;
  questions: {
    id?: string;
    question?: string;
    figure?: string[];
    choices?: {
      answer?: string;
      isCorrect?: boolean;
    }[];
  }[];
};
export type Quiz = {
  id: string;
  title: string;
  lectureId: string;
  duration: string;
  OpenLectureId: string | null;
  chapterId: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function createQuiz(data: PostQuiz) {
  const res = await hestyAPI.post(`/quiz/create`, data);
  return res.data;
}

export async function GetQuizs(courseId: string): Promise<Quiz[]> {
  try {
    const res = await hestyAPI.get(`/course/quizs/${courseId}`);
    return res.data as Quiz[];
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
}

export async function GetQuizStudents(quizId: string) {
  try {
    const res = await hestyAPI.get(`/quiz/${quizId}/students`);
    return res.data;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
}

export async function deleteQuiz(quizId: string) {
  try {
    const res = await hestyAPI.delete(`/quiz/${quizId}`);
    console.log("Quiz deleted successfully:", res); // Log success message
    return res.data;
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw error; // Handle or propagate the error
  }
}
