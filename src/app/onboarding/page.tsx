"use client";

import { useUserId } from "@/hooks/use-user-id";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assessmentSchema } from "@/schemas/assessment";

export default function Onboarding() {
  const userId = useUserId();
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(assessmentSchema),
  });

  const submitAssessment = async (data: any) => {
    await fetch("/api/assessments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        answers: data.answers,
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit(submitAssessment)}>
      {/* Render assessment questions */}
      <button type="submit">Submit</button>
    </form>
  );
}