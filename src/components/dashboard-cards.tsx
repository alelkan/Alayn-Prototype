"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import MoodTracker from "./mood-tracker";
import UpcomingSessions from "./upcoming-sessions";
import { useRouter } from 'next/navigation';
import { MoodType } from "./mood-tracker";
import "swiper/css";
import "swiper/css/pagination";

const CARDS = ["mood", "sessions"] as const;

export default function DashboardCards() {
  const router = useRouter();
  const [currentCard, setCurrentCard] = useState<typeof CARDS[number]>("mood");

  const handleMoodSelect = (mood: MoodType) => {
    router.push(`/content?mood=${mood}`);
  };

  return (
    <div className="relative">
      <Swiper
        modules={[Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        className="unified-swiper"
        onSlideChange={(swiper) => setCurrentCard(CARDS[swiper.activeIndex])}
      >
        <SwiperSlide>
          <div className="card">
            <MoodTracker onMoodSelect={handleMoodSelect} />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="card">
            <UpcomingSessions />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
} 