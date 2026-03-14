import { getSubjects } from "@/services/subjects";
import { HoverEffect } from "../aceternity/card-hover-effect";
import { Button } from "../ui/button";

type Props = {};

async function Subjects({}: Props) {
  const subjects = await getSubjects();

  return (
    <div className="container py-10 space-y-12">
      <div className="title relative w-fit mb-8">
        <h1 className="sm:text-3xl text-2xl font-cairo font-black text-white uppercase tracking-tight">مهارات المستقبل</h1>
        <div className="title-underline" />
      </div>
      <HoverEffect items={subjects.data} />
    </div>

  );
}

export default Subjects;
