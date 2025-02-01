import { any } from "zod";
import { MoodType } from "./mood-tracker";
import { CONTENT } from "@/data/content";
import { THERAPISTS } from "@/data/therapists";

interface Content {
  _id: string;
  title: string;
  description: string;
  duration: string;
  type: "podcast" | "audiobook" | "music";
  tags: MoodType[];
}

interface AnalysisResult {
  dominantMood: MoodType;
  summary: string;
  detailedAnalysis: string[];
  recommendedContent: {
    podcast: string[];
    audiobook: string[];
    music: string[];
  };
  recommendedTherapists: number[];
}

const analyzePersonality = async (responses: string[], questions: string[]) => {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI("AIzaSyBdS-4h4UCYd-r3Iv6ydEHOIUHSDENMt18");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const userResponses = questions.map((q, i) => ({
    question: q,
    answer: responses[i]
  }));

  const prompt = `
  You are a mental health analysis AI. Analyze the personality assessment and return ONLY a JSON object (no markdown, no backticks) in this exact format:
  {
    "dominantMood": "happiness|sadness|anger|anxiety|depression",
    "summary": "Brief 2-3 sentence summary of the analysis",
    "detailedAnalysis": [
      "bullet point 1",
      "bullet point 2",
      "bullet point 3"
    ],
    "recommendedContent": {
      "podcast": ["content_id1", "content_id2"],
      "audiobook": ["content_id1", "content_id2"],
      "music": ["content_id1", "content_id2"]
    },
    "recommendedTherapists": [1, 2, 3],
    "identifiedIssues": ["Depression", "Anxiety"]
  }

  Based on the user's responses, identify their main mental health concerns and match them with appropriate content and therapists.

  Available content:
  ${JSON.stringify(CONTENT, null, 2)}

  Available therapists:
  ${JSON.stringify(THERAPISTS, null, 2)}

  User responses:
  ${JSON.stringify(userResponses, null, 2)}

  IMPORTANT: Return ONLY the JSON object, no other text or formatting. Respond in a way that would seem like you are talking to the user.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return JSON.parse(text);
};

export default analyzePersonality;