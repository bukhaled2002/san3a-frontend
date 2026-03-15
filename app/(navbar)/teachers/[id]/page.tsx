import CourseCardTwo from "@/components/cards/courseCard-2";
import Pagination from "@/components/pagination";
import { transformGoogleDriveUrl } from "@/lib/helper/ExtractImg";
import { getTeacher } from "@/services/teacher";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teacher = await getTeacher(id);
  return {
    title: `${teacher.fullName} | معلم ${teacher.subject.name}`,
    description: `${teacher.info}`,
  };
}

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function Teacher({ params }: Props) {
  const { id } = await params;
  const teacher = await getTeacher(id);
  const currentPage = String(teacher.courses.meta_data.currentPage);
  const totalPages = teacher.courses.meta_data.totalPages;
  const nextPage = teacher.courses.meta_data.nextPage;
  const previousPage = teacher.courses.meta_data.previousPage;
  console.log(teacher);
  console.log('teacher.courses.data',teacher.courses.data)
  return (
    <>
      <section className="overflow-hidden bg-[#5949be] relative z-10 sm:py-16 py-8 text-white">
        <div className="container md:space-y-10 space-y-6">
          <div className="flex items-center gap-x-5">
            <Image
              src={transformGoogleDriveUrl(teacher.img_url.trim() ?? "/images/teacher.webp")}
              width={200}
              height={200}
              className="md:size-[125px] size-20 rounded-full object-cover object-[75%_25%]"
              alt="teacher"
            />
            <div>
              <h1 className="sm:text-2xl text-lg sm:mb-3 mb-1.5">{teacher.fullName}</h1>
              <h3 className="text-white/70 sm:text-base text-sm">معلم {teacher.subject.name}</h3>
            </div>
          </div>
          <div>
            <h1 className="sm:text-xl sm:mb-3 mb-1.5">عن المعلم</h1>
            <p className="text-white/80 sm:text-base text-sm">{teacher.info}</p>
          </div>
          <div className="flex items-center gap-x-6 ">
            <div>
              <div className="text-sm font-medium mb-2">الطلاب</div>
              <div className="text-base font-bold">
                {teacher._count.students}+
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">الكورسات</div>
              <div className="text-base font-bold">
                {teacher._count.courses}+
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container py-10">
        <div className="title relative w-fit mb-10">
          <h1 className="text-2xl font-bold">الدورات المتاحة</h1>
          <div className="title-underline" />
        </div>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 xl:grid-cols-4 lg:grid-cols-3 lg:gap-8">
          {teacher.courses.data.map((course) => (
            <CourseCardTwo showBtn={true} course={course} key={course.id} />
          ))}
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
      </div>
    </>
  );
}

export default Teacher;
