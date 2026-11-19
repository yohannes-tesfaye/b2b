import TopHeader from "@/components/shared/TopHeader";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export default function UserFacingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="hidden md:block">
        <TopHeader />
      </div>
      <Header />
      {children}
      <Footer />
    </>
  );
}
