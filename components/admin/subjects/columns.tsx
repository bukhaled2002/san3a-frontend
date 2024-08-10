"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { GetSubject, deleteSubject } from "@/services/admin/subjects";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { isAxiosError } from "axios";
import { Edit, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AdminSubjectForm from "./form";
import { extractDriveFileId } from "@/lib/helper/driveImage";
export const columns: ColumnDef<GetSubject>[] = [
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
          alt={row.original.name}
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
    cell: ({ row }) => <div className="truncate">{row.original.name}</div>,
  },
  {
    accessorKey: "content",
    header: "المحتوى",
    cell: ({ row }) => (
      <div className="line-clamp-1">{row.original.content}</div>
    ),
  },
  {
    accessorKey: "actions",
    header: "التعديلات",
    cell: ({ row }) => <Actions subject={row.original} />,
  },
];

export function Actions({ subject }: { subject: GetSubject }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: DeleteSubject, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteSubject(id),
    onSuccess: () => {
      toast({
        title: "تم حذف المادة بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["subjects-admin"] });
      setIsDeleteOpen(false);
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
      <Link
        href="/admin/subjects/[id]/edit"
        as={`/admin/subjects/${subject.id}/edit`}
      >
        <Edit className="text-orange-500" size={18} />
      </Link>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogTrigger>
          <Trash2 className="text-red-500" size={18} />
        </DialogTrigger>
        <DialogContent>
          <div>
            <h1 className="text-xl font-semibold mb-2">
              هل انت متأكد من حذف المادة؟
            </h1>
            <DialogDescription className="text-gray-500">
              لا يمكنك التراجع بعد الحذف
            </DialogDescription>
          </div>
          <div className="flex gap-x-3">
            <Button
              onClick={() => setIsDeleteOpen(false)}
              className="w-full bg-gray-400 hover:bg-gray-500"
            >
              رجوع
            </Button>
            <Button
              className="w-full"
              variant="destructive"
              disabled={isDeleting}
              onClick={() => DeleteSubject(subject.id)}
            >
              حذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
