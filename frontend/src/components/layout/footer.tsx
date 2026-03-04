import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("common");
  return (
    <footer className="border-t py-6">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} {t("appName")}. {t("rights")}
      </div>
    </footer>
  );
}
