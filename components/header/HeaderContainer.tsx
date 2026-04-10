"use client"; // This ensures the component is a Client Component

import { logoutAction } from "@/lib/actions/logoutAction";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import HeaderLinks from "./headerLinks";
import User from "./user";
import HamburgerMenu from "@/public/icons/HamburgerIcon";
import { useState } from "react";
import LogoutIcon from "@/public/icons/LogoutIcon";
import SearchLecture from "./SearchLecture";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Props = {
  data: any; // Adjust the type based on what `auth()` returns
};

function HeaderContainer({ data }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutAction();

      localStorage.setItem("isLoggedIn", "false");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <header className="bg-background/80 backdrop-blur-md py-2 md:py-3 fixed top-0 z-50 w-full border-b border-primary/20 shadow-neon-glow">
      <nav className="container flex items-center justify-between gap-x-5">
        <div className="flex items-center gap-x-6">
          <Link href="/">
            <span className="sr-only">صنعة - San3a</span>
            <Image
              className="md:h-[60px] md:w-auto sm:w-[130px] w-[90px] object-contain invert brightness-150"
              alt="Logo"
              height={60}
              src="/new_images/AR LOGO WHITE-2 Official.png"
              width={180}
              priority
            />
          </Link>
          <div className="hidden md:block">
            <SearchLecture />
          </div>
        </div>
        <div className="lg:block hidden">
          <HeaderLinks />
        </div>
        {!data || !data.user ? (
          <div>
            <div className="lg:flex hidden items-center gap-x-4">
              <Link href={`/auth/student/login`}>
                <Button className="text-base font-bold px-6 bg-primary text-background hover:bg-primary/90 shadow-neon-glow-strong">
                  تسجيل الدخول
                </Button>
              </Link>
              <Link href={`/auth/student/register`}>
                <Button className="text-base font-bold px-6" variant="outline">
                  انضم إلينا
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="lg:flex hidden items-center gap-4">
            <button onClick={handleLogout} className="group">
              <div className="flex items-center gap-2 border border-primary/30 rounded-none px-4 py-2 text-sm font-rajdhani font-bold text-primary hover:bg-primary hover:text-background transition-all shadow-sm group-hover:shadow-neon-glow">
                <span>LOGOUT</span>
                <LogoutIcon />
              </div>
            </button>
            <User />
          </div>
        )}

        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <button className="lg:hidden block text-primary hover:text-primary/80 transition-colors p-2 -mr-2">
              <HamburgerMenu />
            </button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className="w-[85%] sm:max-w-md bg-background border-l border-primary/30 p-6 flex flex-col h-full text-white shadow-neon-glow"
          >
            <SheetHeader className="text-right mb-8">
              <SheetTitle>
                <Image
                  className="h-[45px] w-auto"
                  alt="Logo"
                  height={45}
                  src="/new_images/AR LOGO WHITE Official.png.png"
                  width={130}
                />
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-8 flex flex-col h-full">
              <div className="space-y-6">
                <SearchLecture />
                <div className="laser-separator" />
              </div>

              {!data || !data.user ? null : (
                <div className="border-b border-primary/10 pb-6">
                  <User />
                  <button
                    className="text-red-500 hover:text-red-400 flex items-center gap-2 mt-4 font-bold transition-colors"
                    onClick={handleLogout}
                  >
                    <div className="rotate-180">
                      <LogoutIcon />
                    </div>
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              )}

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                <HeaderLinks onClick={closeSidebar} />
              </div>

              {!data || !data.user ? (
                <div className="pt-6 flex flex-col gap-4 border-t border-primary/20 mt-auto">
                  <Link className="w-full" href={`/auth/student/login`} onClick={closeSidebar}>
                    <Button className="text-base w-full bg-primary text-background font-bold shadow-neon-glow hover:bg-primary/90 transition-all">
                      تسجيل الدخول
                    </Button>
                  </Link>
                  <Link className="w-full" href={`/auth/student/register`} onClick={closeSidebar}>
                    <Button
                      className="text-base w-full font-bold border-primary/30 hover:bg-primary/10 transition-all"
                      variant="outline"
                    >
                      انشاء حساب
                    </Button>
                  </Link>
                </div>
              ) : null}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}

export default HeaderContainer;
