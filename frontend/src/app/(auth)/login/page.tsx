"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { useAuth } from "@/components/auth/auth-provider";
import { Mail, ArrowLeft } from "lucide-react";

type Step = "email" | "otp";

export default function LoginPage() {
  const { sendOtp, verifyOtp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  function startCooldown() {
    setCooldown(60);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendOtp(email);
      setStep("otp");
      setCode("");
      startCooldown();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar código");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(otpCode: string) {
    if (otpCode.length !== 6) return;
    setError("");
    setLoading(true);
    try {
      await verifyOtp(email, otpCode);
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Código incorrecto");
      setCode("");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0) return;
    setError("");
    setLoading(true);
    try {
      await sendOtp(email);
      startCooldown();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al reenviar código");
    } finally {
      setLoading(false);
    }
  }

  if (step === "otp") {
    return (
      <Card>
        <CardHeader>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setCode("");
              setError("");
            }}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Cambiar email
          </button>
          <CardTitle>Ingresa el código</CardTitle>
          <CardDescription>
            Enviamos un código de 6 dígitos a{" "}
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => {
                setCode(value);
                if (value.length === 6) {
                  handleVerifyOtp(value);
                }
              }}
              disabled={loading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-3 pt-4">
          <Button
            type="button"
            className="w-full"
            disabled={loading || code.length !== 6}
            onClick={() => handleVerifyOtp(code)}
          >
            {loading ? "Verificando..." : "Verificar"}
          </Button>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || loading}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            {cooldown > 0
              ? `Reenviar código en ${cooldown}s`
              : "Reenviar código"}
          </button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription>
          Ingresa tu email y te enviaremos un código de verificación
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSendOtp}>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-3 pt-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              "Enviando..."
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Enviar código
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
