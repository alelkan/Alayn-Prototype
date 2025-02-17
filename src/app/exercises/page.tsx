"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TabNavigation } from "@/components/tab-navigation";
import { PageHeader } from "@/components/page-header";
import AudioPlayer from "@/components/audio-player";
import { MoodType } from "@/components/mood-tracker";
import InfoButton from "@/components/info-button";
import { FaPlay } from "react-icons/fa";

const TABS = [
  { id: "mindset", label: "Mindset" },
  { id: "yoga", label: "Yoga" },
  { id: "relaxation", label: "Relaxation" }
];

export interface Exercise {
  _id: string;
  title: string;
  description: string;
  duration: string;
  type: "mindset" | "yoga" | "relaxation";
  icon: string;
  audioUrl?: string;
  videoUrl?: string;
  tags: MoodType[];
}

export const EXERCISES: Exercise[] = [
  // Mindset Exercises
  {
    _id: "m1",
    title: "Morning Affirmations",
    description: "Start your day with positive mindset practice",
    duration: "10 min",
    type: "mindset",
    icon: "🧠",
    audioUrl: "/audio/affirmations.mp3",
    tags: ["happiness"]
  },
  {
    _id: "m2",
    title: "Gratitude Practice",
    description: "Cultivate appreciation and positive thinking",
    duration: "15 min",
    type: "mindset",
    icon: "🙏",
    audioUrl: "/audio/gratitude.mp3",
    tags: ["happiness", "sadness"]
  },
  
  // Yoga Exercises
  {
    _id: "y1",
    title: "Morning Yoga Flow",
    description: "Gentle yoga sequence to start your day",
    duration: "20 min",
    type: "yoga",
    icon: "🧘‍♀️",
    videoUrl: "/videos/morning-yoga.mp4",
    tags: ["happiness"]
  },
  {
    _id: "y2",
    title: "Stress Relief Yoga",
    description: "Calming poses for anxiety and stress",
    duration: "25 min",
    type: "yoga",
    icon: "🌸",
    videoUrl: "/videos/stress-yoga.mp4",
    tags: ["anxiety"]
  },
  
  // Relaxation (repurposed music content)
  {
    _id: "r1",
    title: "Calming Frequencies",
    description: "Anti-anxiety sound therapy",
    duration: "45 min",
    type: "relaxation",
    icon: "🎵",
    audioUrl: "/audio/calming-frequencies.mp3",
    tags: ["anxiety"]
  }
];

export default function ExercisesPage() {
  const router = useRouter();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [activeTab, setActiveTab] = useState("mindset");

  const filteredExercises = EXERCISES.filter(exercise => exercise.type === activeTab);

  return (
    <div className="min-h-screen p-4 bg-primary">
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader
          title="Mindful Exercises"
          description="Find exercises to improve your mental well-being"
          showBackButton
          onBack={() => router.push("/")}
          infoTitle="Mindful Exercises Info"
          infoDescription="Discover a variety of exercises including mindset practices, yoga sequences, and relaxation sound therapies designed to enhance your mood and overall well-being."
        />
        <TabNavigation
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {selectedExercise ? (
          <div className="card p-6">
            <button 
              onClick={() => setSelectedExercise(null)}
              className="text-white/60 hover:text-white mb-4"
            >
              ← Back to list
            </button>
            <AudioPlayer 
              contentId={selectedExercise._id}
              title={selectedExercise.title}
              description={selectedExercise.description}
              duration={selectedExercise.duration}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExercises.map((exercise) => (
              <button
                key={exercise._id}
                className="w-full text-left card p-4 hover:border-accent transition-colors"
                onClick={() => setSelectedExercise(exercise)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">{exercise.title}</h3>
                    <p className="text-sm text-white/60">{exercise.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60">{exercise.duration}</span>
                    <span className="text-2xl">
                      <FaPlay className="text-2xl" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 