import { ThemeWrapper } from "@/components/shared/ThemeWrapper";
import TopHeader from "@/components/shared/TopHeader";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export default async function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const messages = await getMessages();
  return (
    <>
      <TopHeader variant="auth" />
      <ThemeWrapper>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </ThemeWrapper>
    </>
  );
}
