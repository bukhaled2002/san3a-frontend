"use client"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import CourseCardOne from "../cards/courseCard-1";
import { GetCourse } from "@/services/public/courses";
const CoursesCarousel = ({ courses }: { courses: any }) => {
  return (
    <Swiper
      spaceBetween={24}
      slidesPerView={1.2}
      breakpoints={{
        500: { slidesPerView: 1.5 },
        768: { slidesPerView: 2.2 },
        1024: { slidesPerView: 3.2 },
        1280: { slidesPerView: 4 },
      }}
      className="pb-10"
    >
      {courses.data.map((course: GetCourse) => {
        return (
          <SwiperSlide className="!h-auto" key={course.id}>
            <CourseCardOne course={course} />
          </SwiperSlide>
        );
      })}
    </Swiper>

)
}

export default CoursesCarousel