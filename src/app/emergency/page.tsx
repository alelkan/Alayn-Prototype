"use client";

import { useUserId } from "@/hooks/use-user-id";
import { useState, useEffect } from "react";

export default function SafetyPlan() {
  const userId = useUserId();
  const [plan, setPlan] = useState("");

  useEffect(() => {
    const loadPlan = async () => {
      const response = await fetch(`/api/safety-plan?userId=${userId}`);
      const data = await response.json();
      setPlan(data.plan || "");
    };
    if (userId) loadPlan();
  }, [userId]);

  const savePlan = async () => {
    await fetch("/api/safety-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, plan }),
    });
  };

  return (
    <div className="space-y-4">
      <textarea
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
        className="w-full h-48 p-4 border rounded-lg"
        placeholder="Create your safety plan..."
      />
      <button 
        onClick={savePlan}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Save Plan
      </button>
    </div>
  );
}