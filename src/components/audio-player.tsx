"use client";

import React, { useRef, useState } from "react";
import { FaPlay, FaPause, FaVolumeDown } from "react-icons/fa";
import BaseCard from "./BaseCard";

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
  const [currentTime, setCurrentTime] = useState("0:00");
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
      // Simple formatting – you can expand this as needed
      setCurrentTime(Math.floor(current).toString());
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
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <BaseCard className="p-6 space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="text-white/60">{description}</p>
      </div>

      <audio
        ref={audioRef}
        src={`/api/content/${contentId}`}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlaying(false)}
      />
      
      <div className="space-y-4">
        <div 
          className="h-2 bg-secondary rounded-full cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-accent rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">{currentTime}</span>
          <span className="text-sm text-white/60">{duration}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div onClick={togglePlay} className="cursor-pointer text-2xl">
              {playing ? <FaPause /> : <FaPlay />}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-base">
                <FaVolumeDown />
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
} 