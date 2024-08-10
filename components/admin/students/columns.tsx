"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { GetStudent, deleteStudent } from "@/services/admin/students";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { isAxiosError } from "axios";
import { Edit, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { extractDriveFileId } from "@/lib/helper/driveImage";

// function extractDriveFileId(url) {
//   const regex = /\/d\/([^\/]+)\//;
//   const match = url.match(regex);
//   if (match && match[1]) {
//       return match[1];
//   } else {
//       return null;
//   }
// }

// const url = "https://drive.google.com/file/d/1jFvvu3-E1Ah6GvgcIx5MOgZGdyTKe5p6/view";
// const fileId = extractDriveFileId(url);
// console.log(fileId); // Output: 1jFvvu3-E1Ah6GvgcIx5MOgZGdyTKe5p6


export const columns: ColumnDef<GetStudent>[] = [
  {
    
    accessorKey: "img_url",
    header: "الصورة الشخصية",
    cell: ({ row }) => (
      <div>
        <Image
          src={row.original.img_url ? `https://drive.google.com/uc?export=view&id=${extractDriveFileId(row.original.img_url)}` : "/images/defaultAvatar.webp"}
          alt={row.original.firstName + " " + row.original.lastName}
          width={200}
          height={200}
          className="w-16 h-16 rounded-full m-auto object-cover"
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "الأسم",
    cell: ({ row }) => (
      <div className="truncate">
        {row.original.firstName + " " + row.original.lastName}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "البريد الالكتروني",
    cell: ({ row }) => <div className="line-clamp-1">{row.original.email}</div>,
  },
  {
    accessorKey: "phone",
    header: "رقم الهاتف",
    cell: ({ row }) => <div>{row.original.phone}</div>,
  },
  {
    accessorKey: "class",
    header: "الصف",
    cell: ({ row }) => <div>{row.original.class?.name}</div>,
  },
  //   {
  //     accessorKey: "status",
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant="ghost"
  //           className="p-0"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           Status
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       );
  //     },
  //     cell: ({ row }) => (
  //       <div
  //         className={cn(
  //           "capitalize",
  //           row.original.status === "inactive" && "text-red-500",
  //           row.original.status === "active" && "text-green-500",
  //           row.original.status === "terminated" && "text-yellow-500",
  //           row.original.status === "finished" && "text-blue-500"
  //         )}
  //       >
  //         {row.original.status}
  //       </div>
  //     ),
  //   },
  {
    accessorKey: "actions",
    header: "التعديلات",
    cell: ({ row }) => <Actions student={row.original} />,
  },
];

export function Actions({ student }: { student: GetStudent }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: DeleteStudent, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => {
      toast({
        title: "تم حذف الطالب بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["students-admin"] });
      setIsOpen(false);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast({
          title: error.response?.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "حدث خطأ ما",
          variant: "destructive",
        });
      }
    },
  });

  return (
    <div className="flex items-center justify-center gap-2">
      <Link href={`/admin/students/${student.id}`}>
        <Eye className="text-blue-500" size={18} />
      </Link>
      <Link href={`/admin/students/${student.id}/edit`}>
        <Edit className="text-orange-500" size={18} />
      </Link>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Trash2 className="text-red-500" size={18} />
        </DialogTrigger>
        <DialogContent>
          <div>
            <h1 className="text-xl font-semibold mb-2">
              هل متأكده من حذف هذا الطالب؟
            </h1>
            <DialogDescription className="text-gray-500">
              لا يمكنك التراجع بعد الحذف
            </DialogDescription>
          </div>
          <div className="flex gap-x-3">
            <Button
              onClick={() => setIsOpen(false)}
              className="w-full bg-gray-400 hover:bg-gray-500"
            >
              رجوع
            </Button>
            <Button
              className="w-full"
              variant="destructive"
              disabled={isDeleting}
              onClick={() => DeleteStudent(student.id)}
            >
              حذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
