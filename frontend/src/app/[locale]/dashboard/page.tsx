"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ClipboardList,
  Users,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/components/auth/auth-provider";
import { getMySessions, createSession, type MySession, type SessionParticipant } from "@/lib/session-api";
import { getQuizCategories, type QuizCategory } from "@/lib/quiz-api";
import { ShareLink } from "@/components/session/share-link";
import { QuizCatalog, QuizCatalogSkeleton } from "@/components/quiz/quiz-catalog";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [sessions, setSessions] = useState<MySession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    getQuizCategories(locale)
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoadingCategories(false));
  }, [locale]);

  const refreshSessions = useCallback(() => {
    if (!user) return;
    setLoadingSessions(true);
    getMySessions(locale)
      .then(setSessions)
      .catch(() => {})
      .finally(() => setLoadingSessions(false));
  }, [user, locale]);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  async function handleCreateSession(quizSlug: string) {
    if (!user) {
      router.push(`/login?redirect=/dashboard`);
      return;
    }
    const session = await createSession(quizSlug);
    // Refresh sessions list so the new session appears at the top
    await getMySessions(locale).then(setSessions).catch(() => {});
    // Scroll to the top to show the newly created session
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("mySessions")}</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("totalParticipants")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.reduce((sum, s) => sum + s._count.participants, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My sessions — moved above quiz catalog */}
      {user && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">{t("mySessions")}</h2>
          {loadingSessions ? (
            <p className="text-sm text-muted-foreground">{tCommon("loading")}</p>
          ) : sessions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  {t("noSessions")}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sessions.map((s) => {
                const completedCount = s.participants.filter((p) => p.completed).length;
                const completionPct =
                  s._count.participants > 0
                    ? Math.round((completedCount / s._count.participants) * 100)
                    : 0;
                return (
                  <Card key={s.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-base leading-snug">
                            {s.quizTitle}
                          </CardTitle>
                          <CardDescription className="mt-0.5">
                            {t("sessionCode")} <span className="font-mono font-medium">{s.code}</span>{" "}
                            · {new Date(s.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant={s.status === "OPEN" ? "default" : "secondary"} className="shrink-0">
                          {s.status === "OPEN" ? t("open") : t("closed")}
                        </Badge>
                      </div>

                      {/* Completion summary */}
                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {completedCount}/{s._count.participants} {t("completed")}
                          </span>
                          <span>{completionPct}%</span>
                        </div>
                        <Progress value={completionPct} className="h-1.5" />
                      </div>
                    </CardHeader>

                    {/* Participant list */}
                    {s.participants.length > 0 && (
                      <CardContent className="pt-0 pb-3">
                        <div className="rounded-md border divide-y">
                          {s.participants.map((p: SessionParticipant) => {
                            return (
                              <div
                                key={p.id}
                                className="flex items-center justify-between gap-3 px-3 py-2"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  {p.completed ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
                                  ) : p.answeredCount > 0 ? (
                                    <Clock className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                                  ) : (
                                    <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-muted-foreground/30" />
                                  )}
                                  <span className="text-xs font-medium truncate">{p.name}</span>
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0">
                                  {p.completed
                                    ? t("done")
                                    : `${p.answeredCount}/${s.totalQuestions}`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    )}

                    <CardContent className="space-y-3 pt-0">
                      <ShareLink code={s.code} />
                      <div className="flex gap-2">
                        {s.status === "OPEN" && (
                          <Button size="sm" asChild>
                            <Link href={`/s/${s.code}`}>{t("answer")}</Link>
                          </Button>
                        )}
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/s/${s.code}/group`}>{t("seeResults")}</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Quiz catalog by category */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">{t("chooseQuiz")}</h2>
        {loadingCategories ? (
          <QuizCatalogSkeleton />
        ) : (
          <QuizCatalog
            categories={categories}
            createSessionLabel={t("createSession")}
            tryQuizLabel={t("tryQuiz")}
            tryQuizHref={(slug) => `/quiz/${slug}?from=dashboard`}
            onCreateSession={handleCreateSession}
          />
        )}
      </div>
    </div>
  );
}
