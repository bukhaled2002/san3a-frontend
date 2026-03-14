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

type Props = {};

function HeaderLinks({}: Props) {
  const pathname = usePathname();

  return (
    <div className="lg:flex-1 flex items-center justify-center lg:flex-row flex-col text-sm xl:text-base font-bold gap-8 lg:mt-0 mt-8">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.title}
            href={link.href}
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
