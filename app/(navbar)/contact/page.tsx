import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: "صفحه تواصل معنا لموقع صنعة",
};

type ContactMethod = {
  icon: string;
  title: string;
  description: string;
  detail: string;
};

const contactMethods: ContactMethod[] = [
  {
    icon: "/icons/phone.webp",
    title: "رقم الهاتف",
    description: "من الساعة 8 صباحًا حتى الساعة 5 مساءً.",
    detail: "01066402035",
  },
  {
    icon: "/icons/location.webp",
    title: "المكتب",
    description: "تعال وألقي التحية في المقر الرئيسي لمكتبنا.",
    detail: "15 شارع الوحدة , الاسكندرية",
  },
  {
    icon: "/icons/mail.webp",
    title: "البريد الإلكتروني",
    description: "فريقنا الودود هنا للمساعدة.",
    detail: "hi@7esty.education.com",
  },
];

function Contact() {
  return (
    <section
      className="container sm:pt-20 pt-10 pb-10 flex flex-col items-center justify-center h-full sm:h-[80%]"
      id="contact"
    >
      <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-7">
        <div className="text-secondary bg-secondary/10 rounded-full sm:text-lg text-sm  font-bold sm:px-5 px-2.5 py-2.5 w-full max-w-[216px] text-center">
          تواصل معنا بعدة طرق
        </div>
        <h1 className="sm:text-4xl text-2xl font-bold text-center">
          يسعدنا ان <span className="text-primary">نستمع اليك</span> بجميع الطرق
        </h1>
        <h2 className="text-foreground/70 text-lg font-semibold">
          فريقنا الودود موجود دائمًا للدردشة.
        </h2>
      </div>
      <div className="flex lg:justify-between xl:gap-[84px] gap-10 sm:mt-16 mt-10 flex-wrap justify-center">
        {contactMethods.map((method, index) => (
          <div key={index} className="flex flex-col items-center justify-center space-y-2.5">
            <Image
              src={method.icon}
              className="size-full max-w-[60px] max-h-[60px]"
              width={60}
              height={60}
              alt={method.title}
            />
            <h1 className="sm:text-[26px] text-xl font-bold">{method.title}</h1>
            <div className="sm:text-lg font-semibold text-center">{method.description}</div>
            <div className="text-primary sm:text-xl text-lg">{method.detail}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Contact;
