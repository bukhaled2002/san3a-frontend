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
  return (
    <div id="teachersSlider" className="container py-10 space-y-14">
      <div className="title relative w-fit mb-12">
        <h1 className="sm:text-3xl text-2xl font-cairo font-black text-white uppercase tracking-tight">خبراء صنعة</h1>
        <div className="title-underline" />
      </div>
      <Swiper
        spaceBetween={24}
        slidesPerView={1.2}
        breakpoints={{
          500: { slidesPerView: 2 },
          750: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        className="pb-12"
      >
        {teachers.map((teacher, index) => {
          return (
            <SwiperSlide key={index} className="group">
              <Link href={`/teachers/${teacher.id}`} className="block relative">
                <div className="relative overflow-hidden border border-primary/20 group-hover:border-primary transition-all duration-300 rounded-none bg-card aspect-square mb-4">
                  <Image
                    src={transformGoogleDriveUrl(teacher?.img_url?.trim())}
                    alt={teacher.fullName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-cairo font-black text-white group-hover:text-primary transition-colors">
                    {teacher?.fullName}
                  </h3>
                  <p className="text-primary font-rajdhani font-black text-xs uppercase tracking-widest mt-1">
                    {teacher?.subject?.name} expert
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

    </div>
  );
}

export default TeachersSlider;
