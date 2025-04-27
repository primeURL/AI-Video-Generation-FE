import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Shadcn Button component
import { useVideoContext } from "@/lib/VideoContext";

type Quiz = {
  timestamp: number;
  question: string;
  options: string[];
  correct: string;
};

export function VideoModal() {
  const { selectedVideo, setSelectedVideo } = useVideoContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [videomount, setVideomount] = useState(false);
  const [isQuizVisible, setIsQuizVisible] = useState(false);
  const [isQuizEntering, setIsQuizEntering] = useState(true);

  useEffect(() => {
    if (!videoRef.current) {
      console.log("Video ref is null");
      return;
    }
    if (!selectedVideo) {
      console.log("No selected video");
      return;
    }

    const video = videoRef.current;

    if (!selectedVideo.quiz || selectedVideo.quiz.length === 0) {
      console.warn("No quizzes available for this video");
      return;
    }

    const onTimeUpdate = () => {
      const currentTime = video.currentTime;
      const quiz = selectedVideo.quiz[quizIndex];
      if (
        quizIndex < selectedVideo.quiz.length &&
        currentTime >= quiz.timestamp &&
        !currentQuiz
      ) {
        console.log("Triggering quiz:", quiz);
        video.pause();
        setCurrentQuiz(quiz);
        setIsQuizVisible(true);
        setIsQuizEntering(true);
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [selectedVideo, quizIndex, currentQuiz, videomount]);

  useEffect(() => {
    setTimeout(() => {
      setVideomount(true);
    });
  }, []);

  const handleCloseFeedback = () => {
    setFeedback(null);
  };

  const handleAnswer = (option: string) => {
    if (!currentQuiz) return;
    const isCorrect = option === currentQuiz.correct;
    setFeedback(isCorrect ? "✅ Correct!" : "❌ Incorrect!");
    if (isCorrect) {
      setIsQuizEntering(false);
      setTimeout(() => {
        setCurrentQuiz(null);
        setIsQuizVisible(false);
        setQuizIndex((prev) => {
          return prev + 1;
        });
        setFeedback(null);
        videoRef.current?.play();
      }, 1500);
    }
  };

  if (!selectedVideo) {
    return <div>No video selected</div>;
  }

  return (
    <Dialog
      open={!!selectedVideo}
      onOpenChange={(open) => !open && setSelectedVideo(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedVideo.title}</DialogTitle>
        </DialogHeader>
        <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-lg">
          <video
            ref={videoRef}
            className={`h-full w-full bg-black transition-all duration-300 ${
              currentQuiz || feedback ? "blur-xs" : ""
            }`}
            src={selectedVideo.publicUrl}
            controls
            onError={(e) => console.error("Video load error:", e)}
          />
          {isQuizVisible && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
              <div
                className={`w-[70%] max-w-lg rounded-lg bg-background p-6 shadow-sm border border-border transition-all duration-300 transform ${
                  isQuizEntering
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-4 scale-95"
                }`}
              >
                <h2 className="mb-4 text-center text-xl font-semibold text-foreground">
                  {currentQuiz?.question}
                  <span className="block text-sm text-muted-foreground mt-1">
                    Quiz {quizIndex + 1} of {selectedVideo.quiz.length}
                  </span>
                </h2>
                <div className="space-y-3">
                  {currentQuiz?.options.map((opt, index) => (
                    <Button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      variant="default"
                      className="w-full py-2  bg-blue-100 hover:bg-blue-400 text-black transition-all duration-200 hover:scale-102 shadow-sm animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {feedback && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
              <div className="relative flex flex-col items-center">
                <span className="text-2xl font-bold text-white">{feedback}</span>
                {feedback.includes("Incorrect") && (
                  <Button
                    onClick={handleCloseFeedback}
                    variant="destructive"
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}