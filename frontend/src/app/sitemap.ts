import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://testyourfriends.com";

const publicPaths = ["", "/quiz/ethics", "/quiz/virtual"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of publicPaths) {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      languages[locale] = `${SITE_URL}/${locale}${path}`;
    }

    entries.push({
      url: `${SITE_URL}/${routing.defaultLocale}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1.0 : 0.8,
      alternates: { languages },
    });
  }

  return entries;
}
