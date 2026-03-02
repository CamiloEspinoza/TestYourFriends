"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { RefreshCw, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParticipantList } from "@/components/session/participant-list";
import { CharacterPhoto } from "@/components/quiz/character-photo";
import { DimensionRadar } from "@/components/charts/dimension-radar";
import { CharacterDistribution } from "@/components/charts/character-distribution";
import { DimensionComparison } from "@/components/charts/dimension-comparison";
import { GroupSummaryStats } from "@/components/charts/group-summary-stats";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getGroupResults, type GroupResults } from "@/lib/session-api";
import { getQuizBySlug } from "@/lib/quizzes/index";

export default function GroupResultsPage() {
  const params = useParams<{ code: string }>();
  const [data, setData] = useState<GroupResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResults = useCallback(() => {
    setLoading(true);
    getGroupResults(params.code)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.code]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  if (loading && !data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const quiz = getQuizBySlug(data.quizSlug);
  const dimLabels = quiz.dimensionLabels;
  const dimKeys = Object.keys(dimLabels);
  const scoreColumns = ["scoreP", "scoreI", "scoreE", "scoreR"] as const;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Resultados del grupo</h1>
          <p className="text-muted-foreground">
            Sesión: {data.code} {data.creatorName && `• Creada por ${data.creatorName}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={data.status === "OPEN" ? "default" : "secondary"}>
            {data.status === "OPEN" ? "Abierta" : "Cerrada"}
          </Badge>
          <Button variant="outline" size="icon" onClick={fetchResults}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        {data.completedCount} de {data.totalParticipants} participantes han completado
      </div>

      {data.completedCount === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Aún nadie ha completado el quiz. Comparte el link para que tus
              amigos participen.
            </p>
            <Button className="mt-4" asChild>
              <Link href={`/s/${params.code}`}>Ver link de la sesión</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="summary">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Resumen</TabsTrigger>
            <TabsTrigger value="comparison">Comparación</TabsTrigger>
            <TabsTrigger value="detail">Detalle</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <GroupSummaryStats participants={data.participants} dimensionLabels={dimLabels} />
            <CharacterDistribution participants={data.participants} />
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <DimensionRadar participants={data.participants} dimensionLabels={dimLabels} />
            <DimensionComparison participants={data.participants} dimensionLabels={dimLabels} />
          </TabsContent>

          <TabsContent value="detail">
            <Card>
              <CardHeader>
                <CardTitle>Todos los participantes</CardTitle>
                <CardDescription>
                  Detalle individual de cada participante
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participante</TableHead>
                      <TableHead>Personaje</TableHead>
                      {dimKeys.map((dim) => (
                        <TableHead key={dim} className="text-center">{dim}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.participants.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {p.character && (
                              <CharacterPhoto
                                src={p.character.photo}
                                name={p.character.name}
                                size={32}
                              />
                            )}
                            <span className="text-sm">
                              {p.characterName || "—"}
                            </span>
                          </div>
                        </TableCell>
                        {scoreColumns.map((col, i) => (
                          <TableCell key={dimKeys[i]} className="text-center">
                            {p[col] ?? "—"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
