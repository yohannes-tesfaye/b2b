import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";
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

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ethio Trade — B2B Import & Export Marketplace",
    template: "%s | Ethio Trade",
  },
  description:
    "Source verified Ethiopian suppliers, wholesale goods and export-ready materials, or post a wanted request to reach manufacturers and buyers worldwide.",
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
      className={`${inter.variable} ${jakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
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
