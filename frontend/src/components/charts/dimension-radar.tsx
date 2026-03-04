"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import type { GroupParticipant } from "@/lib/session-api";
import { CHART_COLORS } from "./colors";

export function DimensionRadar({
  participants,
  dimensionLabels,
}: {
  participants: GroupParticipant[];
  dimensionLabels: Record<string, string>;
}) {
  const t = useTranslations("groupResults.charts");
  const dims = Object.keys(dimensionLabels);
  const data = dims.map((dim) => {
    const entry: Record<string, string | number> = {
      dimension: dimensionLabels[dim],
    };
    participants.forEach((p) => {
      entry[p.name] = p.scores?.[dim] ?? 0;
    });
    return entry;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dimensionRadar")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="dimension" />
            <PolarRadiusAxis domain={[0, 10]} />
            {participants.map((p, i) => (
              <Radar
                key={p.id}
                name={p.name}
                dataKey={p.name}
                stroke={CHART_COLORS[i % CHART_COLORS.length]}
                fill={CHART_COLORS[i % CHART_COLORS.length]}
                fillOpacity={0.15}
              />
            ))}
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
