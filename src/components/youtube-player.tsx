"use client";

import { useEffect, useRef } from "react";

interface YouTubePlayerProps {
  url: string;
}

export function YouTubePlayer({ url }: YouTubePlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Extract video ID from URL
    const videoId = url.split("v=")[1];
    if (!videoId) return;

    // Create YouTube player
    const player = document.createElement("iframe");
    player.src = `https://www.youtube.com/embed/${videoId}`;
    player.width = "100%";
    player.height = "100%";
    player.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    player.allowFullscreen = true;

    // Add to container
    if (playerRef.current) {
      playerRef.current.innerHTML = "";
      playerRef.current.appendChild(player);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.innerHTML = "";
      }
    };
  }, [url]);

  return (
    <div 
      ref={playerRef} 
      className="aspect-video w-full rounded-lg overflow-hidden bg-black"
    />
  );
} 