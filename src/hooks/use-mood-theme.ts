import { useEffect } from "react";

export type MoodTag = "anger" | "sadness" | "depression" | "happiness" | "anxiety";

interface ThemeProperties {
  primary: string;
  accent: string;
}

const moodThemes: Record<MoodTag, ThemeProperties> = {
  anger: {
    primary: "linear-gradient(135deg, #FF416C, #FF4B2B)",
    accent: "#FF6F61",
  },
  sadness: {
    primary: "linear-gradient(135deg, #1e3c72, #2a5298)",
    accent: "#4a90e2",
  },
  depression: {
    primary: "linear-gradient(135deg, #3a3a3a, #151515)",
    accent: "#5a5a5a",
  },
  happiness: {
    primary: "linear-gradient(135deg, #f7c331, #fba609)",
    accent: "#f39c12",
  },
  anxiety: {
    primary: "linear-gradient(135deg, #8e44ad, #c0392b)",
    accent: "#9b59b6",
  },
};

export function useMoodTheme(mood: MoodTag | "default") {
  useEffect(() => {
    const defaultTheme: ThemeProperties = {
      primary: "linear-gradient(135deg, #66bb6a, #43a047)",
      accent: "#4caf50",
    };

    // If the mood doesn't exist in moodThemes or is "default", fallback to defaultTheme.
    const theme = moodThemes[mood as MoodTag] || defaultTheme;

    document.documentElement.style.setProperty("--primary", theme.primary);
    document.documentElement.style.setProperty("--accent", theme.accent);
  }, [mood]);
} 