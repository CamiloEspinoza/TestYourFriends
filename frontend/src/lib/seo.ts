import { routing } from "@/i18n/routing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://testyourfriends.com";

export const SITE_NAME = "TestYourFriends";

export function getAlternateLanguages(pathname: string) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `${SITE_URL}/${locale}${pathname}`;
  }
  return languages;
}

export function getCanonical(locale: string, pathname: string = "") {
  return `${SITE_URL}/${locale}${pathname}`;
}
