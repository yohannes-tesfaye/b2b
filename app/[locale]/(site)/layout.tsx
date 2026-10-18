import Header from "@/components/shared/Header";
import TopHeader from "@/components/shared/TopHeader";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <TopHeader />
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </>
  );
}
