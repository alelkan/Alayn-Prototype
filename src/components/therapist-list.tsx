"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { THERAPISTS } from "@/data/therapists";

export default function TherapistList() {
  const [selectedTherapist, setSelectedTherapist] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // Get the unique list of locations from the available therapists.
  const locations = Array.from(
    new Set(THERAPISTS.map((doctor) => doctor.location))
  );

  // Filter therapists by selected location if not "all"
  const filteredTherapists =
    selectedLocation === "all"
      ? THERAPISTS
      : THERAPISTS.filter((doctor) => doctor.location === selectedLocation);

  const handleTherapistClick = (id: number) => {
    setSelectedTherapist(id);
  };

  const handleClose = () => {
    setSelectedTherapist(null);
  };

  const handleBookSession = async (time: string) => {
    try {
      const therapist = THERAPISTS.find((t) => t.id === selectedTherapist);
      if (!therapist) throw new Error("Therapist not found");

      const session = {
        therapistName: therapist.name,
        therapistAvatar: therapist.avatar,
        date: new Date(Date.now() + 1000 * 60 * 60 * 24), // This should be dynamic based on selected date
        time: time,
        type: therapist.type,
      };

      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session),
      });

      if (!response.ok) throw new Error("Failed to book session");

      toast.success("Session booked successfully!");
      handleClose();
    } catch (error) {
      toast.error("Failed to book session");
    }
  };

  return (
    <div className="space-y-4">
      {!selectedTherapist ? (
        <>
          <div className="flex flex-col md:flex-row items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Available Doctors</h2>
            <div>
              <label htmlFor="location-filter" className="text-white mr-2">
                Filter by Location:
              </label>
              <select
                id="location-filter"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="p-2 rounded-md"
              >
                <option value="all">All</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {filteredTherapists.length > 0 ? (
            filteredTherapists.map((therapist) => (
              <button
                key={therapist.id}
                className="w-full text-left card hover:border-accent/50 transition-colors"
                onClick={() => handleTherapistClick(therapist.id)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{therapist.avatar}</span>
                  <div>
                    <h3 className="font-medium text-white">
                      {therapist.name}
                    </h3>
                    <p className="text-sm text-white/60">
                      {therapist.type} &middot; {therapist.location}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <p className="text-white/60">
              No doctors found for the selected location.
            </p>
          )}
        </>
      ) : (
        <TherapistDetail
          therapist={THERAPISTS.find((t) => t.id === selectedTherapist)!}
          onClose={handleClose}
          onBookSession={handleBookSession}
        />
      )}
    </div>
  );
}

interface Therapist {
  id: number;
  name: string;
  type: string;
  specialty: string[];
  experience: string;
  languages: string[];
  rating: string;
  hourlyRate: string;
  bio: string;
  avatar: string;
  location: string;
  workshops: {
    title: string;
    date: string;
    description: string;
  }[];
  videos: {
    title: string;
    url: string;
  }[];
}

interface TherapistDetailProps {
  therapist: Therapist;
  onClose: () => void;
  onBookSession: (time: string) => void;
}

function TherapistDetail({
  therapist,
  onClose,
  onBookSession,
}: TherapistDetailProps) {
  const [activeTab, setActiveTab] = useState<"booking" | "workshops" | "videos">("booking");

  return (
    <div className="fixed inset-0 bg-primary p-4 z-50 overflow-y-auto">
      <button onClick={onClose} className="text-2xl mb-4">
        ← Back
      </button>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{therapist.avatar}</span>
          <div>
            <h2 className="text-xl font-semibold">{therapist.name}</h2>
            <p className="text-white/60">
              {therapist.type} &middot; {therapist.location}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="card">
            <p className="text-lg font-semibold">
              {therapist.experience} Years
            </p>
            <p className="text-sm text-white/60">Experience</p>
          </div>

          <div className="card">
            <p className="text-lg font-semibold">⭐ {therapist.rating}</p>
            <p className="text-sm text-white/60">Rating</p>
          </div>
        </div>

        <div className="card">
          <h3 className="font-medium mb-2">About</h3>
          <p className="text-white/80">{therapist.bio}</p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setActiveTab("booking")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "booking"
                ? "bg-accent text-white"
                : "bg-secondary text-white/60"
            }`}
          >
            Book Session
          </button>
          <button
            onClick={() => setActiveTab("workshops")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "workshops"
                ? "bg-accent text-white"
                : "bg-secondary text-white/60"
            }`}
          >
            Workshops
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "videos"
                ? "bg-accent text-white"
                : "bg-secondary text-white/60"
            }`}
          >
            Videos
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "booking" && (
          <div className="space-y-4">
            <h3 className="font-medium">Available Slots</h3>
            <div className="grid grid-cols-3 gap-2">
              {["9:00 AM", "10:00 AM", "2:00 PM", "4:00 PM"].map((time) => (
                <button
                  key={time}
                  className="p-3 card hover:border-accent"
                  onClick={() => onBookSession(time)}
                >
                  {time}
                </button>
              ))}
            </div>
            <button className="w-full py-4 bg-accent rounded-xl text-white font-medium">
              Book Session • {therapist.hourlyRate}
            </button>
          </div>
        )}

        {activeTab === "workshops" && (
          <div className="card">
            <h3 className="font-medium mb-2">Workshops</h3>
            {therapist.workshops.length > 0 ? (
              <ul className="list-disc list-inside text-white/80">
                {therapist.workshops.map((workshop, index) => (
                  <li key={index}>
                    <strong>{workshop.title}</strong> on {workshop.date}:{" "}
                    {workshop.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/60">No workshops available.</p>
            )}
          </div>
        )}

        {activeTab === "videos" && (
          <div className="card">
            <h3 className="font-medium mb-2">Videos</h3>
            {therapist.videos.length > 0 ? (
              <ul className="list-disc list-inside text-white/80">
                {therapist.videos.map((video, index) => (
                  <li key={index}>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-accent"
                    >
                      {video.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/60">No videos available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 