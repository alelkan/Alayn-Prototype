"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { THERAPISTS } from "@/data/therapists";
import { FiFilter } from "react-icons/fi";

interface TherapistListProps {
  selectedTherapist: number | null;
  setSelectedTherapist: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function TherapistList({ selectedTherapist, setSelectedTherapist }: TherapistListProps) {
  // New filter state replacing the old location select
  const [filterType, setFilterType] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [filterRating, setFilterRating] = useState<string>("all");
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState<boolean>(false);

  // Combine all filters (type, location, rating)
  const filteredTherapists = THERAPISTS.filter((doctor) => {
    const typeMatch = filterType === "all" || doctor.type === filterType;
    const locMatch = filterLocation === "all" || doctor.location === filterLocation;
    const ratingMatch =
      filterRating === "all" || parseFloat(doctor.rating) >= parseFloat(filterRating);
    return typeMatch && locMatch && ratingMatch;
  });

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
        date: new Date(Date.now() + 1000 * 60 * 60 * 24), // dynamic in a real app
        time: time,
        type: therapist.type,
      };

      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Available Doctors</h2>
            <button
              onClick={() => setIsFilterSidebarOpen(true)}
              className="text-white border p-2 rounded-md"
            >
              <FiFilter size={24} />
            </button>
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
                    <h3 className="font-medium text-white">{therapist.name}</h3>
                    <p className="text-sm text-white/60">
                      {therapist.type} &middot; {therapist.location}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <p className="text-white/60">No doctors found for the selected filters.</p>
          )}
        </>
      ) : (
        <TherapistDetail
          therapist={THERAPISTS.find((t) => t.id === selectedTherapist)!}
          onClose={handleClose}
          onBookSession={handleBookSession}
        />
      )}
      {isFilterSidebarOpen && (
        <FilterSidebar
          filterType={filterType}
          setFilterType={setFilterType}
          filterLocation={filterLocation}
          setFilterLocation={setFilterLocation}
          filterRating={filterRating}
          setFilterRating={setFilterRating}
          onClose={() => setIsFilterSidebarOpen(false)}
        />
      )}
    </div>
  );
}

interface FilterSidebarProps {
  filterType: string;
  setFilterType: React.Dispatch<React.SetStateAction<string>>;
  filterLocation: string;
  setFilterLocation: React.Dispatch<React.SetStateAction<string>>;
  filterRating: string;
  setFilterRating: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
}

function FilterSidebar({
  filterType,
  setFilterType,
  filterLocation,
  setFilterLocation,
  filterRating,
  setFilterRating,
  onClose,
}: FilterSidebarProps) {
  const types = Array.from(new Set(THERAPISTS.map((t) => t.type)));
  const locations = Array.from(new Set(THERAPISTS.map((t) => t.location)));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-end z-50">
      <div className="w-80 p-4 bg-secondary/20 backdrop-blur-lg border border-white/20 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Filter</h2>
          <button onClick={onClose} className="text-xl text-white">
            &times;
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white">Type</label>
            <select
              className="w-full border px-2 py-1 rounded-md bg-secondary text-white"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Location</label>
            <select
              className="w-full border px-2 py-1 rounded-md bg-secondary text-white"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              <option value="all">All</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Rating</label>
            <select
              className="w-full border px-2 py-1 rounded-md bg-secondary text-white"
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
            >
              <option value="all">All</option>
              <option value="4">4 & up</option>
              <option value="4.5">4.5 & up</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={onClose}
            className="w-full py-2 bg-accent rounded-md text-white"
          >
            Apply Filter
          </button>
        </div>
      </div>
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

function TherapistDetail({ therapist, onClose, onBookSession }: TherapistDetailProps) {
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
            <p className="text-lg font-semibold">{therapist.experience} Years</p>
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
              activeTab === "booking" ? "bg-accent text-white" : "bg-secondary text-white/60"
            }`}
          >
            Book Session
          </button>
          <button
            onClick={() => setActiveTab("workshops")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "workshops" ? "bg-accent text-white" : "bg-secondary text-white/60"
            }`}
          >
            Workshops
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "videos" ? "bg-accent text-white" : "bg-secondary text-white/60"
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
          <div>
            <h3 className="font-medium mb-2">Workshops</h3>
            {therapist.workshops.length > 0 ? (
              <ul className="list-disc list-inside text-white/80">
                {therapist.workshops.map((workshop, index) => (
                  <li key={index}>
                    <strong>{workshop.title}</strong> on {workshop.date}: {workshop.description}
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