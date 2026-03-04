import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/layout/footer";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { getAlternateLanguages, getCanonical } from "@/lib/seo";
import {
  Sparkles,
  ArrowRight,
  Search,
  MousePointerClick,
  Send,
  Trophy,
} from "lucide-react";
import { getQuizCategories } from "@/lib/quiz-api";
import { QuizCatalog } from "@/components/quiz/quiz-catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: getCanonical(locale),
      languages: getAlternateLanguages(""),
    },
  };
}

const HOW_IT_WORKS_STEPS = [
  { num: "01", icon: Search, key: "1" },
  { num: "02", icon: MousePointerClick, key: "2" },
  { num: "03", icon: Send, key: "3" },
  { num: "04", icon: Trophy, key: "4" },
] as const;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");

  let categories: QuizCategory[] = [];
  try {
    categories = await getQuizCategories(locale);
  } catch {
    // API not available during build; render without categories
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            {tCommon("appName")}
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {tCommon("dashboard")}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto flex flex-col items-center gap-6 px-4 py-24 text-center md:py-32">
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            {t("hero.badge")}
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a
              href="#quizzes"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              {t("hero.tryQuiz")}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#como-funciona"
              className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {t("hero.howItWorks")}
            </a>
          </div>
        </section>

        {/* How it works */}
        <section
          id="como-funciona"
          className="scroll-mt-20 bg-muted/40 py-20 md:py-28"
        >
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
                {t("howItWorks.eyebrow")}
              </p>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                {t("howItWorks.title")}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t("howItWorks.subtitle")}
              </p>
            </div>

            {/* Steps */}
            <div className="relative mx-auto max-w-5xl">
              {/* Connecting line — desktop only */}
              <div
                aria-hidden
                className="absolute left-0 right-0 top-10 hidden h-px bg-border lg:block"
                style={{ left: "12.5%", right: "12.5%" }}
              />

              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {HOW_IT_WORKS_STEPS.map(({ num, icon: Icon, key }) => (
                  <div key={key} className="relative flex flex-col items-center text-center">
                    {/* Number + icon bubble */}
                    <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/20 bg-background shadow-sm">
                      <Icon className="h-8 w-8 text-primary" />
                      <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {num}
                      </span>
                    </div>
                    <h3 className="mb-2 font-semibold tracking-tight">
                      {t(`howItWorks.steps.${key}.label`)}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {t(`howItWorks.steps.${key}.description`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-14 flex flex-col items-center gap-3">
              <Link
                href="/dashboard/sessions/new"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                {t("howItWorks.cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="text-xs text-muted-foreground">{t("howItWorks.note")}</p>
            </div>
          </div>
        </section>

        {/* Quiz catalog grouped by category */}
        <section
          id="quizzes"
          className="container mx-auto scroll-mt-20 px-4 py-16 md:py-24"
        >
          <h2 className="mb-4 text-center text-2xl font-bold tracking-tight sm:text-3xl">
            {t("quizzes.title")}
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            {t("quizzes.subtitle")}
          </p>

          <QuizCatalog
            categories={categories}
            createSessionLabel={t("quizzes.createSession")}
            tryQuizLabel={t("quizzes.tryQuiz")}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
