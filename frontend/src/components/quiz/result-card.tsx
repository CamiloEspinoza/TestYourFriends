"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CharacterPhoto } from "./character-photo";
import { useTranslations } from "next-intl";

interface ResultCardProps {
  character: {
    name: string;
    description: string;
    philosophy: string;
    photo: string;
  };
  scores: Record<string, number>;
  totalQuestions?: number;
  dimensionLabels?: Record<string, string>;
}

export function ResultCard({
  character,
  scores,
  totalQuestions = 10,
  dimensionLabels = {},
}: ResultCardProps) {
  const t = useTranslations("results");
  const maxScore = Math.max(...Object.values(scores));

  return (
    <Card>
      <CardHeader className="text-center">
        <Badge className="mx-auto mb-2 w-fit" variant="secondary">
          {t("yourResult")}
        </Badge>
        <div className="mx-auto mb-4">
          <CharacterPhoto src={character.photo} name={character.name} size={112} />
        </div>
        <CardTitle className="text-3xl">{character.name}</CardTitle>
        <CardDescription className="text-base">
          {character.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border p-4">
          <p className="text-sm leading-relaxed">{character.philosophy}</p>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-medium">{t("yourProfile")}</p>
          {Object.entries(scores).map(
            ([dim, score]) => (
              <div key={dim} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{dimensionLabels[dim] ?? dim}</span>
                  <span className="text-muted-foreground">
                    {score}/{totalQuestions}
                  </span>
                </div>
                <Progress value={(score / maxScore) * 100} />
              </div>
            ),
          )}
        </div>
      </CardContent>
    </Card>
  );
}
