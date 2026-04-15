import NavigationMenu from "@/components/admin/navigation-menu";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <div className="flex overflow-hidden h-screen bg-background font-cairo selection:bg-primary selection:text-background">
      {/* side bar */}
      <div className="hidden lg:block basis-[312px] px-8 bg-card border-e border-primary/20 overflow-auto shadow-neon-glow relative animate-in slide-in-from-left duration-500">
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
        <NavigationMenu />
      </div>
      <main className="basis-full w-full py-6 lg:py-8 px-[32px] overflow-auto h-full scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        {children}
      </main>
    </div>
  );
}

export default Layout;
