import { hestyAPI } from "./axios";

export type PostQuizEssay = {
  title: string;
  duration: string;
  lectureId: string;
  QuestionEssay: {
    id?: string;
    question?: string;
    figure?: string[];
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

export async function createQuizEssay(data: PostQuizEssay) {
  const res = await hestyAPI.post(`/essay/create`, data);
  return res.data;
}

export async function getAllEssays(){
  try {
    const res = await hestyAPI.get(`/essay/all`);
    return res.data as Quiz[];
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
}

export async function GetEssay(courseId: string): Promise<Quiz[]> {
  try {
    const res = await hestyAPI.get(`/essay/${courseId}`);
    return res.data as Quiz[];
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
}

export async function deleteEssay(quizId: string) {
  try {
    const res = await hestyAPI.delete(`/essay/${quizId}`);
    console.log("Quiz deleted successfully:", res);
    return res.data;
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw error;
  }
}
