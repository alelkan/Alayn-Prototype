"use client";

import { useState } from "react";

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

export default function TherapistDetail({ therapist, onClose, onBookSession }: TherapistDetailProps) {
  const [sessionTime, setSessionTime] = useState("10:00 AM");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="bg-primary p-6 rounded-lg max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-white text-2xl">&times;</button>
        <div className="flex items-center gap-4">
          <span className="text-4xl">{therapist.avatar}</span>
          <div>
            <h2 className="text-2xl font-bold text-white">{therapist.name}</h2>
            <p className="text-white/70">{therapist.type} • {therapist.location}</p>
          </div>
        </div>
        <div className="mt-4 text-white">
          <p><span className="font-semibold">Specialties:</span> {therapist.specialty.join(", ")}</p>
          <p><span className="font-semibold">Experience:</span> {therapist.experience} years</p>
          <p><span className="font-semibold">Languages:</span> {therapist.languages.join(", ")}</p>
          <p><span className="font-semibold">Rating:</span> {therapist.rating}</p>
          <p><span className="font-semibold">Hourly Rate:</span> {therapist.hourlyRate}</p>
          <p className="mt-2">{therapist.bio}</p>
        </div>
        <div className="mt-4">
          <label htmlFor="sessionTime" className="block text-white mb-1">Session Time</label>
          <input
            id="sessionTime"
            type="text"
            value={sessionTime}
            onChange={(e) => setSessionTime(e.target.value)}
            className="w-full p-2 rounded-md bg-secondary text-white border border-gray-700"
          />
        </div>
        <div className="mt-4">
          <button onClick={() => onBookSession(sessionTime)} className="w-full py-2 bg-accent rounded-md text-white">
            Book Session
          </button>
        </div>
      </div>
    </div>
  );
} 