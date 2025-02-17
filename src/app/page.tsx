"use client";
import { useUserId } from "@/hooks/use-user-id";
import MoodTracker from "@/components/mood-tracker";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import UpcomingSessions from "@/components/upcoming-sessions";
import DashboardCards from "@/components/DashboardCards";
import CardLink from "@/components/CardLink";
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
        <CardLink href="/therapy" className="card--grid flex flex-col items-start gap-2">
          <FaUserMd className="text-2xl" />
          <h3 className="font-medium mt-2">Mental Counseling</h3>
          <p className="text-sm text-white/60"></p>
        </CardLink>

        <CardLink href="/content" className="card--grid flex flex-col items-start gap-2">
          <FaBook className="text-2xl" />
          <h3 className="font-medium mt-2">Content Library</h3>
          <p className="text-sm text-white/60">Explore resources</p>
        </CardLink>

        <CardLink href="/assessment" className="card--grid flex flex-col items-start gap-2">
          <FaClipboardList className="text-2xl" />
          <h3 className="font-medium mt-2">Personality Analysis</h3>
          <p className="text-sm text-white/60">Take assessment</p>
        </CardLink>

        <CardLink href="/exercises" className="card--grid flex flex-col items-start gap-2">
          <FaSpa className="text-2xl" />
          <h3 className="font-medium mt-2">Mindful Exercises</h3>
          <p className="text-sm text-white/60">Meditation &amp; more</p>
        </CardLink>
      </div>
    </div>
  );
}