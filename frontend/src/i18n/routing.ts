import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en", "fr", "it", "pt", "de"],
  defaultLocale: "es",
  localePrefix: "always",
});
