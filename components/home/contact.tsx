import Image from "next/image";
import Link from "next/link";

type Props = {};
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
    detail: "01105525234",
  },
  // {
  //   icon: "/icons/location.webp",
  //   title: "المكتب",
  //   description: "تعال وألقي التحية في المقر الرئيسي لمكتبنا.",
  //   detail: "15 شارع الوحدة , الاسكندرية",
  // },
  // {
  //   icon: "/icons/mail.webp",
  //   title: "البريد الإلكتروني",
  //   description: "فريقنا الودود هنا للمساعدة.",
  //   detail: "hi@7esty.education.com",
  // },
];

function Contact({}: Props) {
  return (
    <section
      className="container sm:pt-20 pt-10 pb-10 flex flex-col items-center justify-center h-full relative overflow-hidden"
      id="contact"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent -z-10" />
      
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="text-primary border border-primary/20 bg-primary/5 uppercase tracking-[0.2em] font-rajdhani font-black px-6 py-2">
          Contact Us
        </div>
        <h1 className="sm:text-5xl text-3xl font-cairo font-black text-white text-center leading-tight">
          جاهز تبدأ <span className="text-primary neon-glow">صنعتك؟</span> <br/>
          تواصل معانا دلوقتي
        </h1>
        <h2 className="text-tech-grey text-lg font-bold">
          فريق صنعة في خدمتك دايماً لبناء مستقبلك
        </h2>
      </div>
      <div className="flex lg:justify-between xl:gap-[84px] gap-12 sm:mt-20 mt-12 flex-wrap justify-center">
        {contactMethods.map((method, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center space-y-4 group"
          >
            <div className="relative p-4 border border-primary/10 group-hover:border-primary transition-all duration-300">
              <Image
                src={method.icon}
                className="size-full max-w-[60px] max-h-[60px] object-contain"
                width={60}
                height={60}
                alt={method.title}
              />
            </div>
            <h1 className="sm:text-2xl text-xl font-cairo font-black text-white group-hover:text-primary transition-colors">{method.title}</h1>
            <div className="text-tech-grey font-medium text-center max-w-[250px]">
              {method.description}
            </div>
            <div className="text-primary sm:text-3xl text-2xl font-rajdhani font-black neon-glow cursor-pointer">
              {method.detail}
            </div>
          </div>
        ))}
      </div>
    </section>

  );
}

export default Contact;
