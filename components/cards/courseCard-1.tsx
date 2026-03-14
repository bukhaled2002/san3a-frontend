import { Button } from "@/components/ui/button";
import { GetCourse } from "@/services/public/courses";
import Image from "next/image";
import Link from "next/link";
import { transformGoogleDriveUrl } from "@/lib/helper/ExtractImg";

type Props = {
  course: GetCourse;
};

function CourseCardOne({ course }: Props) {
    const courseImg = transformGoogleDriveUrl(course.img_url?.trim() !== null || ""
    ? course.img_url?.trim()
    : "/images/placeholder.png"
)
  const teacherImg = transformGoogleDriveUrl(course.teacher.img_url?.trim())
  console.log('course',course)
  return (
    <div className="block bg-card rounded-none border border-primary/10 hover:border-primary/40 transition-all duration-300 group hover:shadow-neon-glow overflow-hidden">
      <div className="h-48 overflow-hidden">
        <Link href={`/courses/${course.id}`}>
          <Image
            src={courseImg}
            width={500}
            height={500}
            className="size-full max-h-[201px] rounded-none object-cover transition-transform duration-500 group-hover:scale-110"
            alt="Course Image"
          />
        </Link>
      </div>
      <Link
        href={`/teachers/${course.teacherId}`}
        className="flex flex-col w-fit m-auto items-center -mt-10 relative z-10"
      >
        <div className="p-1 bg-background rounded-none border border-primary/20">
          <Image
            src={teacherImg}
            width={100}
            height={100}
            className="rounded-none w-[56px] h-[56px] object-cover"
            alt={course.teacher.fullName + "Image"}
          />
        </div>
        <div className="text-lg font-bold w-32 line-clamp-1 text-center mt-2 group-hover:text-primary transition-colors">
          {course.teacher.fullName}
        </div>
      </Link>

      <div className="p-5 flex flex-col justify-between items-start">
        <div className="space-y-2 w-full">
          <h1 className="font-cairo font-black text-xl line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">{course.name}</h1>
          <div className="flex justify-between items-center bg-background/50 p-2 border-r-2 border-primary">
            <h2 className="text-sm font-bold text-tech-grey">{course.class.name}</h2>
            <h3 className="text-lg font-rajdhani font-black text-primary neon-glow">
              {course.price_after_discount} <span className="text-xs">EGP</span>
            </h3>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center w-full">
          <Link href={`/courses/${course.id}`} className="w-full">
            <Button variant="neon" className="w-full">
              عرض الدورة
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

}

export default CourseCardOne;
