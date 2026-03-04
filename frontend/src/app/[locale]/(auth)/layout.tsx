import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAlternateLanguages, getCanonical } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.login" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: getCanonical(locale, "/login"),
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
