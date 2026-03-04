"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
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
import { CreateSessionCta } from "@/components/session/create-session-cta";
import { useLocale, useTranslations } from "next-intl";

export default function GroupResultsPage() {
  const params = useParams<{ code: string }>();
  const locale = useLocale();
  const t = useTranslations("groupResults");
  const [data, setData] = useState<GroupResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResults = useCallback(() => {
    setLoading(true);
    getGroupResults(params.code, locale)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.code, locale]);

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

  const dimLabels = data.dimensionLabels;
  const dimKeys = Object.keys(dimLabels);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">
            {t("session")} {data.code} {data.creatorName && `• ${t("createdBy")} ${data.creatorName}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={data.status === "OPEN" ? "default" : "secondary"}>
            {data.status === "OPEN" ? t("open") : t("closed")}
          </Badge>
          <Button variant="outline" size="icon" onClick={fetchResults}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        {t("participantsCompleted", { completed: data.completedCount, total: data.totalParticipants })}
      </div>

      {data.completedCount === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{t("noCompletions")}</p>
            <Button className="mt-4" asChild>
              <Link href={`/s/${params.code}`}>{t("seeSessionLink")}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="summary">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">{t("summary")}</TabsTrigger>
            <TabsTrigger value="comparison">{t("comparison")}</TabsTrigger>
            <TabsTrigger value="detail">{t("detail")}</TabsTrigger>
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
                <CardTitle>{t("allParticipants")}</CardTitle>
                <CardDescription>{t("participantDetail")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("participant")}</TableHead>
                      <TableHead>{t("character")}</TableHead>
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
                        {dimKeys.map((dim) => (
                          <TableCell key={dim} className="text-center">
                            {p.scores?.[dim] ?? "—"}
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

      <div className="flex justify-center">
        <Button asChild variant="outline">
          <Link href="/">{t("goToHome")}</Link>
        </Button>
      </div>

      <CreateSessionCta />
    </div>
  );
}
