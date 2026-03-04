"use client";

import { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import { getQuizBySlug, calculateResult, type QuizFull, type QuizCharacter } from "@/lib/quiz-api";
import { shuffle } from "@/lib/shuffle";

type Phase = "intro" | "questions" | "result";

interface QuizResult {
  character: QuizCharacter;
  scores: Record<string, number>;
}

export default function QuizPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = use(params);
  const searchParams = useSearchParams();
  const backHref = searchParams.get("from") === "dashboard" ? "/dashboard" : "/";
  const backLabel = searchParams.get("from") === "dashboard" ? "Volver al dashboard" : "Volver al inicio";

  const [quiz, setQuiz] = useState<QuizFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    getQuizBySlug(slug, locale)
      .then((data) => {
        const questionsWithShuffledOptions = data.questions.map((q) => ({
          ...q,
          options: shuffle(q.options),
        }));
        setQuiz({ ...data, questions: questionsWithShuffledOptions });
      })
      .catch(() => setError("No se pudo cargar el quiz."))
      .finally(() => setLoading(false));
  }, [slug, locale]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-muted-foreground">{error ?? "Quiz no encontrado."}</p>
        <Button asChild className="mt-4" variant="outline">
          <Link href={backHref}>{backLabel}</Link>
        </Button>
      </div>
    );
  }

  const questions = quiz.questions;
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];
  const selectedAnswer = answers[question?.id];

  function handleSelect(dimension: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: dimension }));
  }

  function handleNext() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const quizResult = calculateResult(quiz!, answers);
      setResult(quizResult);
      setPhase("result");
    }
  }

  function handlePrevious() {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }

  function handleRestart() {
    setPhase("intro");
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  }

  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Link
          href={backHref}
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>

        <Card className="mt-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">{quiz.title}</CardTitle>
            <CardDescription className="text-base">{quiz.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4 space-y-2">
              <p className="text-sm font-medium">Lo que descubrirás:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>– Tu perfil basado en {Object.keys(quiz.dimensionLabels).length} dimensiones</li>
                <li>– Qué personaje histórico comparte tu forma de ser</li>
                <li>– Cómo reaccionas frente a situaciones reales</li>
              </ul>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(quiz.dimensionLabels).map(([key, label]) => (
                <Badge key={key} variant="secondary">
                  {label}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">{questions.length} preguntas</Badge>
              <Badge variant="outline">~{Math.ceil(questions.length * 0.5)} min</Badge>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Button size="lg" onClick={() => setPhase("questions")}>
              Comenzar quiz
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (phase === "result" && result) {
    const scores = result.scores;
    const maxScore = Math.max(...Object.values(scores));

    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Card>
          <CardHeader className="text-center">
            <Badge className="mx-auto mb-2 w-fit" variant="secondary">
              Tu resultado
            </Badge>
            <div className="mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full border-2 border-primary/20 bg-muted flex items-center justify-center">
              <Image
                src={result.character.photo}
                alt={result.character.name}
                width={112}
                height={112}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <CardTitle className="text-3xl">{result.character.name}</CardTitle>
            <CardDescription className="text-base">
              {result.character.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border p-4">
              <p className="text-sm leading-relaxed">{result.character.philosophy}</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Tu perfil:</p>
              {Object.entries(scores).map(([dim, score]) => (
                <div key={dim} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{quiz.dimensionLabels[dim] ?? dim}</span>
                    <span className="text-muted-foreground">
                      {score}/{questions.length}
                    </span>
                  </div>
                  <Progress value={maxScore > 0 ? (score / maxScore) * 100 : 0} />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3 sm:flex-row">
            <Button variant="outline" onClick={handleRestart}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Repetir quiz
            </Button>
            <Button asChild>
              <Link href={backHref}>{backLabel}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Questions phase
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

      <Card>
        <CardHeader>
          <Badge variant="outline" className="w-fit">
            {quiz.scenarioLabel} {question.id}
          </Badge>
          <CardTitle className="text-lg leading-relaxed">
            {question.situation}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedAnswer ?? ""} onValueChange={handleSelect}>
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
          <Button onClick={handleNext} disabled={!selectedAnswer}>
            {currentQuestion === questions.length - 1 ? "Ver resultado" : "Siguiente"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
