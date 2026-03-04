"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import type { GroupParticipant } from "@/lib/session-api";
import { CHART_COLORS } from "./colors";

export function DimensionComparison({
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
        <CardTitle>{t("dimensionComparison")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dimension" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            {participants.map((p, i) => (
              <Bar
                key={p.id}
                dataKey={p.name}
                fill={CHART_COLORS[i % CHART_COLORS.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
