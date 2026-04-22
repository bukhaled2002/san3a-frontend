"use client";
import Image from "next/image";
import Link from "next/link";

type Props = {};

function Footer({}: Props) {
  return (
    <footer className="bg-background border-t border-primary/20 sm:mt-[120px] mt-16 relative overflow-hidden">
      {/* Footer Glow */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 blur-[100px] -z-10" />
      
      <div className="container space-y-12 sm:pt-20 pt-10 pb-10 lg:space-y-20 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center sm:items-start">
              <Image
                alt="San3a Logo"
                className="mb-6 object-contain invert brightness-150"
                height={60}
                src="/new_images/AR LOGO WHITE-2 Official.png"
                width={150}
              />


              <p className="mt-4 text-tech-grey sm:text-start text-center leading-relaxed font-medium">
                صنعة هي وجهتك لتعلم مهارات المستقبل والعمل الحر. <br/>
                <span className="text-primary font-bold mt-2 block">التقدم أهم من الكمال.</span>
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-10">
            <div>
              <p className="text-white font-black text-xl mb-8 uppercase tracking-widest border-r-4 border-primary pr-4">
                الأكاديمية
              </p>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link href="/courses" className="text-tech-grey hover:text-primary transition shadow-sm hover:neon-glow font-bold">
                    جميع الدورات
                  </Link>
                </li>
                <li>
                  <Link href="/books" className="text-tech-grey hover:text-primary transition shadow-sm hover:neon-glow font-bold">
                    مكتبة صنعة
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-tech-grey hover:text-primary transition shadow-sm hover:neon-glow font-bold">
                    تواصل معنا
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-white font-black text-xl mb-8 uppercase tracking-widest border-r-4 border-primary pr-4">
                الحساب
              </p>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link href="/auth/student/register" className="text-tech-grey hover:text-primary transition shadow-sm hover:neon-glow font-bold">
                    انضم إلينا
                  </Link>
                </li>
                <li>
                  <Link href="/auth/student/login" className="text-tech-grey hover:text-primary transition shadow-sm hover:neon-glow font-bold">
                    تسجيل الدخول
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-tech-grey hover:text-primary transition shadow-sm hover:neon-glow font-bold">
                    الدعم الفني
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-white font-black text-xl mb-8 uppercase tracking-widest border-r-4 border-primary pr-4 text-center sm:text-right">
                تابعنا
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-6">
                <Link href="#" className="text-tech-grey hover:text-primary transition font-rajdhani font-black text-xs border border-primary/20 p-2 hover:border-primary">X / TWITTER</Link>
                <Link href="#" className="text-tech-grey hover:text-primary transition font-rajdhani font-black text-xs border border-primary/20 p-2 hover:border-primary">INSTA</Link>
                <Link href="#" className="text-tech-grey hover:text-primary transition font-rajdhani font-black text-xs border border-primary/20 p-2 hover:border-primary">FB</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-primary/10 text-tech-grey flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-bold">
          <div className="flex items-center gap-3">
             <span>جميع الحقوق محفوظة لدي منصة صنعة</span>
             <span className="font-rajdhani text-primary">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="#" className="hover:text-primary transition">سياسة الخصوصية</Link>
            <Link href="#" className="hover:text-primary transition">الشروط والأحكام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

