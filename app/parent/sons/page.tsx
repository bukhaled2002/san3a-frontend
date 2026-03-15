import ParentSonFilter from "@/components/parent/sons/filter";
import ParentSonsTable from "@/components/parent/sons/table";
import { Button } from "@/components/ui/button";
import { getClasses } from "@/services/public/classes";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ابناءي - ولي امر",
  description: "ابناءي - ولي امر في موقع حصتي",
};

type Props = {
  searchparams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function ParentSons({ searchParams }: Props) {
  const classes = await getClasses();
  //   const subjects = await getSubjects();
  const currentPage = searchParams["page"];
  const selectedClass = searchParams["class"];
  const selectedSubject = searchParams["subject"];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-x-5">
          <h1 className="text-3xl font-bold">ابناءي</h1>
          {/* <ParentSonFilter classes={classes} subjects={subjects.data} /> */}
        </div>
        <Link href="/parent/sons/add">
          <Button variant="secondary" size="sm" className="text-white">
            اضافة ابن جديد
            <Plus className="ms-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <ParentSonsTable
        cPage={currentPage}
        selectedClass={selectedClass}
        selectedSubject={selectedSubject}
      />
    </div>
  );
}

export default ParentSons;

