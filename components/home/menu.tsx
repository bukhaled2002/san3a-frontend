import { Separator } from "@/components/ui/separator";
import { LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function Menu() {
  return (
    <div className="container sm:py-12 pt-10 flex items-center justify-between gap-6 md:flex-row flex-col font-bold text-base overflow-hidden border-b border-primary/10">
      <div className="flex items-center gap-x-8 md:overflow-visible overflow-x-scroll w-full md:pb-0 pb-4">
        <div className="bg-primary text-background px-4 py-2 rounded-none font-black flex items-center shadow-neon-glow whitespace-nowrap">
          <LayoutDashboard size={20} className="inline me-2" />
          جميع الفئات
        </div>
        <Link
          href="/about"
          className="text-tech-grey hover:text-white transition-colors min-w-fit"
        >
          عن صنعة
        </Link>
        <div className="flex h-6 items-center space-x-6 text-sm font-bold rtl:space-x-reverse">
          <div className="w-[1px] h-full bg-primary/20 mx-4" />
          <Link
            className="text-tech-grey hover:text-primary transition-all whitespace-nowrap"
            href={`/courses?class=LEVEL-01`}
          >
            المستوى 01
          </Link>
          <Link
            className="text-tech-grey hover:text-primary transition-all whitespace-nowrap"
            href={`/courses?class=LEVEL-02`}
          >
            المستوى 02
          </Link>
          <Link
            className="text-tech-grey hover:text-primary transition-all whitespace-nowrap"
            href={`/courses?class=LEVEL-03`}
          >
            المستوى 03
          </Link>
        </div>
      </div>
      <Link
        href="tel:01066402737"
        className="text-primary flex items-center gap-3 text-xl font-rajdhani font-black neon-glow group"
      >
        <span className="group-hover:tracking-widest transition-all">
          01066402737
        </span>
        <div className="p-2 border border-primary/20 group-hover:border-primary transition-colors">
          <Image
            src="/icons/whatsapp.svg"
            width={24}
            height={24}
            className="object-contain"
            alt="whatsapp"
          />
        </div>
      </Link>
    </div>
  );
}

export default Menu;
