"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface JoinFormProps {
  sessionCode: string;
  creatorName: string | null;
  onJoin: (name: string, email?: string) => Promise<void>;
}

export function JoinForm({ sessionCode, creatorName, onJoin }: JoinFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onJoin(name, email || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al unirse");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Unirse a la sesión</CardTitle>
        <CardDescription>
          {creatorName
            ? `${creatorName} te invita a responder un quiz`
            : `Sesión: ${sessionCode}`}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="space-y-2">
            <Label htmlFor="name">Tu nombre</Label>
            <Input
              id="name"
              placeholder="¿Cómo te llamas?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (opcional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="Para recibir resultados por email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="pt-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Comenzar quiz"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
