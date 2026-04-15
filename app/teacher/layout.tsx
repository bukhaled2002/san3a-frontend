import NavigationMenu from "@/components/teacher/navigation-menu";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <div className="flex overflow-hidden h-screen bg-background font-sans">
      {/* side bar */}
      <div className="hidden lg:block basis-[280px] min-w-[280px] bg-card/20 border-e border-primary/20 backdrop-blur-xl transition-all duration-300 relative">
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
        <NavigationMenu />
      </div>
      <main className="flex-1 py-8 lg:py-10 px-6 lg:px-12 overflow-auto h-full scrollbar-hide">
        {children}
      </main>
    </div>
  );
}

export default Layout;
