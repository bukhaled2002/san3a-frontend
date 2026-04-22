"use client"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import CourseCardTwo from "../cards/courseCard-2";
import { GetCoursesResponse } from "@/services/student/courses";
const StudentProfileCourses = ({ courses }: { courses: GetCoursesResponse }) => {
    return (
        <Swiper
            // modules={[Scrollbar, Autoplay]}
            spaceBetween={10}
            slidesPerView={1.2}
            breakpoints={{
                500: {
                    slidesPerView: 1.5,
                },
                750: {
                    slidesPerView: 1.6,
                },
                850: {
                    slidesPerView: 3.2,
                },
                1080: {
                    slidesPerView: 3.5,
                },
                1280: {
                    slidesPerView: 6,
                },
            }}
            autoplay={{
                delay: 4000,
                disableOnInteraction: false,
            }}
        >

            {courses.data.map((course) => {
                return (
                    <>
                        <SwiperSlide className="space-y-1.5" key={course.id}>
                            <CourseCardTwo showBtn={false} course={course} key={course.id} />
                        </SwiperSlide>
                    </>
                );
            })}
        </Swiper>
    )
}

export default StudentProfileCourses
