import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/layout/navbar";
import { SITE_URL, buildOpenGraph, getAlternateLanguages, getCanonical } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.dashboard" });
  const title = t("title");
  const description = t("description");
  const url = getCanonical(locale, "/dashboard");
  return {
    title,
    description,
    openGraph: buildOpenGraph(title, description, url),
    twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}/og-image.png`] },
    alternates: {
      canonical: url,
      languages: getAlternateLanguages("/dashboard"),
    },
    robots: { index: false, follow: false },
  };
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
