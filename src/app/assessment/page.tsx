"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { personalityQuestions } from "@/data/personality-questions";
import { useUserId } from "@/hooks/use-user-id";
import analyzePersonality from "@/components/gemini";
import { CONTENT, Content } from "@/data/content";
import { motion, AnimatePresence } from "framer-motion";
import InfoButton from "@/components/info-button";
import { useRouter } from 'next/navigation';
import { MoodType } from "@/components/mood-tracker";
import Link from "next/link";
import AudioPlayer from "@/components/audio-player";
import { THERAPISTS } from "@/data/therapists";
import { PageHeader } from "@/components/page-header";
import { EXERCISES, Exercise } from "@/app/exercises/page";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { toast } from "react-hot-toast";

interface AnalysisResult {
  dominantMood: MoodType;
  summary: string;
  detailedAnalysis: string[];
  recommendedContent: {
    podcast: string[];
    audiobook: string[];
    music: string[];
  };
  recommendedTherapists: {
    id: number;
    name: string;
    type: string;
    specialty: string[];
    experience: string;
    languages: string[];
    rating: string;
    hourlyRate: string;
    bio: string;
    avatar: string;
  }[];
  identifiedIssues: string[];
}

interface ContentSection {
  title: string;
  icon: string;
  type: "podcast" | "audiobook" | "music";
  items: Content[];
}

type ContentSectionProps = {
  section: {
    title: string;
    icon: string;
    type: "podcast" | "audiobook" | "music";
    items: Content[];
  };
  onSelect: (content: Content) => void;
};

