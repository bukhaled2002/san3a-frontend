"use client"; // Ensure this is a client component
import { usePathname } from "next/navigation";
import { FollowerPointerCard } from "@/components/aceternity/followingPointer";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginRoute = pathname.includes("/register");

  return (
    <section
      className={`relative flex lg:flex-row flex-col gap-10 items-center px-4 xl:px-10 py-5 overflow-hidden ${
        isLoginRoute ? "h-auto" : "h-full"
      }`}
    >
      <main className="w-full lg:w-1/2 flex h-full items-center justify-center flex-col relative">
        {children}
      </main>
      <FollowerPointerCard
        className={`hidden lg:block relative w-full lg:w-1/2 bg-secondary p-10 rounded-[37px] text-white z-20 flex-1 ${
          isLoginRoute ? "h-[calc(100vh-40px)]" : "h-full"
        }`}
        title={<TitleComponent />}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <h1 className="font-extrabold xl:text-[38px] text-3xl mb-5">
              عن منصة صنعة
            </h1>
            <p className="xl:text-[22px] text-lg font-medium leading-normal w-[90%]">
              هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد
              هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو
              العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها
              التطبيق. هذا النص ه
            </p>
          </div>
          <Image
            src="/images/auth-illustration.webp"
            alt="hero"
            className="xl:w-[717.33px] xl:h-[538px] z-10"
            width={800}
            height={800}
          />
          <Image
            src="/images/Vector-3.webp"
            alt="hero"
            className="absolute end-0 top-0 z-10 w-full h-full object-cover"
            width={700}
            height={700}
          />
        </div>
      </FollowerPointerCard>
    </section>
  );
}

const TitleComponent = () => (
  <div className="flex space-x-2 items-center">
    <p>تسجيل الدخول</p>
  </div>
);
