import { adminAPI } from "./axios";
export type PostQuiz = {
  title: string;
  duration: string;
  lectureId: string;
  questions: {
    question: string;
    figure?: string[];
    choices: {
      answer: string;
      isCorrect: boolean;
    }[];
  }[];
};
export type QrCode = {
  id: string;
  code: string;
  courseId: string;
  isUsed: boolean;
  lectureId: string | null;
  num_used: number;
  createdAt: string;
  updatedAt: string;
};

export async function CreateNewQrCode(courseId: string, limit_qrCode: number) {
  const res = await adminAPI.post(`/courses/generateQrCode/${courseId}?limit_qrCode=${limit_qrCode}`);
  return res.data;
}

export async function GetQrCodes(courseId: string): Promise<QrCode[]> {
  try {
    const res = await adminAPI.get(`/courses/getQrCodes/${courseId}`);
    return res.data as QrCode[];
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
}

export async function deleteQuiz(quizId: string) {
  try {
    const res = await adminAPI.delete(`/quiz/${quizId}`);
    console.log("Quiz deleted successfully:", res); // Log success message
    return res.data;
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw error; // Handle or propagate the error
  }
}
