import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SITE_URL, getAlternateLanguages, getCanonical } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.login" });
  const title = t("title");
  const description = t("description");
  const url = getCanonical(locale, "/login");
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
      languages: getAlternateLanguages("/login"),
    },
    robots: { index: true, follow: true },
  };
}

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("common");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <Link href="/" className="mb-8 text-2xl font-bold tracking-tight">
        {t("appName")}
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
