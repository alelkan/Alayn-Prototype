"use client";

import { useUserId } from "@/hooks/use-user-id";
import { useState } from "react";
import { toast } from "react-hot-toast";

export const MOODS = [
  { emoji: "😠", label: "Anger", tag: "anger" },
  { emoji: "😞", label: "Sad", tag: "sadness" },
  { emoji: "😔", label: "Depressed", tag: "depression" },
  { emoji: "🙂", label: "Happy", tag: "happiness" },
  { emoji: "🥺", label: "Anxiety", tag: "anxiety" }
] as const;

export type MoodType = typeof MOODS[number]['tag'];

interface MoodTrackerProps {
  onMoodSelect?: (mood: MoodType) => void;
}

export default function MoodTracker({ onMoodSelect }: MoodTrackerProps) {
  const userId = useUserId();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const submitMood = async (index: number) => {
    try {
      const mood = MOODS[index];
      await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, value: index + 1, tag: mood.tag }),
      });
      onMoodSelect?.(mood.tag);
      toast.success("Mood recorded!");
    } catch (error) {
      toast.error("Failed to save mood");
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Track Your Mood</h2>
      <div className="flex justify-between">
        {MOODS.map((mood, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedMood(index + 1);
              submitMood(index);
            }}
            className="flex flex-col items-center gap-2"
          >
            <span className={`text-2xl p-2 rounded-lg transition-transform ${
              selectedMood === index + 1 ? "bg-secondary/20 scale-110" : "hover:bg-primary/10"
            }`}>
              {mood.emoji}
            </span>
            <span className="text-xs text-white/60">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}