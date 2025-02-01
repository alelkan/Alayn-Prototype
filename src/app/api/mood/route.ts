import { connectToDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, value, tag } = await request.json();
    const db = await connectToDb();
    
    await db.collection("mood_entries").insertOne({
      userId,
      value,
      tag,
      date: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save mood" },
      { status: 500 }
    );
  }
}