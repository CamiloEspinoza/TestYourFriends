import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { SITE_URL, buildOpenGraph, getCanonical, getAlternateLanguages } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}): Promise<Metadata> {
  const { locale, code } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.groupResults" });
  const title = t("title");
  const description = t("description");
  const url = getCanonical(locale, `/s/${code}/group`);
  return {
    title,
    description,
    openGraph: buildOpenGraph(title, description, url),
    twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}/og-image.png`] },
    alternates: {
      canonical: url,
      languages: getAlternateLanguages(`/s/${code}/group`),
    },
    robots: { index: false, follow: false },
  };
}

export default function GroupLayout({ children }: { children: ReactNode }) {
  return children;
}
