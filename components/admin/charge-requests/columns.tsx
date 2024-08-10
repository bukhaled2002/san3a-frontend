"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import {
  GetCharageRequest,
  changeChargeRequestStatus,
} from "@/services/admin/charge-requests";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { isAxiosError } from "axios";
import Image from "next/image";
import { useState } from "react";
import{extractDriveFileId} from "@/lib/helper/driveImage";
export const columns: ColumnDef<GetCharageRequest>[] = [
  {
    accessorKey: "img_url",
    header: "الصورة الشخصية",
    cell: ({ row }) => (
      <div>
        <Image
          src={
            row.original.student.img_url
              ? `https://drive.google.com/uc?export=view&id=${extractDriveFileId(
                  row.original.student.img_url
                )}`
              : "/images/defaultAvatar.webp"
          }
          alt={
            row.original.student.firstName +
            " " +
            row.original.student.lastName
          }
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
    cell: ({ row }) => (
      <div className="truncate capitalize">
        {row.original.student.firstName + " " + row.original.student.lastName}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ الطلب",
    cell: ({ row }) => (
      <div className="line-clamp-1">
        {new Date(row.original.createdAt).toLocaleDateString("en-US")}
      </div>
    ),
  },
  {
    accessorKey: "reference_number",
    header: "رقم العملية",
    cell: ({ row }) => <div>{row.original.reference_number}</div>,
  },
  {
    accessorKey: "amount",
    header: "المبلغ",
    cell: ({ row }) => (
      <div className="text-[#4635B7]">{row.original.amount} ج.م</div>
    ),
  },
  {
    accessorKey: "actions",
    header: "التعديلات",
    cell: ({ row }) => {
      return row.original.status === "pending" ? (
        <Actions chargeRequest={row.original} />
      ) : (
        <>
          {row.original.status === "paid" && (
            <div className="text-[#027A48] bg-[#ECFDF3] font-medium py-3 rounded-full max-w-[120px] m-auto">
              تم القبول
            </div>
          )}
          {row.original.status === "rejected" && (
            <div className="text-[#B42318] bg-[#FEF3F2] font-medium py-3 rounded-full max-w-[120px] m-auto">
              تم الرفض
            </div>
          )}
        </>
      );
    },
  },
];

export function Actions({
  chargeRequest,
}: {
  chargeRequest: GetCharageRequest;
}) {
  const [isAcceptOpen, setIsAcceptOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: changeStatus, isPending } = useMutation({
    mutationFn: (status: "paid" | "rejected") =>
      changeChargeRequestStatus(chargeRequest.id, status),
    onSuccess: () => {
      toast({
        title: "تم تغيير حالة الطلب بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["charge-requests-admin"] });
      setIsAcceptOpen(false);
      setIsRejectOpen(false);
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
      <Dialog open={isAcceptOpen} onOpenChange={setIsAcceptOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#40D840] hover:bg-[#40D840]">قبول</Button>
        </DialogTrigger>
        <DialogContent>
          <div>
            <h1 className="text-xl font-semibold mb-2">
              هل متأكد من قبول هذا الطلب؟
            </h1>
            <DialogDescription className="text-gray-500">
              لا يمكنك التراجع بعد القبول
            </DialogDescription>
          </div>
          <div className="flex gap-x-3">
            <Button
              onClick={() => setIsAcceptOpen(false)}
              className="w-full bg-gray-400 hover:bg-gray-500"
            >
              رجوع
            </Button>
            <Button
              className="w-full"
              disabled={isPending}
              onClick={() => changeStatus("paid")}
            >
              قبول
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#D84049] hover:bg-[#D84049]">رفض</Button>
        </DialogTrigger>
        <DialogContent>
          <div>
            <h1 className="text-xl font-semibold mb-2">
              هل متأكد من رفض هذا الطلب؟
            </h1>
            <DialogDescription className="text-gray-500">
              لا يمكنك التراجع بعد الرفض
            </DialogDescription>
          </div>
          <div className="flex gap-x-3">
            <Button
              onClick={() => setIsRejectOpen(false)}
              className="w-full bg-gray-400 hover:bg-gray-500"
            >
              رجوع
            </Button>
            <Button
              className="w-full"
              variant="destructive"
              disabled={isPending}
              onClick={() => changeStatus("rejected")}
            >
              رفض
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
