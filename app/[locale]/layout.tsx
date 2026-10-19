import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { locale } from "next/root-params";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ThemeWrapper } from "@/components/shared/ThemeWrapper";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "B2b",
  description: "B2b",
};

export function generateStaticParams() {
  return routing.locales.map((l) => ({ locale: l }));
}

export default async function LocaleLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const lang = await locale();
  const messages = await getMessages();

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeWrapper>
          <NextIntlClientProvider messages={messages}>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster richColors closeButton position="top-center" />
          </NextIntlClientProvider>
        </ThemeWrapper>
      </body>
    </html>
  );
}
