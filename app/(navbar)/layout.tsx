import Footer from "@/components/footer";
import Header from "@/components/header/index";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="md:pt-[100px] sm:pt-[90px] pt-[85px]">{children}</main>
      <Footer />
    </>
  );
}
