"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { JoinForm } from "@/components/session/join-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { getSessionInfo, joinSession, type SessionInfo } from "@/lib/session-api";
import { useAuth } from "@/components/auth/auth-provider";
import { useLocale } from "next-intl";

export default function SessionJoinPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const locale = useLocale();
  const { user, loading: authLoading } = useAuth();
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSessionInfo(params.code, locale)
      .then(setSession)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.code, locale]);

  // Auto-join when the logged-in user is the session creator
  useEffect(() => {
    if (authLoading || !session || !user) return;
    if (session.creatorId === user.id && session.status === "OPEN") {
      joinSession(params.code, user.name ?? user.email, user.email, locale)
        .then((res) => {
          sessionStorage.setItem(`participant_${params.code}`, res.participantId);
          sessionStorage.setItem(`quizSlug_${params.code}`, res.quizSlug);
          router.push(`/s/${params.code}/quiz`);
        })
        .catch((err) => setError(err.message));
    }
  }, [authLoading, session, user, params.code, router, locale]);

  async function handleJoin(name: string, email?: string) {
    const res = await joinSession(params.code, name, email, locale);
    sessionStorage.setItem(`participant_${params.code}`, res.participantId);
    sessionStorage.setItem(`quizSlug_${params.code}`, res.quizSlug);
    router.push(`/s/${params.code}/quiz`);
  }

  const containerClass =
    "flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 sm:min-h-[80vh]";
  const innerClass = "w-full max-w-md space-y-6 text-center";

  if (loading || authLoading) {
    return (
      <div className={containerClass}>
        <div className={innerClass}>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  // Creator auto-joining — show spinner while redirecting
  const isCreator = user && session && session.creatorId === user.id;
  if (isCreator && session.status === "OPEN") {
    return (
      <div className={containerClass}>
        <div className={`${innerClass} flex flex-col items-center gap-3`}>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Entrando al quiz…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={containerClass}>
        <div className={innerClass}>
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  if (session?.status === "CLOSED") {
    return (
      <div className={containerClass}>
        <div className={innerClass}>
          <Badge variant="secondary">Sesión cerrada</Badge>
          <p className="text-muted-foreground">
            Esta sesión ya no acepta nuevos participantes.
          </p>
          <a
            href={`/s/${params.code}/group`}
            className="inline-block text-primary underline text-sm hover:no-underline"
          >
            Ver resultados del grupo
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="w-full max-w-md">
        <JoinForm
          sessionCode={params.code}
          creatorName={session?.creatorName ?? null}
          onJoin={handleJoin}
        />
      </div>
    </div>
  );
}
