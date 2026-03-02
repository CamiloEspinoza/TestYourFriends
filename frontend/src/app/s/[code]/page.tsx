"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { JoinForm } from "@/components/session/join-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getSessionInfo, joinSession, type SessionInfo } from "@/lib/session-api";

export default function SessionJoinPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSessionInfo(params.code)
      .then(setSession)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.code]);

  async function handleJoin(name: string, email?: string) {
    const res = await joinSession(params.code, name, email);
    sessionStorage.setItem(`participant_${params.code}`, res.participantId);
    sessionStorage.setItem(`quizSlug_${params.code}`, res.quizSlug);
    router.push(`/s/${params.code}/quiz`);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (session?.status === "CLOSED") {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center space-y-4">
        <Badge variant="secondary">Sesión cerrada</Badge>
        <p className="text-muted-foreground">
          Esta sesión ya no acepta nuevos participantes.
        </p>
        <a
          href={`/s/${params.code}/group`}
          className="text-primary underline text-sm"
        >
          Ver resultados del grupo
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <JoinForm
        sessionCode={params.code}
        creatorName={session?.creatorName ?? null}
        onJoin={handleJoin}
      />
    </div>
  );
}
