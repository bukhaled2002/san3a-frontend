"use client";
import { logoutAction } from "@/lib/actions/logoutAction";
import { Loader2, Power, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import NavLink from "../navlink";
import { Button } from "../ui/button";
import User from "../user";

type Props = {};

function NavigationMenu({}: Props) {
  const [isPending, startTransition] = useTransition();

  const handlelogout = async () => {
    startTransition(() => {
      logoutAction();
    });
  };

  return (
    <nav className="flex flex-col justify-between h-full py-7">
      <div>
        <Link href={`/parent/dashboard`} className="block group px-4">
          <div className="relative">
            <Image
              src="/new_images/AR LOGO WHITE-2 Official.png"
              width={160}
              height={70}
              className="m-auto invert brightness-150 transition-all duration-300 group-hover:scale-105"
              alt="logo"
            />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>
        </Link>
        <ul className="text-sm space-y-2 font-bold mt-16 px-4">
          <NavLink
            href={`/parent/sons`}
            className="whitespace-nowrap"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g id="bar-chart-2">
                <path
                  id="Icon"
                  d="M17 20C17 20.5523 17.4477 21 18 21C18.5523 21 19 20.5523 19 20H17ZM19 10C19 9.44772 18.5523 9 18 9C17.4477 9 17 9.44772 17 10H19ZM11 20C11 20.5523 11.4477 21 12 21C12.5523 21 13 20.5523 13 20H11ZM13 4C13 3.44772 12.5523 3 12 3C11.4477 3 11 3.44772 11 4H13ZM5 20C5 20.5523 5.44772 21 6 21C6.55228 21 7 20.5523 7 20H5ZM7 14C7 13.4477 6.55228 13 6 13C5.44772 13 5 13.4477 5 14H7ZM19 20V10H17V20H19ZM13 20V4H11V20H13ZM7 20V14H5V20H7Z"
                  fill="currentColor"
                />
              </g>
            </svg>
            <span>الأبناء</span>
          </NavLink>
        </ul>
      </div>
      <div className="px-4">
        <div className="border-t border-white/5 pt-6 mt-6">
          <form action={handlelogout}>
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-400 hover:bg-red-500/10 justify-start px-4 py-3 gap-x-3 cursor-pointer w-full transition-all group rounded-xl"
              disabled={isPending}
            >
              <Power size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="font-bold">تسجيل الخروج</span>
              {isPending && (
                <Loader2 size={18} className="animate-spin ms-auto" />
              )}
            </Button>
          </form>
        </div>
        <div className="mt-6 pt-6 border-t border-white/5">
          <User />
        </div>
      </div>
    </nav>
  );
}

export default NavigationMenu;
