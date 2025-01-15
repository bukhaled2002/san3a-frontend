import { hestyAPI, hestyAPIWithoutAuth } from "../axios";
import { MetaData } from "../types";

export type BaseCourse = {
  name: string;
  description: string;
  teacherId: string;
  img_url: string;
  num_hours: string;
  price: string;
  price_after_discount: string;
  discountPercentage: string;
  subjectId: string;
  teacher: {
    id: string;
    img_url: string;
    fullName: string;
  };
  subject: {
    id: string;
    name: string;
  };
  class: {
    id: string;
    name: string;
  };
};

export type GetCourse = BaseCourse & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type GetCoursePaginated = {
  data: GetCourse[];
  meta_data: MetaData;
};

export type Lecture = {
  id: string;
  title: string;
  is_locked: boolean;
  quizizz: {
    id: string;
    title: string;
  }[];
  QuizEssay: {
    id: string;
    title: string;
  }[];
  Exam: {
    id: string;
    title: string;
  }[];
  video: {
    url: string;
    duration: string;
  };
};

export type Chapter = {
  name: string;
  lectures: Lecture[];
};

export type GetChapter = Chapter & {
  id: string;
};

export type GetCourseAdditional = GetCourse & {
  _count: {
    students: number;
    chapters: number;
  };
  enrolled: boolean;
  chapters: GetChapter[];
};

export async function getCourses(
  page: string | string[] | undefined = "1",
  name?: string | string[] | undefined,
  selectedClass?: string | string[] | undefined,
  selectedSubject?: string | string[] | undefined,
  selectedTeacher?: string | string[] | undefined
) {
  const res = await hestyAPI.get<GetCoursePaginated>("/course/all", {
    params: {
      page,
      limit: 6,
      name,
      class: selectedClass,
      subject: selectedSubject,
      teacher: selectedTeacher,
    },
  });
  return res.data;
}

export async function getCourse(id: string) {
  const res = await hestyAPI.get<GetCourseAdditional>(`/course/${id}`);
  return res.data;
}

export async function getCourseById(id: string) {
  const res = await hestyAPIWithoutAuth.get<GetCourseAdditional>(
    `/course/${id}`
  );
  return res.data;
}
