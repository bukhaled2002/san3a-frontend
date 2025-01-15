"use client";
import { logoutAction } from "@/lib/actions/logoutAction";
import { BookOpenCheck, Loader2, Power, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import NavLink from "../navlink";
import { Button } from "../ui/button";
import User from "../user";

type Props = {};

function NavigationMenu({}: Props) {
  const [isPending, startTransition] = useTransition();

  const handlelogout = async () => {
    startTransition(() => {
      logoutAction();
    });
  };

  return (
    <nav className="flex flex-col justify-between h-full py-7">
      <div>
        <Link href={`/teacher/dashboard`}>
          <Image
            src="/logo.svg"
            width={143}
            height={64}
            className="m-auto"
            alt="logo"
          />
        </Link>
        <ul className="text-base space-y-[24px] font-medium mt-12">
          <NavLink
            href={`/teacher/dashboard`}
            className="flex items-center gap-x-[12px] py-2.5 px-6 whitespace-nowrap"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g id="mage:dashboard-chart">
                <g id="Group">
                  <path
                    id="Vector"
                    d="M15.25 2.75H8.75C5.43629 2.75 2.75 5.43629 2.75 8.75V15.25C2.75 18.5637 5.43629 21.25 8.75 21.25H15.25C18.5637 21.25 21.25 18.5637 21.25 15.25V8.75C21.25 5.43629 18.5637 2.75 15.25 2.75Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    id="Vector_2"
                    d="M7 15L9.45 11.74C9.60003 11.5392 9.81998 11.4021 10.0663 11.3558C10.3126 11.3095 10.5673 11.3574 10.78 11.49L13.17 13C13.3909 13.1406 13.6581 13.1891 13.9142 13.1348C14.1704 13.0806 14.3951 12.9281 14.54 12.71L17 9"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
            </svg>
            <span>لوحة التحكم</span>
          </NavLink>
          <NavLink
            href={`/teacher/courses`}
            className="flex items-center gap-x-[12px] py-2.5 px-6 whitespace-nowrap"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g id="bar-chart-2">
                <path
                  id="Icon"
                  d="M17 20C17 20.5523 17.4477 21 18 21C18.5523 21 19 20.5523 19 20H17ZM19 10C19 9.44772 18.5523 9 18 9C17.4477 9 17 9.44772 17 10H19ZM11 20C11 20.5523 11.4477 21 12 21C12.5523 21 13 20.5523 13 20H11ZM13 4C13 3.44772 12.5523 3 12 3C11.4477 3 11 3.44772 11 4H13ZM5 20C5 20.5523 5.44772 21 6 21C6.55228 21 7 20.5523 7 20H5ZM7 14C7 13.4477 6.55228 13 6 13C5.44772 13 5 13.4477 5 14H7ZM19 20V10H17V20H19ZM13 20V4H11V20H13ZM7 20V14H5V20H7Z"
                  fill="currentColor"
                />
              </g>
            </svg>
            <span>الدورات التعليمية</span>
          </NavLink>
          <NavLink
            href={`/teacher/students`}
            className="flex items-center gap-x-[12px] py-2.5 px-6 whitespace-nowrap"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 33 33"
              fill="none"
            >
              <g id="ph:student-fill">
                <path
                  id="Vector"
                  d="M28.8162 7.55132L16.8162 3.55132C16.611 3.48289 16.389 3.48289 16.1838 3.55132L4.18375 7.55132C3.98463 7.6177 3.81145 7.74505 3.68873 7.91533C3.56601 8.08561 3.49998 8.29018 3.5 8.50007V18.5001C3.5 18.7653 3.60536 19.0196 3.79289 19.2072C3.98043 19.3947 4.23478 19.5001 4.5 19.5001C4.76522 19.5001 5.01957 19.3947 5.20711 19.2072C5.39464 19.0196 5.5 18.7653 5.5 18.5001V9.88757L9.69875 11.2863C8.5832 13.0886 8.22846 15.2599 8.71242 17.3235C9.19638 19.387 10.4795 21.1742 12.28 22.2926C10.03 23.1751 8.085 24.7713 6.6625 26.9538C6.58852 27.0638 6.53713 27.1873 6.51133 27.3173C6.48552 27.4473 6.48581 27.5811 6.51218 27.711C6.53854 27.8409 6.59046 27.9642 6.66492 28.0739C6.73937 28.1835 6.83488 28.2772 6.94588 28.3496C7.05688 28.422 7.18117 28.4717 7.31151 28.4956C7.44185 28.5195 7.57566 28.5173 7.70514 28.4891C7.83463 28.4609 7.95722 28.4072 8.06577 28.3312C8.17433 28.2552 8.2667 28.1583 8.3375 28.0463C10.2213 25.1563 13.1962 23.5001 16.5 23.5001C19.8037 23.5001 22.7788 25.1563 24.6625 28.0463C24.8092 28.2643 25.0357 28.4158 25.2932 28.4681C25.5507 28.5204 25.8184 28.4692 26.0385 28.3257C26.2586 28.1821 26.4133 27.9578 26.4692 27.7011C26.5252 27.4443 26.4779 27.1759 26.3375 26.9538C24.915 24.7713 22.9625 23.1751 20.72 22.2926C22.5188 21.1743 23.8007 19.3882 24.2846 17.3262C24.7684 15.2641 24.4148 13.0943 23.3013 11.2926L28.8162 9.45507C29.0154 9.38873 29.1886 9.2614 29.3114 9.09112C29.4342 8.92084 29.5002 8.71624 29.5002 8.50632C29.5002 8.29641 29.4342 8.09181 29.3114 7.92153C29.1886 7.75125 29.0154 7.62391 28.8162 7.55757V7.55132ZM22.5 15.5001C22.5003 16.4486 22.2756 17.3838 21.8445 18.2287C21.4134 19.0736 20.7881 19.8043 20.0199 20.3608C19.2517 20.9173 18.3625 21.2837 17.4253 21.43C16.4881 21.5763 15.5295 21.4983 14.6283 21.2024C13.7271 20.9065 12.9088 20.4011 12.2407 19.7277C11.5726 19.0544 11.0737 18.2322 10.7849 17.3287C10.4961 16.4251 10.4256 15.466 10.5792 14.5299C10.7329 13.5939 11.1063 12.7076 11.6687 11.9438L16.1838 13.4438C16.389 13.5123 16.611 13.5123 16.8162 13.4438L21.3312 11.9438C22.091 12.9738 22.5006 14.2202 22.5 15.5001Z"
                  fill="currentColor"
                />
              </g>
            </svg>
            <span>الطلاب</span>
          </NavLink>
        </ul>
      </div>
      <div>
        <div className="border-y py-[10px] my-6">
          <ul className="mb-5 space-y-[24px]">
            <NavLink
              href={`/teacher/settings`}
              className="flex items-center gap-x-[12px] py-2.5 px-6 whitespace-nowrap"
            >
              <Settings size={20} />
              <span>الأعدادات</span>
            </NavLink>
          </ul>
          <form action={handlelogout}>
            <Button
              variant="ghost"
              className="text-[#E24444] hover:text-[#E24444] justify-start px-6 py-2.5 gap-x-3 cursor-pointer w-full hover:bg-transparent"
              disabled={isPending}
            >
              <Power size={20} />
              <span>تسجيل الخروج</span>
              {isPending && (
                <Loader2 size={20} className="animate-spin text-destructive" />
              )}
            </Button>
          </form>
        </div>
        <User />
      </div>
    </nav>
  );
}

export default NavigationMenu;
