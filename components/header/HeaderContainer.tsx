"use client"; // This ensures the component is a Client Component

import { logoutAction } from "@/lib/actions/logoutAction";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import HeaderLinks from "./headerLinks";
import User from "./user";
import HamburgerMenu from "@/public/icons/HamburgerIcon";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CloseIcon from "@/public/icons/CloseIcon";
import LogoutIcon from "@/public/icons/LogoutIcon";
import SearchLecture from "./SearchLecture";

const MotionDiv = motion("div");


type Props = {
  data: any; // Adjust the type based on what `auth()` returns
};

function HeaderContainer({ data }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };
  const handleLogout = async () => {
    try {
      await logoutAction();

      localStorage.setItem("isLoggedIn", "false");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="bg-background/80 backdrop-blur-md py-4 fixed top-0 z-50 w-full border-b border-primary/20 shadow-neon-glow">
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
        <button
          onClick={toggleSidebar}
          className="lg:hidden block text-primary"
        >
          <HamburgerMenu />
        </button>
        <AnimatePresence>
          {isSidebarOpen && (
            <MotionDiv
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleSidebar}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isSidebarOpen && (
            <MotionDiv
              className="flex flex-col bg-background border-r border-primary/20 fixed top-0 left-0 h-full shadow-2xl z-50 p-6 lg:hidden md:w-[50%] w-[80%]"
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{
                ease: "easeInOut",
                duration: 0.4,
              }}
            >


          <div className="flex justify-between items-center mb-10">
            <Image
              className="h-[40px] w-auto"
              alt="Logo"
              height={40}
              src="/new_images/AR LOGO WHITE Official.png.png"
              width={120}
            />
            <button
              onClick={toggleSidebar}
              className="text-primary hover:neon-glow"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="mb-8">
            <SearchLecture />
          </div>

          {!data || !data.user ? null : (
            <div className="border-b border-primary/10 pb-6 mb-6">
              <User />
              <button
                className="text-red-500 hover:text-red-400 flex items-center justify-end gap-2 flex-row-reverse mt-4 font-bold"
                onClick={handleLogout}
              >
                <span>تسجيل الخروج</span>
                <div className="rotate-180">
                  <LogoutIcon />
                </div>
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            <HeaderLinks />
          </div>

          {!data || !data.user ? (
            <div className="pt-6 flex flex-col gap-4 border-t border-primary/10">
              <Link className="w-full" href={`/auth/student/login`}>
                <Button className="text-base w-full bg-primary text-background font-bold">
                  تسجيل الدخول
                </Button>
              </Link>
              <Link className="w-full" href={`/auth/student/register`}>
                <Button
                  className="text-base w-full font-bold"
                  variant="outline"
                >
                  انشاء حساب
                </Button>
              </Link>
            </div>
          ) : null}
            </MotionDiv>
          )}
        </AnimatePresence>

      </nav>
    </header>
  );
}

export default HeaderContainer;
