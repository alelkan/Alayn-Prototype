"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { SESSIONS } from "../data/sessions";

interface Session {
  id: string;
  therapistName: string;
  therapistAvatar: string;
  date: Date;
  time: string;
  type: string;
}

export default function UpcomingSessions() {
  const [sessions, setSessions] = useState(SESSIONS);

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Upcoming Sessions</h2>
      
      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map(session => (
            <div key={session.id} className="p-4 bg-secondary rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{session.therapistAvatar}</span>
                <div>
                  <h3 className="font-medium">{session.therapistName}</h3>
                  <p className="text-sm text-white/60">{session.type}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <p className="text-sm text-white/60">
                  {formatDistanceToNow(new Date(session.date), { addSuffix: true })}
                </p>
                <button className="px-4 py-2 bg-accent rounded-lg text-sm">
                  Join Call
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-white/60">
          <p>No upcoming sessions</p>
          <button className="mt-2 text-accent">Book a Session</button>
        </div>
      )}
    </div>
  );
} 