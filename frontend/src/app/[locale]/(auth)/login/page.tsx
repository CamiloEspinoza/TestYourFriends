"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
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
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/auth-provider";
import { Mail, ArrowLeft } from "lucide-react";

type Step = "email" | "otp";

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const tOtp = useTranslations("auth.otp");
  const { sendOtp, verifyOtp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fullRedirect = searchParams.get("redirect");
  const redirectTo = fullRedirect
    ? fullRedirect.replace(/^\/(es|en|fr|it|pt|de)/, "") || "/dashboard"
    : "/dashboard";
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const verifyingRef = useRef(false);

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
      setError(err instanceof Error ? err.message : t("errorSend"));
    } finally {
      setLoading(false);
    }
  }

  const handleVerifyOtp = useCallback(
    async (otpCode: string) => {
      if (otpCode.length !== 6 || verifyingRef.current) return;
      verifyingRef.current = true;
      setError("");
      setLoading(true);
      try {
        await verifyOtp(email, otpCode);
        router.push(redirectTo);
      } catch (err) {
        setError(err instanceof Error ? err.message : tOtp("errorVerify"));
        setCode("");
      } finally {
        setLoading(false);
        verifyingRef.current = false;
      }
    },
    [email, redirectTo, verifyOtp, router, tOtp],
  );

  async function handleResend() {
    if (cooldown > 0) return;
    setError("");
    setLoading(true);
    try {
      await sendOtp(email);
      startCooldown();
    } catch (err) {
      setError(err instanceof Error ? err.message : tOtp("errorResend"));
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
            {tOtp("changeEmail")}
          </button>
          <CardTitle>{tOtp("title")}</CardTitle>
          <CardDescription>
            {tOtp("description")}{" "}
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
            {loading ? tOtp("verifying") : tOtp("verify")}
          </Button>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || loading}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            {cooldown > 0
              ? tOtp("resendIn", { seconds: cooldown })
              : tOtp("resend")}
          </button>
        </CardFooter>
      </Card>
    );
  }

  return (
      <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {t("description")}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSendOtp}>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
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
              t("sending")
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                {t("sendCode")}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
