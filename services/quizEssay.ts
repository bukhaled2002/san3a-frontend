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
export type Essay = {
  id: string;
  title: string;
  qrCode: string | null;
  duration: string | null;
  lectureId: string | null;
  chapterId: string | null;
  createdAt: string;
  updatedAt: string;
  QuestionEssay: {
    id: string;
    question: string;
    figure: string[];
    explanation: string | null;
    attachment: string | null;
  }[];
};

export async function createQuizEssay(data: PostQuizEssay) {
  const res = await hestyAPI.post(`/essay/create`, data);
  return res.data;
}

export async function getAllEssays() {
  try {
    const res = await hestyAPI.get(`/essay/all`);
    return res.data as Essay[];
  } catch (error) {
    console.error("Error fetching essays:", error);
    throw error;
  }
}

export async function getEssaysByCourse(courseId: string) {
  try {
    const res = await hestyAPI.get(`/course/essays/${courseId}`);
    return res.data as Essay[];
  } catch (error) {
    console.error("Error fetching essays:", error);
    throw error;
  }
}

export async function GetEssay(essayId: string): Promise<Essay[]> {
  try {
    const res = await hestyAPI.get(`/essay/${essayId}`);
    return res.data as Essay[];
  } catch (error) {
    console.error("Error fetching essays:", error);
    throw error;
  }
}

export async function GetEssayStudents(essayId: string) {
  try {
    const res = await hestyAPI.get(`/essay/${essayId}/students`);
    return res.data;
  } catch (error) {
    console.error("Error fetching essays:", error);
    throw error;
  }
}

export async function deleteEssay(essayId: string) {
  try {
    const res = await hestyAPI.delete(`/essay/${essayId}`);
    console.log("Essay deleted successfully:", res);
    return res.data;
  } catch (error) {
    console.error("Error deleting essay:", error);
    throw error;
  }
}

// export async function GetEssays(courseId: string): Promise<Quiz[]> {
//   try {
//     const res = await hestyAPI.get(`/course/quizs/${courseId}`);
//     return res.data as Quiz[];
//   } catch (error) {
//     console.error("Error fetching quizzes:", error);
//     throw error;
//   }
// }
