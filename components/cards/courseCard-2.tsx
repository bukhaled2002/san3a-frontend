import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GetMyCourse } from "@/services/teacher";
import { Clock, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { transformGoogleDriveUrl } from "@/lib/helper/ExtractImg";
type Props = {
  course: GetMyCourse;
  showBtn?: boolean;
  className?: string;
};

function CourseCardTwo({ course, showBtn, className }: Props) {
  const courseImg = transformGoogleDriveUrl(course.img_url?.trim() ?? "/images/card-bg-2.webp")
  console.log('course',course)
  return (
    <div
      className={cn("block bg-card rounded-none border border-primary/10 hover:border-primary/40 transition-all duration-300 group hover:shadow-neon-glow overflow-hidden", className)}
    >
      <Link href={`/courses/${course.id}`}>
        <div className="h-60 relative overflow-hidden">
          <Image
            alt={course.name + " course"}
            src={courseImg}
            width={500}
            height={500}
            className="h-full w-full rounded-none object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute bottom-0 flex border-b-4 border-primary items-center justify-between text-white bg-background/80 backdrop-blur-sm w-full px-4 py-2 text-sm">
            <div className="flex items-center gap-2 font-rajdhani font-black">
              <Users size={16} className="text-primary" />
              <span>{course._count.students} <span className="text-[10px] opacity-70">LEARNERS</span></span>
            </div>
          </div>
        </div>
      </Link>
      <div className="p-5 flex flex-col justify-between items-start">
        <div className="w-full">
          <h1 className="font-cairo font-black text-xl line-clamp-1 text-white group-hover:text-primary transition-colors mb-2">{course.name}</h1>
          <p className="text-sm text-tech-grey line-clamp-2 h-10 mb-4">{course.description}</p>
          <div className="flex justify-between items-center bg-background/50 p-2 border-r-2 border-primary">
            <h3 className="text-xl font-rajdhani font-black text-primary neon-glow">
              {course.price_after_discount} <span className="text-xs">EGP</span>
            </h3>
          </div>
        </div>
        {showBtn && (
          <div className="mt-6 flex items-center justify-center w-full">
            <Link href={`/courses/${course.id}`} className="w-full">
              <Button variant="neon" className="w-full">
                عرض الدورة
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>

  );
}

export default CourseCardTwo;
