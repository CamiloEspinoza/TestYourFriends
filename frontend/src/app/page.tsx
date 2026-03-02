import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/layout/footer";
import {
  Brain,
  Sparkles,
  Users,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Dilemas que revelan",
    description:
      "Preguntas diseñadas para descubrir cómo piensas realmente frente a situaciones complejas.",
  },
  {
    icon: Users,
    title: "Comparte y compara",
    description:
      "Envía el quiz a tus amigos y descubre quién piensa como tú y quién te sorprenderá.",
  },
  {
    icon: BarChart3,
    title: "Perfil de personalidad",
    description:
      "Obtén un perfil basado en dimensiones éticas y descubre qué personaje histórico comparte tu filosofía.",
  },
];

const dimensions = [
  { label: "Pragmatismo", color: "default" as const },
  { label: "Idealismo", color: "secondary" as const },
  { label: "Empatía", color: "outline" as const },
  { label: "Rebeldía", color: "default" as const },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <span className="text-lg font-bold tracking-tight">
            TestYourFriends
          </span>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto flex flex-col items-center gap-6 px-4 py-24 text-center md:py-32">
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Quiz de ejemplo disponible
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Descubre cómo piensan las personas que te importan
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Quizzes con dilemas reales que revelan la filosofía de vida de cada
            persona. Comparte, compara y entiende a tus amigos como nunca antes.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/quiz/ethics"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Probar el quiz
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Cómo funciona
            </a>
          </div>
        </section>

        {/* How it works */}
        <section
          id="como-funciona"
          className="container mx-auto px-4 pb-16 md:pb-24"
        >
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight sm:text-3xl">
            Más que un quiz: una forma de entendernos
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <feature.icon className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Dimensions preview */}
        <section className="container mx-auto px-4 pb-24 md:pb-32">
          <Card className="mx-auto max-w-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                4 dimensiones éticas te definen
              </CardTitle>
              <CardDescription>
                Cada respuesta revela tu inclinación hacia una dimensión.
                Tu combinación única determina tu perfil.
              </CardDescription>
              <div className="flex flex-wrap justify-center gap-2 pt-4">
                {dimensions.map((dim) => (
                  <Badge key={dim.label} variant={dim.color}>
                    {dim.label}
                  </Badge>
                ))}
              </div>
              <div className="pt-4">
                <Link
                  href="/quiz/ethics"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Descubre tu perfil
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
