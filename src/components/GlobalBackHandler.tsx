"use client";

import { useRouter } from "next/navigation";
import { useBackButtonHandler } from "@/hooks/useBackButtonHandler";

export default function GlobalBackHandler() {
  const router = useRouter();

  useBackButtonHandler(() => {
    router.back();
  });

  return null;
} 