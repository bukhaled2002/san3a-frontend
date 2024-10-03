import { studentAPI } from "../axios";

export type PostData = {
  firstName: string;
  lastName: string;
  school: string;
  city: string;
  email: string;
  phone: string;
  phone2: string;
  gender: string;
  classId: string;
  password: string;
};

export async function registerStudent(data: PostData) {
  const response = await studentAPI.post("/register", data);
  return response.data;
}
