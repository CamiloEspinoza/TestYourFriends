"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Loader2, Users, Clock, CheckCircle2, Play } from "lucide-react";
import * as LucideIcons from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShareLink } from "@/components/session/share-link";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/auth/auth-provider";
import { createSession } from "@/lib/session-api";
import { getQuizCategories, getQuizBySlug, type QuizCategory } from "@/lib/quiz-api";

interface CreatedQuizInfo {
  title: string;
  description: string;
  slug: string;
  categoryLabel?: string;
  categoryIcon?: string;
}

function CategoryIcon({ name }: { name: string }) {
  const Icon = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (!Icon) return <LucideIcons.HelpCircle className="h-5 w-5 text-primary" />;
  return <Icon className="h-5 w-5 text-primary" />;
}

export default function NewSessionPage() {
  const t = useTranslations("newSession");
  const tBadge = useTranslations("dashboard.quizBadge");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const quizFromUrl = searchParams.get("quiz");
  const [selectedQuiz, setSelectedQuiz] = useState<string>(quizFromUrl ?? "ethics");
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [createdQuiz, setCreatedQuiz] = useState<CreatedQuizInfo | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  // Load catalog only when no quiz is pre-selected (picker mode)
  useEffect(() => {
    if (!quizFromUrl) {
      getQuizCategories(locale)
        .then(setCategories)
        .finally(() => setLoadingCats(false));
    } else {
      setLoadingCats(false);
    }
  }, [quizFromUrl, locale]);

  // Auto-create when a quiz comes from the URL and auth is ready
  useEffect(() => {
    if (quizFromUrl && !authLoading && user && !createdCode && !creating) {
      handleCreate(quizFromUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizFromUrl, authLoading, user]);

  if (!authLoading && !user) {
    router.push("/login");
    return null;
  }

  async function handleCreate(quizSlug = selectedQuiz) {
    setCreating(true);
    setError("");
    try {
      const [session, quizFull] = await Promise.all([
        createSession(quizSlug),
        getQuizBySlug(quizSlug, locale),
      ]);
      setCreatedCode(session.code);
      setCreatedQuiz({
        title: quizFull.title,
        description: quizFull.description,
        slug: quizFull.slug,
        categoryLabel: quizFull.category?.label,
        categoryIcon: quizFull.category?.icon,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error"));
    } finally {
      setCreating(false);
    }
  }

  if (createdCode) {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Link>

        {/* Success header */}
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-7 w-7 shrink-0 text-green-500" />
          <div>
            <h1 className="text-xl font-bold leading-tight">{t("sessionCreated")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("code")} <span className="font-mono font-semibold tracking-wider">{createdCode}</span>
            </p>
          </div>
        </div>

        {/* Quiz info */}
        {createdQuiz && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  {createdQuiz.categoryLabel && (
                    <div className="flex items-center gap-1.5 mb-1">
                      {createdQuiz.categoryIcon && (
                        <CategoryIcon name={createdQuiz.categoryIcon} />
                      )}
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {createdQuiz.categoryLabel}
                      </span>
                    </div>
                  )}
                  <CardTitle className="text-lg leading-snug">{createdQuiz.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {createdQuiz.description}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Clock className="h-3 w-3" /> {tBadge("duration")}
                </Badge>
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Users className="h-3 w-3" /> {t("group")}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Share */}
        <div className="space-y-2">
          <p className="text-sm font-medium">{t("shareTitle")}</p>
          <ShareLink code={createdCode} />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="flex-1 gap-2">
            <Link href={`/s/${createdCode}`}>
              <Play className="h-4 w-4" />
              {t("answerFirst")}
            </Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link href={`/s/${createdCode}/group`}>{t("seeGroupResults")}</Link>
          </Button>
        </div>
        <Button
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={() => { setCreatedCode(null); setCreatedQuiz(null); }}
        >
          {t("createAnother")}
        </Button>
      </div>
    );
  }

  // Auto-create mode: show a spinner while creating
  if (quizFromUrl && (creating || (!createdCode && !error))) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{t("creatingSession")}</p>
      </div>
    );
  }

  // Auto-create mode: error state
  if (quizFromUrl && error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <p className="text-sm text-destructive">{error}</p>
        <Button onClick={() => handleCreate(quizFromUrl)}>{t("retry")}</Button>
        <Link href="/dashboard" className="text-sm text-muted-foreground underline">
          {t("back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back")}
      </Link>

      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="text-sm text-muted-foreground">
        {t("chooseQuiz")}
      </p>

      {loadingCats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-8 max-w-4xl">
          {categories.map((cat) => (
            <div key={cat.slug}>
              <div className="flex items-center gap-2 mb-3">
                <CategoryIcon name={cat.icon} />
                <h2 className="text-base font-semibold">{cat.label}</h2>
                <Badge variant="outline" className="text-xs">{cat.quizzes.length}</Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cat.quizzes.map((q) => {
                  const isSelected = selectedQuiz === q.slug;
                  return (
                    <Card
                      key={q.slug}
                      className={`cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/20"
                          : "hover:border-primary/40"
                      }`}
                      onClick={() => setSelectedQuiz(q.slug)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium leading-tight">
                          {q.title}
                        </CardTitle>
                        <CardDescription className="text-xs line-clamp-2">
                          {q.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-xs">{tBadge("questions")}</Badge>
                          <Badge variant="outline" className="text-xs">{tBadge("duration")}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button onClick={handleCreate} disabled={creating || loadingCats}>
          {creating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("creating")}
            </>
          ) : (
            t("create")
          )}
        </Button>
      </div>
    </div>
  );
}
