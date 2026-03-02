"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
import { joinSession, submitAnswers, type JoinResponse } from "@/lib/session-api";

type Dimension = string;

export default function SessionQuizPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const [quizData, setQuizData] = useState<JoinResponse | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Dimension>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if we have quiz data in sessionStorage (came from join page)
    const participantId = sessionStorage.getItem(`participant_${params.code}`);
    if (!participantId) {
      // No participant ID, redirect to join
      router.replace(`/s/${params.code}`);
      return;
    }
    // We need the questions - fetch via a quick join or use cached data
    const cached = sessionStorage.getItem(`quiz_${params.code}`);
    if (cached) {
      setQuizData(JSON.parse(cached));
    } else {
      // Fetch session info to get questions
      import("@/lib/session-api").then(({ getSessionInfo }) => {
        getSessionInfo(params.code).then((session) => {
          // We already have participantId, just need questions
          import("@/lib/quizzes/index").then(({ getQuizBySlug }) => {
            const quiz = getQuizBySlug(session.quizSlug);
            setQuizData({
              participantId,
              sessionId: session.id,
              quizSlug: session.quizSlug,
              questions: quiz.questions.map((q) => ({
                id: q.id,
                situation: q.situation,
                options: q.options.map((o) => ({
                  text: o.text,
                  dimension: o.dimension,
                })),
              })),
            });
          });
        });
      });
    }
  }, [params.code, router]);

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
        );
        sessionStorage.setItem(
          `result_${params.code}`,
          JSON.stringify(result),
        );
        router.push(`/s/${params.code}/results`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al enviar respuestas");
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
            Pregunta {currentQuestion + 1} de {questions.length}
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
            Dilema {question.id}
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
            Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={!selectedAnswer || submitting}
          >
            {submitting
              ? "Enviando..."
              : currentQuestion === questions.length - 1
                ? "Ver resultado"
                : "Siguiente"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
