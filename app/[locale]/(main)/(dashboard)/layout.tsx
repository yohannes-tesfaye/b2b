export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex-1 p-6 md:p-8">{children}</main>;
}
