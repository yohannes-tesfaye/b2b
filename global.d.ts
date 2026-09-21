import { routing } from "./i18n/routing";
import type { Messages } from "./i18n/request";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: Messages;
  }
}