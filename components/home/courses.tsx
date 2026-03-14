import { getCourses } from "@/services/public/courses";
import Link from "next/link";
import CoursesCarousel from "./CoursesCarousel";

type Props = {};

async function Courses({}: Props) {
  const courses = await getCourses();
  console.log('courses',courses)
  return (
    <div className="container py-20 space-y-16">
      <div className="header flex items-center justify-between">
        <div className="title relative w-fit">
          <h1 className="sm:text-4xl text-3xl font-cairo font-black text-white uppercase tracking-tight">أكاديمية صنعة</h1>
          <div className="title-underline" />
        </div>
        <Link href="/courses" className="text-tech-grey hover:text-primary transition-colors font-bold sm:text-lg">
          عرض الكل
        </Link>
      </div>
      <CoursesCarousel courses={courses} />
    </div>

  );
}

export default Courses;
