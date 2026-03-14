"use client";
import { cn } from "@/lib/utils";
import { GetSubject } from "@/services/subjects";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { transformGoogleDriveUrl } from "@/lib/helper/ExtractImg";
const MotionSpan = motion("span");

export const HoverEffect = ({
  items,
  className,
}: {
  items: GetSubject[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4  py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          href={"/courses?subject=" + item?.name}
          key={item?.id}
          className="relative group block p-2 h-full w-full "
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <MotionSpan
                className="absolute inset-0 h-full w-full bg-primary/20 block rounded-none"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />

            )}
          </AnimatePresence>
          <div
            className={cn(
              "rounded-none h-52 w-full p-6 overflow-hidden bg-card border border-primary/10 group-hover:border-primary/40 relative z-20 flex flex-col gap-4 items-center justify-center transition-all duration-300 group-hover:shadow-neon-glow",
              className
            )}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <Image
                src={transformGoogleDriveUrl(item.img_url?.trim() || "/images/no-image.png")}
                className="max-w-[80px] max-h-[80px] size-full object-contain relative z-10"
                width={100}
                height={100}
                alt={item.name + " image"}
              />
            </div>
            <div className="text-xl font-cairo font-black text-white group-hover:text-primary transition-colors text-center uppercase tracking-tight">
              {item.name}
            </div>
          </div>

        </Link>
      ))}
    </div>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
