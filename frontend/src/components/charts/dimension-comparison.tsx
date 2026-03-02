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

export function DimensionComparison({
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
        <CardTitle>Comparación por dimensión</CardTitle>
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
                fill={COLORS[i % COLORS.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
