"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { submitAnswers, saveProgress, type JoinResponse } from "@/lib/session-api";
import { getSessionInfo } from "@/lib/session-api";
import { getQuizBySlug } from "@/lib/quiz-api";
import { shuffle } from "@/lib/shuffle";

type Dimension = string;

interface QuizState extends JoinResponse {
  scenarioLabel?: string;
}

export default function SessionQuizPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("quiz");
  const [quizData, setQuizData] = useState<QuizState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Dimension>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If user already has a result, redirect to results page
    const existingResult = sessionStorage.getItem(`result_${params.code}`);
    if (existingResult) {
      router.replace(`/s/${params.code}/results`);
      return;
    }

    const participantId = sessionStorage.getItem(`participant_${params.code}`);
    if (!participantId) {
      router.replace(`/s/${params.code}`);
      return;
    }
    const cached = sessionStorage.getItem(`quiz_${params.code}`);
    if (cached) {
      const parsed = JSON.parse(cached) as QuizState;
      const questionsWithShuffledOptions = parsed.questions.map((q) => ({
        ...q,
        options: shuffle(q.options),
      }));
      setQuizData({ ...parsed, questions: questionsWithShuffledOptions });
    } else {
      getSessionInfo(params.code, locale).then((session) => {
        getQuizBySlug(session.quizSlug, locale).then((quiz) => {
          const questionsWithShuffledOptions = quiz.questions.map((q) => ({
            ...q,
            options: shuffle(q.options),
          }));
          setQuizData({
            participantId,
            sessionId: session.id,
            quizSlug: session.quizSlug,
            scenarioLabel: quiz.scenarioLabel,
            questions: questionsWithShuffledOptions,
          });
        });
      }).catch(() => {
        router.replace(`/s/${params.code}`);
      });
    }
  }, [params.code, locale, router]);

  if (!quizData) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  const questions = quizData.questions;
  const question = questions[currentQuestion];
  const selectedAnswer = answers[question?.id];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  function handleSelect(dimension: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: dimension }));
  }

  async function handleNext() {
    if (!selectedAnswer || !quizData) return;

    // Fire-and-forget: persist this answer for progress tracking
    saveProgress(
      params.code,
      quizData.participantId,
      question.id,
      selectedAnswer,
    ).catch(() => {/* non-critical */});

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Submit
      setSubmitting(true);
      setError("");
      try {
        const answerList = Object.entries(answers).map(([qId, dim]) => ({
          questionId: parseInt(qId),
          dimension: dim,
        }));
        const result = await submitAnswers(
          params.code,
          quizData!.participantId,
          answerList,
          locale,
        );
        sessionStorage.setItem(
          `result_${params.code}`,
          JSON.stringify(result),
        );
        router.push(`/s/${params.code}/results`);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("error"));
        setSubmitting(false);
      }
    }
  }

  function handlePrevious() {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {t("questionProgress", { current: currentQuestion + 1, total: questions.length })}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      {error && (
        <p className="mb-4 text-sm text-destructive">{error}</p>
      )}

      <Card>
        <CardHeader>
          <Badge variant="outline" className="w-fit">
            {quizData.scenarioLabel ?? "Q"} {question.id}
          </Badge>
          <CardTitle className="text-lg leading-relaxed">
            {question.situation}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedAnswer ?? ""}
            onValueChange={handleSelect}
          >
            {question.options.map((option, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
              >
                <RadioGroupItem
                  value={option.dimension}
                  id={`option-${index}`}
                  className="mt-0.5"
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="cursor-pointer text-sm leading-relaxed font-normal"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="justify-between">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("previous")}
          </Button>
          <Button
            onClick={handleNext}
            disabled={!selectedAnswer || submitting}
          >
            {submitting
              ? t("submitting")
              : currentQuestion === questions.length - 1
                ? t("viewResult")
                : t("next")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
