"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ResultCard } from "@/components/quiz/result-card";
import { CreateSessionCta } from "@/components/session/create-session-cta";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import type { SubmitResponse } from "@/lib/session-api";

export default function SessionResultsPage() {
  const params = useParams<{ code: string }>();
  const t = useTranslations("results");
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [dimensionLabels, setDimensionLabels] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = sessionStorage.getItem(`result_${params.code}`);
    if (stored) {
      const parsed: SubmitResponse = JSON.parse(stored);
      setResult(parsed);
      // dimensionLabels is now included in the SubmitResponse from the backend
      if (parsed.dimensionLabels) {
        setDimensionLabels(parsed.dimensionLabels);
      }
    }
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
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
        <Button asChild>
          <Link href={`/s/${params.code}/group`}>
            {t("viewGroupResults")}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">{t("goToDashboard")}</Link>
        </Button>
      </div>

      <CreateSessionCta />
    </div>
  );
}
