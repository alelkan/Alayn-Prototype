"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TabNavigation } from "@/components/tab-navigation";
import { PageHeader } from "@/components/page-header";
import AudioPlayer from "@/components/audio-player";
import InfoButton from "@/components/info-button";
import { CONTENT } from "@/data/content";

const TABS = [
  { id: "podcast", label: "Podcasts" },
  { id: "audiobook", label: "Life Books" }
];

export default function ContentPage() {
  const router = useRouter();
  const [selectedContent, setSelectedContent] = useState<typeof CONTENT[0] | null>(null);
  const [activeTab, setActiveTab] = useState("podcast");

  const filteredContent = CONTENT.filter(
    item => item.type === activeTab
  );

  return (
    <div className="min-h-screen p-4 bg-primary">
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader
          title="Content Library"
          description="Explore our collection of podcasts and life books"
          showBackButton
          onBack={() => router.push("/")}
          infoTitle="Content Library Info"
          infoDescription="Browse our curated collection of audio content that features inspiring podcasts and motivational life books."
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
            {filteredContent.map((item) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}