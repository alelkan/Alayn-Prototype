import { connectToDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { assessmentSchema } from "@/schemas/assessment";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validated = assessmentSchema.parse(data);
    
    const db = await connectToDb();
    await db.collection("assessments").insertOne(validated);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid assessment data" },
      { status: 400 }
    );
  }
}