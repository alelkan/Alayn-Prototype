"use client";
import { createContext, useContext, useState, useEffect } from "react";

export type Mood = "anger" | "sadness" | "depression" | "happiness" | "anxiety" | null;

interface MoodContextValue {
  mood: Mood;
  setMood: (mood: Mood) => void;
}

const MoodContext = createContext<MoodContextValue>({ mood: null, setMood: () => {} });

export function MoodProvider({ children }: { children: React.ReactNode }) {
  const [mood, setMoodInternal] = useState<Mood>(null);

  useEffect(() => {
    const storedMood = localStorage.getItem("currentMood");
    if (storedMood) {
      setMoodInternal(storedMood as Mood);
    }
  }, []);

  const setMood = (newMood: Mood) => {
    setMoodInternal(newMood);
    if (newMood) {
      localStorage.setItem("currentMood", newMood);
    }
  };

  return <MoodContext.Provider value={{ mood, setMood }}>{children}</MoodContext.Provider>;
}

export function useMood() {
  return useContext(MoodContext);
}