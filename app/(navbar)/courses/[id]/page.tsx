import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getCourse } from "@/services/public/courses";
import { Clock, RefreshCcw, UsersIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { transformGoogleDriveUrl } from "@/lib/helper/ExtractImg";
import AddCode from "@/components/admin/courses/AddCode";
type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = params.id;
  const course = await getCourse(id);
  return {
    title: `${course.name}`,
    description: `${course.description}`,
  };
}

async function Course({ params }: Props) {
  const { id } = params;
  const course = await getCourse(id);
  const lecturesLength = course.chapters?.reduce(
    (acc, chapter) => acc + chapter.lectures.length,
    0
  );

  const isChaptersEmpty = course.chapters?.every(
    (chapter) => chapter.lectures.length === 0
  );
  const firstChapterWithLectures = course.chapters?.find(
    (chapter) => chapter.lectures.length > 0
  );
  
  const lecturePath = firstChapterWithLectures
    ? `/courses/${course.id}/lecture/${firstChapterWithLectures.lectures[0]?.id}`
    : '';
    return (
    <>
      <section className="overflow-hidden bg-[#5949be] relative z-10 sm:py-16 py-10 text-white">
        <div className="container flex gap-5 lg:flex-row flex-col items-center justify-between">
          <div className="w-full">
            <h1 className="text-xl mb-[16px] lg:text-[34px] font-bold max-w-96 !leading-[51px]">
              {course.name}
            </h1>
            <p className="text-white/80 text-lg leading-[27px] sm:mb-10 mb-5">
              {course.description}
            </p>
            <div className="flex items-center md:gap-x-20 gap-x-10 mb-11">
              <div className="text-base font-normal">
                <UsersIcon size={20} className="inline-block me-1" />{" "}
                {course._count?.students} طالب
              </div>
              <div className="text-base font-normal">
                <RefreshCcw size={20} className="inline-block me-1" /> اخر تحديث
                للدورة {new Date(course.updatedAt).toLocaleDateString("en-US")}
              </div>
            </div>
            {isChaptersEmpty ? (
              <div className="bg-gray-100 text-primary w-full py-4 font-bold text-xl text-center rounded-lg">
                لم يتم اضافة محتوي لهذه الدورة
              </div>
            ) : course.enrolled ? (
              <Link
                href={lecturePath}
              >
                <Button className="bg-primary text-white w-full sm:py-6 py-3 font-bold  sm:text-xl">
                  تابع الدورة
                </Button>
              </Link>
            ) : (
              <div className="space-y-5">
                                <Link href={`/checkout/${course.id}`}>
                  <Button className="bg-primary text-white w-full sm:py-6 py-3 font-bold  sm:text-xl">
                    شراء مقابل {course.price_after_discount} جنيه مصري
                  </Button>
                </Link>
                <AddCode LecturePath={lecturePath} courseId={id} />

              </div>
            )}
          </div>
          <div className="relative sm:min-w-[500px] lg:max-w-[500px] w-full lg:max-h-[300px] sm:max-h-[400px] max-h-[300px] h-full border rounded-lg overflow-hidden ">
            <Image
              src={transformGoogleDriveUrl(course.img_url?.trim())}
              className="rounded-lg object-cover object-[75%_25%] w-full"
              alt="hero"
              width={500}
              height={300}
            />
            <div className="absolute bottom-0 flex border-b-[6px] border-primary items-center justify-between text-white bg-black bg-opacity-30 w-full px-4 py-2 text-sm">
              استاذ / {course.teacher?.fullName}
            </div>
          </div>
        </div>
      </section>
      <section className="container py-10">
        <div className="title relative w-fit mb-8">
          <h1 className="sm:text-3xl text-xl font-bold mb-2">محتوي المادة</h1>
          <h3 className="sm:text-xl text-black/40">{lecturesLength} حصص</h3>
        </div>
        {course.chapters?.length > 0 ? (
          <Accordion type="multiple" className="border border-black/10">
            {course.chapters.map((chapter, index) => {
              return (
                <AccordionItem
                  key={index}
                  value={chapter.name}
                  className="sm:px-5 px-2.5 py-0.5"
                >
                  <AccordionTrigger className="font-bold text-xl [&[data-state=open]>img]:rotate-180">
                    {chapter.name}
                    <Image
                      src="/icons/accordion-caret.svg"
                      className="h-7 w-7 shrink-0 bg-gray-100 p-2 rounded-full transition-transform duration-200"
                      alt="caret"
                      width={10}
                      height={10}
                    />
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    {chapter.lectures.map((lecture) => {
                      return (
                        <div
                          key={lecture.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-x-2 text-gray-400 title text-base font-semibold">
                            {lecture.title}
                          </div>
                          <div className="duration">
                            {lecture.video?.duration}
                          </div>
                        </div>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <div>لم يتم اضافة محتوي لهذه الدورة</div>
        )}
      </section>
    </>
  );
}

export default Course;
