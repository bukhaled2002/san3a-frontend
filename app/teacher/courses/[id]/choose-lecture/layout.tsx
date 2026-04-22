type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <div className="w-1.5 h-8 bg-primary rounded-full shadow-neon-glow" />
          إضافة امتحان جديد
        </h1>
        <p className="text-tech-grey text-lg font-medium">
          من فضلك قم بمليء جميع تفاصيل الامتحان لضمان دقة المحتوى التعليمي
        </p>
      </div>
      <main className="mt-8">{children}</main>
    </div>
  );
}

export default Layout;
