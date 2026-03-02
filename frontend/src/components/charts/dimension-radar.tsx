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
import type { GroupParticipant } from "@/lib/session-api";

const COLORS = [
  "hsl(221, 83%, 53%)",
  "hsl(142, 71%, 45%)",
  "hsl(0, 84%, 60%)",
  "hsl(45, 93%, 47%)",
  "hsl(271, 91%, 65%)",
  "hsl(199, 89%, 48%)",
  "hsl(25, 95%, 53%)",
  "hsl(330, 81%, 60%)",
];

const defaultDimensionLabels: Record<string, string> = {
  P: "Pragmatismo",
  I: "Idealismo",
  E: "Empatía",
  R: "Rebeldía",
};

export function DimensionRadar({
  participants,
  dimensionLabels = defaultDimensionLabels,
}: {
  participants: GroupParticipant[];
  dimensionLabels?: Record<string, string>;
}) {
  const dims = Object.keys(dimensionLabels);
  const scoreColumns = ["scoreP", "scoreI", "scoreE", "scoreR"] as const;
  const data = dims.map((dim, i) => {
    const entry: Record<string, string | number> = {
      dimension: dimensionLabels[dim],
    };
    participants.forEach((p) => {
      entry[p.name] = (p[scoreColumns[i]] as number) ?? 0;
    });
    return entry;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Radar de dimensiones</CardTitle>
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
                stroke={COLORS[i % COLORS.length]}
                fill={COLORS[i % COLORS.length]}
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
