"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CreateSessionCta() {
  const t = useTranslations("createSessionCta");
  return (
    <Card className="border-dashed bg-muted/30">
      <CardHeader className="text-center sm:text-left">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 sm:mx-0">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription className="text-base">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/sessions/new">
            {t("cta")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
