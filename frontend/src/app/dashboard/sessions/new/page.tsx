"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Monitor, Sparkles } from "lucide-react";

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
import { useAuth } from "@/components/auth/auth-provider";
import { createSession } from "@/lib/session-api";

const quizOptions = [
  {
    slug: "ethics",
    title: "Dilemas Éticos",
    description:
      "10 situaciones éticas que revelarán la filosofía de vida de tu grupo. Comparte el link y compara resultados.",
    icon: Sparkles,
  },
  {
    slug: "virtual",
    title: "¿Realidad o Virtualidad?",
    description:
      "10 escenarios donde la realidad virtual ofrece alternativas tentadoras. ¿Dónde está el punto de inflexión de tu grupo?",
    icon: Monitor,
  },
];

export default function NewSessionPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState<string>("ethics");
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  if (!authLoading && !user) {
    router.push("/login");
    return null;
  }

  async function handleCreate() {
    setCreating(true);
    setError("");
    try {
      const session = await createSession(selectedQuiz);
      setCreatedCode(session.code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear sesión");
    } finally {
      setCreating(false);
    }
  }

  if (createdCode) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al dashboard
        </Link>

        <Card className="mx-auto max-w-lg">
          <CardHeader className="text-center">
            <Badge className="mx-auto mb-2 w-fit" variant="default">
              Sesión creada
            </Badge>
            <CardTitle>Comparte este link con tus amigos</CardTitle>
            <CardDescription>
              Código de sesión: <span className="font-mono font-bold">{createdCode}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ShareLink code={createdCode} />
          </CardContent>
          <CardFooter className="flex-col gap-3 sm:flex-row">
            <Button variant="outline" asChild>
              <Link href={`/s/${createdCode}/group`}>Ver resultados</Link>
            </Button>
            <Button onClick={() => setCreatedCode(null)}>
              Crear otra sesión
            </Button>
          </CardFooter>
        </Card>
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
        Volver al dashboard
      </Link>

      <h1 className="text-2xl font-bold">Crear nueva sesión</h1>

      <p className="text-sm text-muted-foreground">
        Elige el quiz para tu sesión grupal:
      </p>

      <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
        {quizOptions.map((q) => {
          const Icon = q.icon;
          const isSelected = selectedQuiz === q.slug;
          return (
            <Card
              key={q.slug}
              className={`cursor-pointer transition-colors ${isSelected ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"}`}
              onClick={() => setSelectedQuiz(q.slug)}
            >
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-base">{q.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {q.description}
                  </CardDescription>
                  <div className="flex gap-2 pt-1">
                    <Badge variant="secondary">10 preguntas</Badge>
                    <Badge variant="outline">~5 min</Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button onClick={handleCreate} disabled={creating}>
          {creating ? "Creando..." : "Crear sesión grupal"}
        </Button>
      </div>
    </div>
  );
}
