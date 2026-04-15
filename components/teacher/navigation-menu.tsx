"use client";
import { logoutAction } from "@/lib/actions/logoutAction";
import { 
  Loader2, 
  Power, 
  Settings, 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap 
} from "lucide-react";
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
    <nav className="flex flex-col justify-between h-full py-8">
      <div>
        <Link href={`/teacher/dashboard`} className="block group px-6">
          <div className="relative">
            <Image
              src="/new_images/AR LOGO WHITE-2 Official.png"
              width={140}
              height={60}
              className="m-auto invert brightness-150 transition-all duration-300 group-hover:scale-105"
              alt="logo"
            />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>
        </Link>
        
        <ul className="text-sm space-y-2 font-bold mt-16 px-4">
          <NavLink href={`/teacher/dashboard`} className="whitespace-nowrap">
            <LayoutDashboard size={20} />
            <span>لوحة التحكم</span>
          </NavLink>
          
          <NavLink href={`/teacher/courses`} className="whitespace-nowrap">
            <BookOpen size={20} />
            <span>الدورات التعليمية</span>
          </NavLink>

          <NavLink href={`/teacher/students`} className="whitespace-nowrap">
            <GraduationCap size={20} />
            <span>الطلاب</span>
          </NavLink>
        </ul>
      </div>

      <div className="px-4">
        <div className="border-t border-white/5 pt-6 mt-6">
          <ul className="mb-4">
            <NavLink
              href={`/teacher/settings`}
              className="whitespace-nowrap"
            >
              <Settings size={20} />
              <span>الأعدادات</span>
            </NavLink>
          </ul>
          
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
