import Image from "next/image";
import Link from "next/link";

type Props = {};

function Footer({}: Props) {
  return (
    <footer className="bg-secondary rounded-t-[30px] sm:mt-[120px] mt-16">
      <div className="container space-y-8 sm:pt-16 pt-8 pb-8 lg:space-y-20 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div>
            <div className="text-teal-600">
              <Image
                alt="Logo"
                className="sm:mx-0 mx-auto"
                height={63.87}
                src="/white-logo.svg"
                width={125}
              />
            </div>

            <p className="mt-4 sm:max-w-xs text-white/80 sm:text-start text-center">
              جاهز تكمل تفوقك و نجاحك مع أقوى هيئة تدريس في مصر
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-2  mt-10 gap-5">
            {/* <div>
              <p className="text-white font-bold text-xl text-center">
                مركز المساعدة
              </p>
              <ul className="mt-6 space-y-4 text-sm text-center">
                <li>
                  <Link
                    href="#"
                    className="text-white/80 transition hover:opacity-75"
                  >
                    مركز المساعدة
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-white/80 transition hover:opacity-75"
                  >
                    مركز المساعدة
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-white/80 transition hover:opacity-75"
                  >
                    مركز المساعدة
                  </Link>
                </li>
              </ul>
            </div> */}

            <div>
              <p className="text-white font-bold text-xl text-center">
                الصفحة الرئيسية
              </p>
              <ul className="mt-6 space-y-4 text-sm text-center">
                <li>
                  <Link
                    href="/auth/student/register"
                    className="text-white/80 transition hover:opacity-75"
                  >
                    اعمل اكونت دلوقتي
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/student/login"
                    className="text-white/80 transition hover:opacity-75"
                  >
                    تسجيل الدخول
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-white/80 transition hover:opacity-75"
                  >
                    المساعدة
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-white font-bold text-xl text-center">
                تواصل معانا
              </p>
              <ul className="mt-6 space-y-4 text-sm text-center">
                <li>
                  <Link
                    href="#"
                    className="text-white/80 transition hover:opacity-75"
                  >
                    مصر - القاهرة
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-white/80 transition hover:opacity-75"
                  >
                    مركز المساعدة
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-white/80 transition hover:opacity-75"
                  >
                    مركز المساعدة
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className=" text-white flex items-center justify-center gap-x-5 sm:flex-row flex-col-reverse gap-y-3">
          <div className="">جميع الحقوق محفوظة لدي منصة حصتي</div>
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          <Link href="#" className="">
            سياسة الخصوصية
          </Link>
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          <Link href="#" className="">
            الشروط والأحكام
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
