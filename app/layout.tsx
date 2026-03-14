import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/providers/QueryClientProvider";
import AuthSessionProvider from "@/providers/SessionProvider";
import type { Metadata } from "next";
import { Cairo, Rajdhani, Readex_Pro } from "next/font/google";
import { DirectionProvider } from "@/providers/DirectionProvider";
import "./globals.css";

const CairoFont = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
});

const RajdhaniFont = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
});

const ReadexProFont = Readex_Pro({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-readex",
});

export const metadata: Metadata = {
  title: {
    default: "صنعة - San3a",
    template: "%s | صنعة",
  },
  description: "صنعة هي منصة لتعلم المهارات الحديثة - التقدم أهم من الكمال.",
  keywords: [
    "صنعة",
    "San3a",
    "تعلم",
    "برمجة",
    "ذكاء اصطناعي",
    "تصميم",
    "فيديو",
    "العمل الحر",
    "Gen Z",
    "Skill building",
  ],
  openGraph: {
    locale: "ar_AR",
    type: "website",
    siteName: "San3a",
    title: "San3a | صنعة",
    description: "ابدأ صغير.. فكّر كبير. صنعة هي وجهتك لتعلم مهارات المستقبل.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark" style={{ colorScheme: 'dark' }}>
      <DirectionProvider>
        <body className={`${CairoFont.variable} ${RajdhaniFont.variable} ${ReadexProFont.variable} font-readex antialiased bg-[#020405] text-white min-h-screen`}>
          <AuthSessionProvider>
            <QueryProvider>
              <div className="flex flex-col min-h-screen bg-[#020405]">
                {children}
              </div>
              <Toaster />
            </QueryProvider>
          </AuthSessionProvider>
        </body>
      </DirectionProvider>
    </html>

  );
}

