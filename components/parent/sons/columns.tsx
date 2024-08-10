"use client";
import { GetSon } from "@/services/parent/sons";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import{extractDriveFileId} from "@/lib/helper/driveImage";
export const columns: ColumnDef<GetSon>[] = [
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
    accessorKey: "class",
    header: "الصف",
    cell: ({ row }) => <div>{row.original.class?.name}</div>,
  },
  {
    accessorKey: "wallet.balance",
    header: "الرصيد",
    cell: ({ row }) => <div>{row.original.wallet.balance + " جنية"}</div>,
  },
  {
    accessorKey: "actions",
    header: "التعديلات",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Link href={`/parent/sons/${row.original.id}`}>
          <Eye className="text-blue-500" size={18} />
        </Link>
      </div>
    ),
  },
];
