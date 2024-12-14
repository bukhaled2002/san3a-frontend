import { hestyAPI } from "../axios";
import { MetaData } from "../types";
export interface SingleChoicesMCQ {
  id: string;
  answer: string;
  isCorrect: boolean;
}
export interface SingleMCQQuestion {
  id: string;
  question: string;
  explanation: string;
  courseId: string;
  chapterId: string;
  lectureId: string;
  attachment: string;
  figure: string[];
  choices: SingleChoicesMCQ[];
}
export interface AllMCQ {
  meta: MetaData;
  questions: SingleMCQQuestion[];
}
export async function getMCQ() {
  const res = await hestyAPI.get<AllMCQ>("/questions-bank/all", {});
  return res.data;
}

export interface CreateMSQ {}

export async function createMSQ(data: CreateMSQ) {
  const res = await hestyAPI.post<AllMCQ>("/questions-bank/create", data);
  return res.data;
}
