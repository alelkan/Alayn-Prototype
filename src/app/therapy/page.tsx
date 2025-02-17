"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TherapistList from "@/components/therapist-list";
import { PageHeader } from "@/components/page-header";
import { TabNavigation } from "@/components/tab-navigation";
import { THERAPISTS } from "@/data/therapists";
import { YouTubePlayer } from "@/components/youtube-player";

const TABS = [
  { id: "doctors", label: "Book a Session" },
  { id: "workshops", label: "Workshops" },
  { id: "videos", label: "Educational Videos" }
];

export default function TherapyPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"doctors" | "workshops" | "videos">("doctors");
  const [selectedTherapist, setSelectedTherapist] = useState<number | null>(null);

  return (
    <div className="min-h-screen p-4 bg-primary">
      <div className="max-w-4xl mx-auto space-y-6">
        {selectedTherapist === null && (
          <>
            <PageHeader
              title="Mental Counseling"
              description="Book sessions, join workshops, or watch educational content"
              showBackButton
              onBack={() => router.push("/")}
              infoTitle="Therapy Info"
              infoDescription="Our experts are here to support you."
            />
            <TabNavigation
              tabs={TABS}
              activeTab={activeSection}
              onTabChange={(tab) => setActiveSection(tab as typeof activeSection)}
            />
          </>
        )}

        {activeSection === "doctors" && (
          <TherapistList
            selectedTherapist={selectedTherapist}
            setSelectedTherapist={setSelectedTherapist}
          />
        )}
        {activeSection === "workshops" && <WorkshopsSection />}
        {activeSection === "videos" && <VideosSection />}
      </div>
    </div>
  );
}

function WorkshopsSection() {
  const allWorkshops = THERAPISTS.flatMap((therapist) =>
    therapist.workshops.map((ws) => ({
      ...ws,
      therapistName: therapist.name,
      therapistType: therapist.type,
      therapistAvatar: therapist.avatar
    }))
  );

  return (
    <div className="grid gap-4">
      {allWorkshops.map((workshop, index) => (
        <div key={index} className="card p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{workshop.therapistAvatar}</span>
            <div>
              <h3 className="font-medium text-white">{workshop.therapistName}</h3>
              <p className="text-sm text-white/60">{workshop.therapistType}</p>
            </div>
          </div>
          <h3 className="text-lg font-medium text-white">{workshop.title}</h3>
          <p className="text-white/60 text-sm mb-2">Date: {workshop.date}</p>
          <p className="text-white/80">{workshop.description}</p>
          <button className="mt-4 w-full py-2 bg-accent/20 hover:bg-accent/30 rounded-lg text-white/80">
            Register for Workshop
          </button>
        </div>
      ))}
    </div>
  );
}

function VideosSection() {
  const allVideos = THERAPISTS.flatMap((therapist) =>
    therapist.videos.map((video) => ({
      ...video,
      therapistName: therapist.name,
      therapistType: therapist.type,
      therapistAvatar: therapist.avatar
    }))
  );

  const [selectedVideo, setSelectedVideo] = useState<typeof allVideos[0] | null>(null);

  return (
    <div className="space-y-6">
      {selectedVideo ? (
        <div className="card p-4">
          <button 
            onClick={() => setSelectedVideo(null)}
            className="mb-4 text-white/60 hover:text-white"
          >
            ← Back to videos
          </button>
          <YouTubePlayer url={selectedVideo.url} />
          <div className="mt-4">
            <h3 className="text-lg font-medium text-white">{selectedVideo.title}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xl">{selectedVideo.therapistAvatar}</span>
              <div>
                <p className="text-white">{selectedVideo.therapistName}</p>
                <p className="text-sm text-white/60">{selectedVideo.therapistType}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {allVideos.map((video, index) => (
            <button
              key={index}
              className="card p-4 text-left hover:border-accent/50 transition-colors"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{video.therapistAvatar}</span>
                <div>
                  <h3 className="font-medium text-white">{video.therapistName}</h3>
                  <p className="text-sm text-white/60">{video.therapistType}</p>
                </div>
              </div>
              <h3 className="text-lg font-medium text-white">{video.title}</h3>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 