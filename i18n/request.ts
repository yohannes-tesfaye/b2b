import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import commonEn from "../messages/en/common.json";
import headerEn from "../messages/en/header.json";
import heroEn from "../messages/en/hero.json";
import authEn from "../messages/en/auth.json";
import productEn from "../messages/en/product.json";
import footerEn from "../messages/en/footer.json";
import homeEn from "../messages/en/home.json";
import listingEn from "../messages/en/listing.json";
import commonAm from "../messages/am/common.json";
import headerAm from "../messages/am/header.json";
import heroAm from "../messages/am/hero.json";
import authAm from "../messages/am/auth.json";
import productAm from "../messages/am/product.json";
import footerAm from "../messages/am/footer.json";
import homeAm from "../messages/am/home.json";
import listingAm from "../messages/am/listing.json";
import { routing } from "./routing";

const messageFiles = {
  en: { ...commonEn, ...headerEn, ...heroEn, ...authEn, ...productEn, ...footerEn, ...homeEn, ...listingEn },
  am: { ...commonAm, ...headerAm, ...heroAm, ...authAm, ...productAm, ...footerAm, ...homeAm, ...listingAm },
} as const;

export type Messages = (typeof messageFiles)["en"];

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const paramValue = await rootParams.locale();
    if (hasLocale(routing.locales, paramValue)) {
      locale = paramValue;
    } else {
      notFound();
    }
  }

  return {
    locale,
    messages: messageFiles[locale as keyof typeof messageFiles],
  };
});