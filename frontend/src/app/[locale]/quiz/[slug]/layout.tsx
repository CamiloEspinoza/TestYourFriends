import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_URL, getCanonical, getAlternateLanguages } from "@/lib/seo";
import { getQuizBySlug } from "@/lib/quiz-api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const url = getCanonical(locale, `/quiz/${slug}`);
  const alternates = {
    canonical: url,
    languages: getAlternateLanguages(`/quiz/${slug}`),
  };

  try {
    const quiz = await getQuizBySlug(slug, locale);
    const title = quiz.title;
    const description = quiz.description;
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
      alternates,
    };
  } catch {
    return {
      title: "Quiz",
      alternates,
    };
  }
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
