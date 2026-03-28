"use client";
import { GetCoursePaginated } from "@/services/public/courses";
import { Loader2 } from "lucide-react";
import CourseCardOne from "../cards/courseCard-1";
import Pagination from "../pagination";

type Props = {
  courses: GetCoursePaginated;
};

function CoursesContent({ courses }: Props) {
  if (!courses)
    return (
      <div className=" flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={50} />
      </div>
    );
  const currentPage = courses.meta_data.currentPage;
  const totalPages = courses.meta_data.totalPages;
  const nextPage = courses.meta_data.nextPage;
  const previousPage = courses.meta_data.previousPage;

  return (
    <div>
      {courses.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 md:grid-cols-2 lg:gap-8">
            {courses.data.map((course) => {
              return <CourseCardOne course={course} key={course.id} />;
            })}
          </div>
          {totalPages !== 0 && (
            <div className="flex items-center justify-center">
              <Pagination
                currentPage={currentPage}
                last_page={totalPages}
                nextPage={nextPage}
                previousPage={previousPage}
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center text-foreground/80 font-bold text-lg">
          لا يوجد دورات
        </div>
      )}
    </div>
  );
}

export default CoursesContent;
