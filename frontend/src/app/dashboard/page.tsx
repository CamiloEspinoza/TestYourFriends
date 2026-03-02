"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, Monitor, Plus, Sparkles, Users } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { getMySessions, type MySession } from "@/lib/session-api";
import { ShareLink } from "@/components/session/share-link";

export default function DashboardPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<MySession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  useEffect(() => {
    if (user) {
      setLoadingSessions(true);
      getMySessions()
        .then(setSessions)
        .catch(() => {})
        .finally(() => setLoadingSessions(false));
    }
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        {user && (
          <Button asChild>
            <Link href="/dashboard/sessions/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva sesión
            </Link>
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mis sesiones</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total participantes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.reduce((sum, s) => sum + s._count.participants, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quizzes */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">
          Prueba un quiz de ejemplo
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/quiz/ethics" className="block">
            <Card className="h-full transition-colors hover:border-primary/50">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <CardTitle>Dilemas Éticos</CardTitle>
                  <CardDescription>
                    10 situaciones éticas que revelarán tu filosofía de vida.
                    Descubre qué personaje histórico piensa como tú.
                  </CardDescription>
                  <div className="flex gap-2 pt-1">
                    <Badge variant="secondary">10 preguntas</Badge>
                    <Badge variant="outline">~5 min</Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/quiz/virtual" className="block">
            <Card className="h-full transition-colors hover:border-primary/50">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Monitor className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <CardTitle>¿Realidad o Virtualidad?</CardTitle>
                  <CardDescription>
                    10 escenarios donde la realidad virtual ofrece alternativas
                    tentadoras. ¿Dónde está tu punto de inflexión?
                  </CardDescription>
                  <div className="flex gap-2 pt-1">
                    <Badge variant="secondary">10 preguntas</Badge>
                    <Badge variant="outline">~5 min</Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>

      {/* My sessions */}
      {user && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Mis sesiones</h2>
          {loadingSessions ? (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          ) : sessions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No has creado sesiones aún.{" "}
                  <Link
                    href="/dashboard/sessions/new"
                    className="text-primary underline"
                  >
                    Crea tu primera sesión
                  </Link>{" "}
                  para compartir un quiz con tus amigos.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sessions.map((s) => (
                <Card key={s.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        Sesión {s.code}
                      </CardTitle>
                      <Badge
                        variant={
                          s.status === "OPEN" ? "default" : "secondary"
                        }
                      >
                        {s.status === "OPEN" ? "Abierta" : "Cerrada"}
                      </Badge>
                    </div>
                    <CardDescription>
                      {s._count.participants} participante
                      {s._count.participants !== 1 ? "s" : ""} •{" "}
                      {new Date(s.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ShareLink code={s.code} />
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/s/${s.code}/group`}>Ver resultados</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {!user && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              <Link href="/login" className="text-primary underline">
                Inicia sesión
              </Link>{" "}
              para crear sesiones grupales y compartir quizzes con tus amigos.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
