"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, TrendingUp } from "lucide-react";
import type { GroupParticipant } from "@/lib/session-api";

const defaultDimensionLabels: Record<string, string> = {
  P: "Pragmatismo",
  I: "Idealismo",
  E: "Empatía",
  R: "Rebeldía",
};

export function GroupSummaryStats({
  participants,
  dimensionLabels = defaultDimensionLabels,
}: {
  participants: GroupParticipant[];
  dimensionLabels?: Record<string, string>;
}) {
  const total = participants.length;

  // Most common character
  const charCounts: Record<string, number> = {};
  participants.forEach((p) => {
    if (p.characterName) {
      charCounts[p.characterName] = (charCounts[p.characterName] || 0) + 1;
    }
  });
  const topCharacter = Object.entries(charCounts).sort(
    (a, b) => b[1] - a[1],
  )[0];

  // Dominant dimension across group
  const dims = Object.keys(dimensionLabels);
  const scoreColumns = ["scoreP", "scoreI", "scoreE", "scoreR"] as const;
  const dimTotals: Record<string, number> = {};
  dims.forEach((dim, i) => {
    dimTotals[dim] = 0;
    participants.forEach((p) => {
      dimTotals[dim] += (p[scoreColumns[i]] as number) ?? 0;
    });
  });
  const topDimension = (Object.entries(dimTotals) as [string, number][]).sort(
    (a, b) => b[1] - a[1],
  )[0];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Completados</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground">participantes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Personaje popular
          </CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold truncate">
            {topCharacter ? topCharacter[0] : "—"}
          </div>
          <p className="text-xs text-muted-foreground">
            {topCharacter ? `${topCharacter[1]} persona${topCharacter[1] !== 1 ? "s" : ""}` : ""}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Dimensión dominante
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">
            {topDimension ? dimensionLabels[topDimension[0]] : "—"}
          </div>
          <p className="text-xs text-muted-foreground">
            {topDimension ? `${topDimension[1]} puntos totales` : ""}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
