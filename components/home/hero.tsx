"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Props = {};

function Hero({}: Props) {
  const { data: session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedInStatus = localStorage.getItem("isLoggedIn") || false;
      setIsLoggedIn(loggedInStatus === "true");
    }
  }, []);

  return (
    <section className="overflow-hidden bg-secondary relative z-10">
      <div className="container md:grid flex flex-col items-center justify-center lg:grid-cols-2 grid-cols-5 sm:min-h-[calc(100vh-73px)] min-h-[calc(100vh-54px)] md:min-h-[calc(100vh-85px)] md:pt-0 pt-10">
        <div className="flex flex-col justify-center lg:col-span-1 col-span-2">
          <h2 className="text-2xl font-bold text-white md:text-[42px] leading-[54.6px]">
            بيتك و مكانك{" "}
            <span className="sm:ms-5 ms-1 text-primary">مع حصتي</span>
          </h2>

          <p className="text-white/85 md:mt-4 lg:w-4/5 font-medium sm:leading-[30px] sm:text-sm">
            جاهز تكمل تفوقك و نجاحك مع أقوى هيئة تدريس في مصر
          </p>

          <div className="flex items-center sm:flex-row flex-col gap-4 mt-4 md:mt-[38px] ">
            <Link className="sm:w-auto w-full" href="/courses">
              <Button className="text-base px-7 sm:w-auto w-full">
                شراء المحاضرات
              </Button>
            </Link>
            {!isLoggedIn ? (
              <Link className="sm:w-auto w-full" href="/auth/student/login">
                <Button className="bg-white text-primary hover:bg-white/90 text-base px-7 sm:w-auto w-full">
                  تسجيل الدخول
                </Button>
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="flex items-center justify-center h-full lg:col-span-1 col-span-3">
          <Image
            alt=""
            src={"/images/hero.webp"}
            width={1000}
            height={1000}
            loading="eager"
            className="lg:max-h-[736px] lg:max-w-[736px] flex-shrink-0 size-full object-contain margin-left lg:static md:relative md:-left-20"
          />
        </div>
      </div>
      <Image
        src="/images/Vector-1.webp"
        className="absolute top-0 end-0 -z-10"
        width={800}
        height={800}
        alt="heroVector"
      />
    </section>
  );
}

export default Hero;
