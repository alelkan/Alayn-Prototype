"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TabNavigation } from "@/components/tab-navigation";
import { PageHeader } from "@/components/page-header";
import AudioPlayer from "@/components/audio-player";
import { MOODS, MoodType } from "@/components/mood-tracker";
import InfoButton from "@/components/info-button";
import { CONTENT } from "@/data/content";
import { useMood } from "@/context/MoodContent";

const TABS = [
  { id: "podcast", label: "Podcasts" },
  { id: "audiobook", label: "Life Books" },
];

export default function ContentLibrary() {
  const searchParams = useSearchParams();
  const moodParamFromUrl = searchParams.get("mood") as MoodType | null;
  const { mood } = useMood();
  // Prefer the mood from context; if not available, fall back to URL parameter
  const activeMood = mood || moodParamFromUrl;

  const router = useRouter();
  const [content, setContent] = useState<typeof CONTENT>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<typeof CONTENT[number] | null>(null);
  const [activeTab, setActiveTab] = useState("podcast");

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      // Get all content items of the active type
      let filteredContent = CONTENT.filter((item) => item.type === activeTab);

      // If an active mood exists, sort the content so items with a matching mood tag appear first.
      if (activeMood) {
        filteredContent.sort((a, b) => {
          const aHas = a.tags.includes(activeMood) ? 1 : 0;
          const bHas = b.tags.includes(activeMood) ? 1 : 0;
          // Items with the mood tag will have a higher value and thus come first.
          return bHas - aHas;
        });
      }

      setContent(filteredContent);
    } catch (error) {
      console.error("Failed to fetch content:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, activeMood]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return (
    <div className="p-4">
      <PageHeader title="Content Library" />
      {activeMood && (
        <div className="mb-4 text-white">
          <strong>Current Mood:</strong>{" "}
          {activeMood.charAt(0).toUpperCase() + activeMood.slice(1)}
        </div>
      )}
      <TabNavigation tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      {loading ? (
        <div className="text-white">Loading content...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {content.map((item) => (
            <div key={item._id} className="card p-4">
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <p className="text-white/70">{item.description}</p>
              <p className="text-white/70">Duration: {item.duration}</p>
              {item.tags && (
                <div className="flex gap-2 mt-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-white/60 border border-white/40 rounded px-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {content.length === 0 && (
            <div className="text-white">
              No content available for your current mood.
            </div>
          )}
        </div>
      )}
    </div>
  );
}