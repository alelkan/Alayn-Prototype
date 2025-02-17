"use client";

import { useUserId } from "@/hooks/use-user-id";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useMoodTheme, MoodTag } from "@/hooks/use-mood-theme";
import { useMood } from "../context/MoodContent";
import RippleButton from "./RippleButton";

export const MOODS = [
  { emoji: "😠", label: "Anger", tag: "anger" },
  { emoji: "😞", label: "Sad", tag: "sadness" },
  { emoji: "😔", label: "Depressed", tag: "depression" },
  { emoji: "🙂", label: "Happy", tag: "happiness" },
  { emoji: "😰", label: "Anxiety", tag: "anxiety" }
] as const;

export type MoodType = typeof MOODS[number]["tag"];

interface MoodTrackerProps {
  // Removed onMoodSelect since we no longer navigate after selecting mood
}

export default function MoodTracker(/* props */) {
  const userId = useUserId();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const { setMood } = useMood();

  // Use "default" if no mood is selected.
  const currentTheme: MoodTag | "default" = selectedMood
    ? MOODS[selectedMood - 1].tag as MoodTag
    : "default";
  useMoodTheme(currentTheme);

  const submitMood = async (index: number) => {
    try {
      const mood = MOODS[index];
      await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, value: index + 1, tag: mood.tag }),
      });
      setSelectedMood(index + 1);
      // Update the global current mood
      setMood(mood.tag);
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
          <RippleButton
            key={index}
            onClick={() => submitMood(index)}
            className="flex flex-col items-center gap-2"
          >
            <span
              className={`text-2xl p-2 rounded-lg transition-transform ${
                selectedMood === index + 1 ? "bg-secondary/20 scale-110" : "hover:bg-primary/10"
              }`}
            >
              {mood.emoji}
            </span>
            <span className="text-xs text-white/60">{mood.label}</span>
          </RippleButton>
        ))}
      </div>
    </div>
  );
}