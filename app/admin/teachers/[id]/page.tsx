import CourseCardTwo from "@/components/cards/courseCard-2";
import { getTeacher } from "@/services/admin/teachers";
import { Metadata } from "next";
import Image from "next/image";
import { transformGoogleDriveUrl } from "@/lib/helper/ExtractImg";
export const metadata: Metadata = {
  title: "المعلم - Admin",
  description: "المعلم - Admin في موقع صنعة",
};

type Props = {
  params: {
    id: string;
  };
};

async function AdminSingleTeacher({ params }: Props) {
  const teacher = await getTeacher(params.id);
  return (
    <>
      <h1 className="text-3xl font-bold mb-7">بيانات المعلم</h1>
      <div className="bg-white py-12 px-11 rounded-[12px] space-y-[61px]">
        <div className="flex items-center gap-x-5">
          <Image
            src={
              transformGoogleDriveUrl(teacher.img_url) ||
              "/images/defaultAvatar.webp"
            }
            alt={teacher.fullName}
            width={100}
            height={100}
            className="rounded-full w-[100px] h-[100px] size-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-[#d4d4d4] mb-2">
              {teacher.fullName}
            </h1>
            <p className="text-lg text-[#121212B2]/70">
              {teacher.subject.name}
            </p>
          </div>
        </div>
        <div>
          <div className="text-[22px] font-bold text-[#d4d4d4] mb-[14px]">
            الدورات
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {teacher.courses.data.map((course) => {
              return (
                <CourseCardTwo
                  showBtn={false}
                  course={course}
                  key={course.id}
                  className="p-3"
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminSingleTeacher;
