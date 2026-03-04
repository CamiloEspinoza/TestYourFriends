"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Skull,
  Users,
  Scale,
  Target,
  Gamepad2,
  Heart,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import type { QuizCategory } from "@/lib/quiz-api";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Skull,
  Users,
  Scale,
  Target,
  Gamepad2,
  Heart,
  Sparkles,
};

function CategoryIcon({ name }: { name: string }) {
  const Icon = CATEGORY_ICONS[name] ?? Sparkles;
  return <Icon className="h-4 w-4" />;
}

interface QuizCardProps {
  quiz: QuizCategory["quizzes"][0];
  createSessionLabel: string;
  tryQuizLabel: string;
  tryQuizHref?: (slug: string) => string;
}

function QuizCard({ quiz, createSessionLabel, tryQuizLabel, tryQuizHref }: QuizCardProps) {
  const t = useTranslations("dashboard.quizBadge");
  return (
    <Card className="flex flex-col transition-colors hover:border-primary/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm leading-snug">{quiz.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-xs">
          {quiz.description}
        </CardDescription>
        <div className="mt-1.5 flex gap-1.5">
          <Badge variant="secondary" className="text-xs">{t("questions")}</Badge>
          <Badge variant="outline" className="text-xs">{t("duration")}</Badge>
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex gap-2 pt-0">
        <Button asChild size="sm" className="flex-1 gap-1 text-xs">
          <Link href={`/dashboard/sessions/new?quiz=${quiz.slug}`}>
            {createSessionLabel}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="flex-1 text-xs">
          <Link href={tryQuizHref ? tryQuizHref(quiz.slug) : `/quiz/${quiz.slug}`}>
            {tryQuizLabel}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

interface QuizGridProps {
  category: QuizCategory;
  createSessionLabel: string;
  tryQuizLabel: string;
  tryQuizHref?: (slug: string) => string;
}

function QuizGrid({ category, createSessionLabel, tryQuizLabel, tryQuizHref }: QuizGridProps) {
  const quizzes = category.quizzes;
  const QUIZZES_PER_PAGE = 8;
  const pages: (typeof quizzes)[] = [];
  for (let i = 0; i < quizzes.length; i += QUIZZES_PER_PAGE) {
    pages.push(quizzes.slice(i, i + QUIZZES_PER_PAGE));
  }

  const needsCarousel = quizzes.length > QUIZZES_PER_PAGE;
  const grid = "grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  if (!needsCarousel) {
    return (
      <div className={grid}>
        {quizzes.map((q) => (
          <QuizCard
            key={q.slug}
            quiz={q}
            createSessionLabel={createSessionLabel}
            tryQuizLabel={tryQuizLabel}
            tryQuizHref={tryQuizHref}
          />
        ))}
      </div>
    );
  }

  return (
    <Carousel opts={{ align: "start", loop: false }} className="w-full">
      <div className="mb-3 flex items-center justify-end gap-2">
        <CarouselPrevious className="static translate-y-0" />
        <CarouselNext className="static translate-y-0" />
      </div>
      <CarouselContent className="-ml-3">
        {pages.map((page, i) => (
          <CarouselItem key={i} className="pl-3 basis-full">
            <div className={grid}>
              {page.map((q) => (
                <QuizCard
                  key={q.slug}
                  quiz={q}
                  createSessionLabel={createSessionLabel}
                  tryQuizLabel={tryQuizLabel}
                  tryQuizHref={tryQuizHref}
                />
              ))}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

export function QuizCatalogSkeleton() {
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="mt-2 h-3 w-full" />
            <Skeleton className="mt-1 h-3 w-2/3" />
          </CardHeader>
          <CardContent className="flex gap-2 pt-0">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 flex-1" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface QuizCatalogProps {
  categories: QuizCategory[];
  createSessionLabel: string;
  tryQuizLabel: string;
  tryQuizHref?: (slug: string) => string;
}

export function QuizCatalog({
  categories,
  createSessionLabel,
  tryQuizLabel,
  tryQuizHref,
}: QuizCatalogProps) {
  if (categories.length === 0) return null;

  return (
    <Tabs defaultValue={categories[0].slug}>
      <div className="mb-4 -mx-4 px-4 overflow-x-auto">
        <TabsList className="flex h-auto w-max gap-1 bg-transparent p-0">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat.slug}
              value={cat.slug}
              className="flex shrink-0 items-center gap-1.5 rounded-md border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary"
            >
              <CategoryIcon name={cat.icon} />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {categories.map((cat) => (
        <TabsContent key={cat.slug} value={cat.slug} className="mt-0">
          <QuizGrid
            category={cat}
            createSessionLabel={createSessionLabel}
            tryQuizLabel={tryQuizLabel}
            tryQuizHref={tryQuizHref}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
