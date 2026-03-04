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

/** Returns the standard OG image object for all pages.
 *  Includes secureUrl (required by WhatsApp) and explicit dimensions. */
export function getOgImage(alt: string) {
  const url = `${SITE_URL}/og-image.png`;
  return [{ url, secureUrl: url, width: 1200, height: 630, alt }];
}

/** Returns a complete openGraph object with all required fields.
 *  Use in every layout to avoid losing type/siteName when overriding. */
export function buildOpenGraph(
  title: string,
  description: string,
  url: string
) {
  return {
    type: "website" as const,
    siteName: SITE_NAME,
    title,
    description,
    url,
    images: getOgImage(title),
  };
}
