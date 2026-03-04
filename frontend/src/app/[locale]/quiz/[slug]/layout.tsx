import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getCanonical, getAlternateLanguages } from "@/lib/seo";
import { getQuizBySlug } from "@/lib/quiz-api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const quiz = await getQuizBySlug(slug);
    return {
      title: quiz.title,
      description: quiz.description,
      alternates: {
        canonical: getCanonical(locale, `/quiz/${slug}`),
        languages: getAlternateLanguages(`/quiz/${slug}`),
      },
    };
  } catch {
    return {
      title: "Quiz",
      alternates: {
        canonical: getCanonical(locale, `/quiz/${slug}`),
        languages: getAlternateLanguages(`/quiz/${slug}`),
      },
    };
  }
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
