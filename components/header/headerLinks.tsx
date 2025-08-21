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
    title: "الدورات",
    href: "/courses",
  },
  {
    title: "اشتري كتابك دلوقتي",
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
    <div className="lg:flex-1 flex items-center justify-center lg:flex-row flex-col text-base font-medium gap-6 lg:mt-0 mt-5">
      {links.map((link) => {
        return (
          <Link
            key={link.title}
            href={link.href}
            className={cn(
              "text-[#121212] hover:text-primary relative lg:w-auto w-full",
              pathname === link.href && "text-primary"
            )}
          >
            {pathname === link.href && (
              <motion.span layoutId="underline" className="line mt-1" />
            )}
            {link.title}
          </Link>
        );
      })}
    </div>
  );
}

export default HeaderLinks;