const ContentSection = ({ section, onSelect }: ContentSectionProps) => {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{section.icon}</span>
        <h2 className="text-xl font-bold text-white">{section.title}</h2>
      </div>
      <Swiper
        modules={[Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
        }}
        className="content-swiper relative"
      >
        {section.items.map((content) => (
          <SwiperSlide key={content._id}>
            <button
              onClick={() => onSelect(content)}
              className="w-full text-left p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">{content.title}</h3>
                  <p className="text-sm text-white/60">{content.description}</p>
                  <span className="text-xs text-white/40">{content.duration}</span>
                </div>
                <span className="text-2xl">▶️</span>
              </div>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const DoctorsForYou = ({ therapists }: { therapists: typeof THERAPISTS }) => {
  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-white mb-4">Doctors for You</h2>
      <Swiper
        modules={[Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
        }}
        className="w-full"
      >
        {therapists.map((therapist) => (
          <SwiperSlide key={therapist.id}>
            <div className="p-4 bg-secondary/20 rounded-lg h-full">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{therapist.avatar}</span>
                <div>
                  <h3 className="font-medium text-white">{therapist.name}</h3>
                  <p className="text-sm text-white/60">{therapist.type}</p>
                  <p className="text-xs text-white/40">
                    {therapist.specialty.join(", ")} • {therapist.experience} years
                  </p>
                </div>
              </div>
              <Link 
                href={`/therapy?therapist=${therapist.id}`}
                className="mt-3 block w-full text-center py-2 bg-accent/20 hover:bg-accent/30 rounded-lg text-white/80"
              >
                Book Session
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default function Assessment() {
  const router = useRouter();
  const userId = useUserId();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [recommendedContent, setRecommendedContent] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [recommendedTherapists, setRecommendedTherapists] = useState<typeof THERAPISTS>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const contentSections: ContentSection[] = [
    { title: "Podcasts for You", icon: "🎙️", type: "podcast", items: recommendedContent.filter(c => c.type === "podcast") },
    { title: "Audiobooks for You", icon: "📚", type: "audiobook", items: recommendedContent.filter(c => c.type === "audiobook") },
    { title: "Music for You", icon: "🎵", type: "music", items: recommendedContent.filter(c => c.type === "music") },
  ];

  const getRecommendedContent = (mood: MoodType) => {
    return CONTENT.filter(item => item.tags.includes(mood));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Add answers[currentQuestion] = answer before analysis
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestion] = answer;
      setAnswers(updatedAnswers);

      if (currentQuestion < personalityQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setAnswer("");
        setIsLoading(false);
        return;
      }

      const result = await analyzePersonality(updatedAnswers, personalityQuestions);
      setAnalysis(result);
      
      // Get recommended content based on dominant mood
      const recommendedContent = getRecommendedContent(result.dominantMood);
      setRecommendedContent(recommendedContent);
      
      setShowResults(true);
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Failed to analyze responses');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate recommended exercises based on the dominant mood.
  // Here we filter the EXERCISES using the dominantMood found in the analysis.
  const recommendedExercises: Exercise[] =
    analysis?.dominantMood
      ? EXERCISES.filter((exercise) => exercise.tags.includes(analysis.dominantMood))
      : [];

  return (
    <div className="min-h-screen p-4 bg-primary">
      <div className="max-w-2xl mx-auto space-y-6">
        <PageHeader
          title="Personality Analysis"
          description="Understand yourself better through our comprehensive assessment"
          showBackButton
          onBack={() => router.push("/")}
          infoTitle="Personality Assessment"
          infoDescription="Take our comprehensive personality assessment to better understand yourself. This analysis helps us provide more personalized recommendations for your mental health journey."
        />

        {!showResults ? (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-white/60">
                Question {currentQuestion + 1} of {personalityQuestions.length}
              </div>
              <div className="h-2 flex-1 mx-4 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-300" 
                  style={{ 
                    width: `${((currentQuestion + 1) / personalityQuestions.length) * 100}%` 
                  }} 
                />
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h2 className="text-xl text-white">
                  {personalityQuestions[currentQuestion]}
                </h2>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full p-4 bg-secondary text-white rounded-xl border border-accent/20 focus:border-accent/50 outline-none min-h-[100px]"
                  placeholder="Type your answer here..."
                />
                <button
                  onClick={handleSubmit}
                  className="w-full py-3 bg-accent text-white rounded-xl"
                >
                  {currentQuestion === personalityQuestions.length - 1
                    ? "Complete"
                    : "Next"}
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Your Analysis</h2>
              <p className="text-white/80">{analysis?.summary}</p>
              <ul className="mt-4 space-y-2">
                {analysis?.detailedAnalysis.map((point, index) => (
                  <li key={index} className="text-white/80">• {point}</li>
                ))}
              </ul>
            </div>

            {recommendedTherapists?.length > 0 && (
              <DoctorsForYou therapists={recommendedTherapists} />
            )}

            {recommendedContent.length > 0 && (
              <div className="space-y-6">
                {contentSections.map((section) => 
                  section.items.length > 0 && (
                    <ContentSection 
                      key={section.type}
                      section={section}
                      onSelect={setSelectedContent}
                    />
                  )
                )}
              </div>
            )}

            {recommendedExercises.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-white mb-4">Recommended Exercises</h2>
                <div className="grid grid-cols-2 gap-4">
                  {recommendedExercises.map((exercise) => (
                    <button
                      key={exercise._id}
                      className="card p-4 hover:border-accent transition-colors text-left"
                      onClick={() => {
                        console.log("Selected exercise:", exercise.title);
                      }}
                    >
                      <span className="text-3xl">{exercise.icon}</span>
                      <h3 className="font-medium text-white mt-2">{exercise.title}</h3>
                      <p className="text-sm text-white/60">{exercise.description}</p>
                      <span className="text-sm text-white/40 mt-2 block">{exercise.duration}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedContent && (
              <div className="card p-6">
                <button 
                  onClick={() => setSelectedContent(null)}
                  className="text-white/60 hover:text-white mb-4"
                >
                  ← Back to recommendations
                </button>
                <AudioPlayer 
                  contentId={selectedContent._id}
                  title={selectedContent.title}
                  description={selectedContent.description}
                  duration={selectedContent.duration}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}