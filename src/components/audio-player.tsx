"use client";

import React, { useRef, useState } from "react";
import { FaPlay, FaPause, FaVolumeDown } from "react-icons/fa";

interface AudioPlayerProps {
  contentId: string;
  title: string;
  description: string;
  duration: string;
}

export default function AudioPlayer({ contentId, title, description, duration }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);

  const togglePlay = () => {
    if (playing) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 1;
      setProgress((current / duration) * 100);
      setCurrentTime(current);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      audioRef.current.currentTime = percent * audioRef.current.duration;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-6 bg-secondary/20 rounded-2xl shadow-lg space-y-4">
      <div className="flex flex-col space-y-1">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <p className="text-sm text-white/70">{description}</p>
      </div>
      <audio
        ref={audioRef}
        src={`/api/content/${contentId}`}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlaying(false)}
      />
      <div className="relative h-3 bg-white/10 rounded-full cursor-pointer" onClick={handleProgressClick}>
        <div
          className="absolute left-0 top-0 h-3 bg-accent rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-sm text-white/70">
        <span>{formatTime(currentTime)}</span>
        <span>{duration}</span>
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={togglePlay}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent to-purple-500 shadow-lg text-3xl text-white hover:scale-105 transform transition"
        >
          {playing ? <FaPause /> : <FaPlay />}
        </button>
        <div className="flex items-center gap-3">
          <FaVolumeDown className="text-xl text-white" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-32 h-2 bg-white/20 rounded-full accent-accent"
          />
        </div>
      </div>
    </div>
  );
} 