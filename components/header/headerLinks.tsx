"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    title: "الرئيسية",
    href: "/",
  },
  {
    title: "أكاديمية صنعة",
    href: "/courses",
  },
  {
    title: "مكتبة صنعة",
    href: "/books",
  },
  {
    title: "تواصل معنا",
    href: "/contact",
  },
];

type Props = {
  onClick?: () => void;
};

function HeaderLinks({ onClick }: Props) {
  const pathname = usePathname();

  return (
    <div className="lg:flex-1 flex lg:items-center items-start lg:justify-center justify-start lg:flex-row flex-col text-base font-bold gap-6 lg:gap-8 lg:mt-0 mt-4">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.title}
            href={link.href}
            onClick={onClick}
            className={cn(
              "text-tech-grey hover:text-primary transition-colors duration-300 relative lg:w-auto w-full group tracking-wide",
              isActive && "text-primary neon-glow"
            )}
          >
            {link.title}
            <span 
              className={cn(
                "absolute -bottom-1 right-0 h-[2px] bg-primary transition-all duration-300",
                isActive ? "w-full shadow-neon-glow" : "w-0 group-hover:w-full"
              )} 
            />
          </Link>
        );
      })}
    </div>
  );
}


export default HeaderLinks;
