"use client";
import { getUserByToken } from "@/services/profile";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { transformGoogleDriveUrl } from "@/lib/helper/ExtractImg";
function User() {
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: getUserByToken,
  });

  if (!data) {
    return <Loader2 className="animate-spin" />;
  }
  return (
    <div className="flex items-center gap-x-[10px]">
      <Image
        alt={data.name + " image"}
        className="rounded-full object-cover"
        width={53}
        height={53}
        unoptimized
        src={
          data.img_url !== undefined
            ? transformGoogleDriveUrl(data.img_url)
            : "/images/defaultAvatar.webp"
        }
      />
      <div>
        <h1 className="text-sm font-bold text-tech-grey">{data.name}</h1>
        <div className="text-sm font-medium text-tech-grey">{data.email}</div>
      </div>
    </div>
  );
}

export default User;
