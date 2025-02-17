"use client";
import { useUserId } from "@/hooks/use-user-id";
import MoodTracker from "@/components/mood-tracker";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import UpcomingSessions from "@/components/upcoming-sessions";
import DashboardCards from "@/components/dashboard-cards";
import { FaUser, FaUserMd, FaBook, FaClipboardList, FaSpa } from "react-icons/fa";

export default function Home() {
  const userId = useUserId();
  const [quote, setQuote] = useState("");

  return (
    <div className="min-h-screen bg-primary p-4 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-white">Alayn</h1>
        <Link href="/profile" className="text-2xl">
          <FaUser className="text-2xl" />
        </Link>
      </header>

      {/* Swipeable Dashboard Cards */}
      <DashboardCards />

      {/* Navigation Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/therapy" className="card">
          <FaUserMd className="text-2xl" />
          <h3 className="font-medium mt-2">Mental Counseling</h3>
          <p className="text-sm text-white/60"></p>
        </Link>

        <Link href="/content" className="card">
          <FaBook className="text-2xl" />
          <h3 className="font-medium mt-2">Content Library</h3>
          <p className="text-sm text-white/60">Explore resources</p>
        </Link>

        <Link href="/assessment" className="card">
          <FaClipboardList className="text-2xl" />
          <h3 className="font-medium mt-2">Personality Analysis</h3>
          <p className="text-sm text-white/60">Take assessment</p>
        </Link>

        <Link href="/exercises" className="card">
          <FaSpa className="text-2xl" />
          <h3 className="font-medium mt-2">Mindful Exercises</h3>
          <p className="text-sm text-white/60">Meditation &amp; more</p>
        </Link>
      </div>
    </div>
  );
}