"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";

export default function NewSessionRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return null;
}
