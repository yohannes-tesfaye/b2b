import TopHeader from "@/components/shared/TopHeader";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export default function UserFacingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <TopHeader />
      <Header />
      {children}
      <Footer />
    </>
  );
}
