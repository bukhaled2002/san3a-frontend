"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import { GetTeacher } from "@/services/teacher";
import Image from "next/image";
import Link from "next/link";
import { transformGoogleDriveUrl } from "@/lib/helper/ExtractImg";
type Props = {
  teachers: GetTeacher[];
};
function TeachersSlider({ teachers }: Props) {
  console.log('teachers',teachers)
  return (
    <div id="teachersSlider" className="container py-10 space-y-14">
      <div className="title relative w-fit">
        <h1 className="sm:text-[26px] text-[22px] font-bold">معلمينا</h1>
        <div className="title-underline" />
      </div>
      <Swiper
        // modules={[Scrollbar, Autoplay]}
        spaceBetween={10}
        slidesPerView={1.1}
        breakpoints={{
          500: {
            slidesPerView: 1.5,
          },
          750: {
            slidesPerView: 1.6,
          },
          850: {
            slidesPerView: 4,
          },
          1080: {
            slidesPerView: 4,
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
        {teachers.map((teacher, index) => {
          return (
            <SwiperSlide className="space-y-1.5" key={index}>
              <Link href={`/teachers/${teacher.id}`}>
                <Image
                  src={transformGoogleDriveUrl(teacher?.img_url?.trim())}
                  alt={teacher.fullName}
                  width={200}
                  height={200}
                  className="w-[125px] h-[125px] size-full object-cover rounded-full m-auto"
                />
              </Link>
              <h1 className="text-xl font-bold text-[#121212] text-center">
                {teacher?.fullName}
              </h1>
              <p className="text-black/70 font-semibold text-lg text-center">
                معلم {teacher?.subject?.name}
              </p>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

export default TeachersSlider;
