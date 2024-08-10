"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  GetTeacher,
  deleteTeacher,
  updateTeacher,
} from "@/services/admin/teachers";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { isAxiosError } from "axios";
import { Edit, Eye, Pin, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { extractDriveFileId } from "@/lib/helper/driveImage";

export const columns: ColumnDef<GetTeacher>[] = [
  {
    accessorKey: "img_url",
    header: "الصورة الشخصية",
    cell: ({ row }) => (
      <div>
        <Image
          src={
            row.original.img_url
              ? `https://drive.google.com/uc?export=view&id=${extractDriveFileId(
                  row.original.img_url
                )}`
              : "/images/defaultAvatar.webp"
          }
          alt={row.original.fullName}
          width={200}
          height={200}
          className="w-16 h-16 rounded-full m-auto object-cover   "
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "الأسم",
    cell: ({ row }) => <div className="truncate">{row.original.fullName}</div>,
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
  // {
  //   accessorKey: "subject",
  //   header: "المادة",
  //   cell: ({ row }) => <div>{row.original.subject.name}</div>,
  // },
  {
    accessorKey: "actions",
    header: "التعديلات",
    cell: ({ row }) => <Actions teacher={row.original} />,
  },
];

export function Actions({ teacher }: { teacher: GetTeacher }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: DeleteTeacher, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteTeacher(id),
    onSuccess: () => {
      toast({
        title: "تم حذف المعلم بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["teachers-admin"] });
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
  const { mutate: UpdateTeacher, isPending: isUpdating } = useMutation({
    mutationFn: (isPin: boolean) => updateTeacher(teacher.id, { isPin }),
    onSuccess: () => {
      toast({
        title: "تم تثبيت المعلم بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["teachers-admin"] });
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
      <button
        onClick={() => UpdateTeacher(!teacher.isPin)}
        disabled={isUpdating}
      >
        <Pin
          className={cn(
            "cursor-pointer",
            teacher.isPin ? "text-green-500 fill-green-500" : "text-gray-500"
          )}
          size={18}
        />
      </button>
      <Link href={`/admin/teachers/${teacher.id}`}>
        <Eye className="text-blue-500" size={18} />
      </Link>
      <Link href={`/admin/teachers/${teacher.id}/edit`}>
        <Edit className="text-orange-500" size={18} />
      </Link>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Trash2 className="text-red-500" size={18} />
        </DialogTrigger>
        <DialogContent>
          <div>
            <h1 className="text-xl font-semibold mb-2">
              هل متأكد من حذف هذا المعلم؟
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
              onClick={() => DeleteTeacher(teacher.id)}
            >
              حذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
