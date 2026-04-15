"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = React.ComponentProps<typeof Link>;

export default function NavLink({ className, ...props }: Props) {
  const pathname = usePathname();
  return (
    <li
      className={cn(
        "transition-all duration-300 relative group",
        pathname === props.href && "text-primary neon-glow translate-x-1"
      )}
    >
      <Link 
        {...props} 
        className={cn(
          "flex items-center gap-x-3 py-3 px-4 rounded-lg transition-all duration-300",
          pathname === props.href 
            ? "bg-primary/10 text-primary" 
            : "text-tech-grey hover:text-primary hover:bg-white/5",
          className
        )} 
      />
      {pathname === props.href && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary shadow-neon-glow rounded-r-full" />
      )}
    </li>
  );
}
