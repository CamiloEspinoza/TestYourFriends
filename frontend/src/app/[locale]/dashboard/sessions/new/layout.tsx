import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { SITE_URL, getCanonical, getAlternateLanguages } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.newSession" });
  const title = t("title");
  const description = t("description");
  const url = getCanonical(locale, "/dashboard/sessions/new");
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}/og-image.png`] },
    alternates: {
      canonical: url,
      languages: getAlternateLanguages("/dashboard/sessions/new"),
    },
    robots: { index: false, follow: false },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
