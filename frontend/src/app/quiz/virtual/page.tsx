"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, RotateCcw, Monitor } from "lucide-react";

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

import {
  questions,
  calculateResult,
  QUIZ_TITLE,
  QUIZ_DESCRIPTION,
  type Dimension,
  type QuizResult,
} from "@/lib/quizzes/virtual";

type Phase = "intro" | "questions" | "result";

const dimensionLabels: Record<Dimension, string> = {
  A: "Autenticidad",
  P: "Placer",
  V: "Vínculo",
  S: "Sentido",
};

export default function VirtualQuizPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Dimension>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];
  const selectedAnswer = answers[question?.id];

  function handleSelect(dimension: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: dimension as Dimension }));
  }

  function handleNext() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const quizResult = calculateResult(answers);
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
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al dashboard
        </Link>

        <Card className="mt-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Monitor className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">{QUIZ_TITLE}</CardTitle>
            <CardDescription className="text-base">
              {QUIZ_DESCRIPTION}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4 space-y-2">
              <p className="text-sm font-medium">Lo que descubrirás:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>- Qué valoras más: lo real o lo virtual</li>
                <li>- Qué filósofo comparte tu visión sobre la realidad</li>
                <li>- Dónde está tu punto de inflexión</li>
              </ul>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(dimensionLabels) as [Dimension, string][]).map(
                ([key, label]) => (
                  <Badge key={key} variant="secondary">
                    {label}
                  </Badge>
                )
              )}
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
    const maxScore = Math.max(...Object.values(result.scores));

    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Card>
          <CardHeader className="text-center">
            <Badge className="mx-auto mb-2 w-fit" variant="secondary">
              Tu resultado
            </Badge>
            <div className="mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full border-2 border-primary/20">
              <Image
                src={result.character.photo}
                alt={result.character.name}
                width={112}
                height={112}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.innerHTML = `<div class="flex h-full w-full items-center justify-center bg-muted"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`;
                }}
              />
            </div>
            <CardTitle className="text-3xl">
              {result.character.name}
            </CardTitle>
            <CardDescription className="text-base">
              {result.character.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border p-4">
              <p className="text-sm leading-relaxed">
                {result.character.philosophy}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Tu perfil:</p>
              {(
                Object.entries(result.scores) as [Dimension, number][]
              ).map(([dim, score]) => (
                <div key={dim} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{dimensionLabels[dim]}</span>
                    <span className="text-muted-foreground">
                      {score}/{questions.length}
                    </span>
                  </div>
                  <Progress value={(score / maxScore) * 100} />
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
              <Link href="/dashboard">Volver al dashboard</Link>
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
            Escenario {question.id}
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
          <Button onClick={handleNext} disabled={!selectedAnswer}>
            {currentQuestion === questions.length - 1
              ? "Ver resultado"
              : "Siguiente"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
