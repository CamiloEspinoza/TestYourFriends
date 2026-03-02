"use client";

import {
  PieChart,
  Pie,
  Cell,
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

export function CharacterDistribution({
  participants,
}: {
  participants: GroupParticipant[];
}) {
  const counts: Record<string, number> = {};
  participants.forEach((p) => {
    const name = p.characterName || "Sin resultado";
    counts[name] = (counts[name] || 0) + 1;
  });

  const data = Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de personajes</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, value }) => `${name} (${value})`}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
