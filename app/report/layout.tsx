export default function ReportLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <main className="container mx-auto">
      {children}
    </main>
  );
}
