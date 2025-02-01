"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TabNavigation } from "@/components/tab-navigation";
import { PageHeader } from "@/components/page-header";
import AudioPlayer from "@/components/audio-player";
import { MOODS, MoodType } from "@/components/mood-tracker";
import InfoButton from "@/components/info-button";
import { CONTENT } from '@/data/content';

export interface Content {
  _id: string;
  title: string;
  description: string;
  duration: string;
  type: "podcast" | "audiobook" | "music";
  tags: MoodType[];
}

const TABS = [
  { id: "podcast", label: "Podcasts" },
  { id: "audiobook", label: "Life Books" },
];

export default function ContentLibrary() {
  const searchParams = useSearchParams();
  const moodParam = searchParams.get("mood") as MoodType | null;
  const router = useRouter();

  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [activeTab, setActiveTab] = useState("podcast");

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const filteredContent = CONTENT.filter(item => 
        item.type === activeTab && 
        (!moodParam || item.tags.includes(moodParam))
      );
      setContent(filteredContent);
    } catch (error) {
      console.error("Failed to fetch content:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, moodParam]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return (
    <div className="min-h-screen p-4 bg-primary">
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader
          title="Content Library"
          description="Explore our collection of podcasts and life books"
          showBackButton
          onBack={() => router.push("/")}
          infoTitle="Content Library"
          infoDescription="Access our curated collection of audio content..."
        />
        <TabNavigation
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        {selectedContent ? (
          <div className="card p-6">
            <button
              onClick={() => setSelectedContent(null)}
              className="text-white/60 hover:text-white mb-4"
            >
              ← Back to list
            </button>
            <AudioPlayer
              contentId={selectedContent._id}
              title={selectedContent.title}
              description={selectedContent.description}
              duration={selectedContent.duration}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {loading ? (
              <div className="text-white/60 text-center py-8">Loading...</div>
            ) : content.length > 0 ? (
              content.map((item) => (
                <button
                  key={item._id}
                  className="w-full text-left card p-4 hover:border-accent transition-colors"
                  onClick={() => setSelectedContent(item)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">{item.title}</h3>
                      <p className="text-sm text-white/60">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/60">{item.duration}</span>
                      <span className="text-2xl">▶️</span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-white/60 text-center py-8">
                No content available for this category
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 