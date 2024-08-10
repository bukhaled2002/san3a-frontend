"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { GetAdmin, deleteAdmin } from "@/services/admin/manage-admins";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { isAxiosError } from "axios";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import{extractDriveFileId} from "@/lib/helper/driveImage";
export const columns: ColumnDef<GetAdmin>[] = [
  {
    accessorKey: "id",
    header: "الرقم",
    cell: ({ row }) => <div className="truncate">{row.original.id}</div>,
  },
  {
    accessorKey: "name",
    header: "الأسم",
    cell: ({ row }) => <div className="truncate">{row.original.name}</div>,
  },
  {
    accessorKey: "email",
    header: "البريد الالكتروني",
    cell: ({ row }) => <div className="line-clamp-1">{row.original.email}</div>,
  },
  {
    accessorKey: "actions",
    header: "التعديلات",
    cell: ({ row }) => <Actions admin={row.original} />,
  },
];

export function Actions({ admin }: { admin: GetAdmin }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: DeleteAdmin, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteAdmin(id),
    onSuccess: () => {
      toast({
        title: "تم حذف المشرف بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
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
      {/* <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger>
          <Edit className="text-orange-500" size={18} />
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
              onClick={() => setIsEditOpen(false)}
              className="w-full bg-gray-400 hover:bg-gray-500"
            >
              رجوع
            </Button>
            <Button
              className="w-full"
              variant="destructive"
              disabled={isDeleting}
              // onClick={() => DeleteTeacher(teacher.id)}
            >
              حذف
            </Button>
          </div>
        </DialogContent>
      </Dialog> */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogTrigger>
          <Trash2 className="text-red-500" size={18} />
        </DialogTrigger>
        <DialogContent>
          <div>
            <h1 className="text-xl font-semibold mb-2">
              هل متأكد من حذف هذا المشرف؟
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
              onClick={() => DeleteAdmin(admin.id)}
            >
              حذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
