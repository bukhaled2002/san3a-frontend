"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MotionDiv = motion("div");

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
    <section className="overflow-hidden bg-background relative z-10 pt-20">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] -z-10 rounded-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 blur-[100px] -z-10 rounded-none" />
      
      <div className="container md:grid flex flex-col items-center justify-center lg:grid-cols-2 grid-cols-1 sm:min-h-[calc(100vh-80px)] min-h-[calc(100vh-60px)] gap-10">
        <div className="flex flex-col justify-center text-center lg:text-right">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-cairo font-black text-white leading-tight mb-6">
              <span className="text-primary neon-glow">صنعة</span> <br className="hidden md:block"/>
              التقدم أهم من الكمال
            </h1>
            
            <p className="text-tech-grey text-lg md:text-xl lg:w-4/5 font-medium mb-10 mx-auto lg:mx-0">
              ابدأ صغير.. فكّر كبير. <br className="md:hidden"/>
              انضم لأكبر منصة لبناء مهارات المستقبل في مجالات الذكاء الاصطناعي، التصميم، وإنتاج الفيديو.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <Link className="sm:w-auto w-full group" href="/courses">
                <Button className="bg-primary text-background hover:bg-primary/90 text-lg font-bold px-10 py-7 rounded-none transition-all shadow-neon-glow-strong group-hover:scale-105">
                  استكشف الأكاديمية
                </Button>
              </Link>
              {!isLoggedIn ? (
                <Link className="sm:w-auto w-full group" href="/auth/student/login">
                  <Button variant="outline" className="text-white border-primary/40 hover:border-primary text-lg font-bold px-10 py-7 rounded-none transition-all group-hover:bg-primary/5">
                    تسجيل الدخول
                  </Button>
                </Link>
              ) : null}
            </div>
          </MotionDiv>
          
          <div className="mt-12 flex items-center justify-center lg:justify-start gap-8">
            <div className="text-center group">
              <div className="text-primary text-2xl font-rajdhani font-black group-hover:neon-glow">10K+</div>
              <div className="text-tech-grey text-xs uppercase tracking-widest font-rajdhani">Builders</div>
            </div>
            <div className="w-[1px] h-10 bg-primary/20" />
            <div className="text-center group">
              <div className="text-primary text-2xl font-rajdhani font-black group-hover:neon-glow">50+</div>
              <div className="text-tech-grey text-xs uppercase tracking-widest font-rajdhani">Skills</div>
            </div>
            <div className="w-[1px] h-10 bg-primary/20" />
            <div className="text-center group">
              <div className="text-primary text-2xl font-rajdhani font-black group-hover:neon-glow">24/7</div>
              <div className="text-tech-grey text-xs uppercase tracking-widest font-rajdhani">Support</div>
            </div>
          </div>
        </div>

        <MotionDiv 
          className="flex items-center justify-center relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Laser Separator Decoration */}
          <div className="absolute -left-10 top-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent blur-[1px] rotate-[30deg] hidden lg:block" />
          <div className="absolute -right-10 top-1/3 w-60 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent blur-[1px] -rotate-[15deg] hidden lg:block" />

          <div className="relative group">
            <div className="absolute -inset-1 bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all duration-1000" />
            <Image
              alt="San3a Tech Hero"
              src="/new_images/SAN3A-1.png"
              width={800}
              height={800}
              priority
              className="relative z-10 lg:max-h-[600px] w-auto drop-shadow-[0_0_30px_rgba(204,255,0,0.2)]"
            />
          </div>
        </MotionDiv>
      </div>
    </section>
  );
}

export default Hero;

