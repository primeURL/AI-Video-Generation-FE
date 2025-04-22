import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [videomount,setVideomount] = useState(false)
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
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
   

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [selectedVideo, quizIndex, currentQuiz, videomount]);

  useEffect(()=>{
    setTimeout(()=>{
      setVideomount(true)
    })
  },[])

  const handleCloseFeedback = () => {
    setFeedback(null);
  };
  const handleAnswer = (option: string) => {
    if (!currentQuiz) return;
    const isCorrect = option === currentQuiz.correct;
    setFeedback(isCorrect ? "✅ Correct!" : "❌ Incorrect!");
    if (isCorrect) {
      
      setCurrentQuiz(null);
      setQuizIndex((prev) => {
        return prev + 1;
      });
      
      setTimeout(() => {
        setFeedback(null);
        videoRef.current?.play();
      }, 2000)
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
            className="h-full w-full bg-black"
            src={selectedVideo.publicUrl}
            controls
            onError={(e) => console.error("Video load error:", e)}
          />
          {currentQuiz && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
              <div className="w-[90%] max-w-xl rounded-lg bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-center text-2xl font-bold">
                  {currentQuiz.question}
                </h2>
                <div className="space-y-2">
                  {currentQuiz.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      className="w-full rounded-md bg-blue-100 px-4 py-2 text-left hover:bg-blue-200"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {feedback && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
                  <div className="relative flex flex-col items-center">
                    <span className="text-3xl font-bold text-white">{feedback}</span>
                    {feedback.includes("Incorrect") && (
                      <button
                        onClick={handleCloseFeedback}
                        className="mt-4 rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                </div>
              )}
        </div>
      </DialogContent>
    </Dialog>
  );
}