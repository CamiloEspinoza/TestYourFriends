"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ResultCard } from "@/components/quiz/result-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getQuizBySlug } from "@/lib/quizzes/index";
import type { SubmitResponse } from "@/lib/session-api";

export default function SessionResultsPage() {
  const params = useParams<{ code: string }>();
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [dimensionLabels, setDimensionLabels] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = sessionStorage.getItem(`result_${params.code}`);
    if (stored) {
      setResult(JSON.parse(stored));
    }
    const quizSlug = sessionStorage.getItem(`quizSlug_${params.code}`) ?? "ethics";
    const quiz = getQuizBySlug(quizSlug);
    setDimensionLabels(quiz.dimensionLabels);
  }, [params.code]);

  if (!result) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 space-y-6">
      <ResultCard
        character={result.character}
        scores={result.scores}
        dimensionLabels={dimensionLabels}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href={`/s/${params.code}/group`}>
            Ver resultados del grupo
          </Link>
        </Button>
      </div>
    </div>
  );
}
