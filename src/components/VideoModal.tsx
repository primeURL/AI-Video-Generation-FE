import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { useVideoStore } from "@/hooks/use-video-store";
import { useVideoContext } from "@/lib/VideoContext";
// import { apiRequest } from "@/lib/queryClient";
// import { useToast } from "@/hooks/use-toast";

type Quiz = {
  time: number; // time in seconds to trigger
  question: string;
  options: string[];
  correct: string;
};


export function VideoModal() {
  const { selectedVideo, setSelectedVideo } = useVideoContext();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [answered, setAnswered] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
//   const { toast } = useToast();
  // console.log('selectedVideo',selectedVideo)
  // useEffect(() => {
  //   if (selectedVideo && videoRef.current) {
  //     console.log('insie first efect',videoRef.current)
  //     const handleLoadedMetadata = () => {
  //       videoRef.current?.play().catch((error) => {
  //         console.error("Autoplay error:", error);
  //       });
  //     };
  
  //     const videoElement = videoRef.current;
  //     videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
  //     setCurrentQuiz(selectedVideo.quiz)
  //     return () => {
  //       videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
  //       videoElement.pause();
  //     };
  //   }
  // }, [selectedVideo]);

  useEffect(() => {
    if (!selectedVideo) return;
  
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (video) {
        console.log("✅ Video element is ready:", video);
  
        const onTimeUpdate = () => {
          console.log("Current Time:", video.currentTime);
          if (
            quizIndex < selectedVideo.quiz.length &&
            video.currentTime >= selectedVideo.quiz[quizIndex].timestamp &&
            !answered
          ) {
            video.pause();
            setCurrentQuiz(selectedVideo.quiz[quizIndex]);
          }
        };
  
        video.addEventListener("timeupdate", onTimeUpdate);
  
        clearInterval(interval); // Stop polling once video is ready
  
        // Cleanup
        return () => {
          video.removeEventListener("timeupdate", onTimeUpdate);
        };
      }
    }, 100); // Check every 100ms
  
    return () => clearInterval(interval);
  }, [quizIndex, answered, selectedVideo]);
  
    

    // useEffect(() => {
    //   if (!selectedVideo) return;
    
    //   const interval = setInterval(() => {
    //     const video = videoRef.current;
    //     if (video) {
    //       console.log("🎥 Video loaded:", video);
    //       clearInterval(interval);
    //     }
    //   }, 100); // Retry every 100ms until videoRef is set
    
    //   return () => clearInterval(interval);
    // }, [selectedVideo]);
    
    const handleAnswer = (option: string) => {
      if (!currentQuiz) return;
  
      const isCorrect = option === currentQuiz.correct;
      alert(isCorrect ? "✅ Correct!" : "❌ Incorrect!");
  
      setCurrentQuiz(null);
      setAnswered(true);
  
      setTimeout(() => {
        const video = videoRef.current;
        if (video) video.play();
        setAnswered(false);
        setQuizIndex((i) => i + 1);
      }, 500); // short delay before resuming
    };

  return (
    <Dialog 
      open={!!selectedVideo} 
      onOpenChange={(open) => !open && setSelectedVideo(null)}
    >
      <DialogContent className="w-auto h-auto">
        {selectedVideo && (
          <>
            <DialogHeader>
              <DialogTitle>{selectedVideo.title}</DialogTitle>
            </DialogHeader>
            
            <div className="mt-4 h-full w-full relative rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                className="w-full h-full bg-black"
                src={selectedVideo.publicUrl}
                controls={true}
              />
             
             {currentQuiz && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40">
                    <div className="p-6 bg-white rounded-lg shadow-xl w-[90%] max-w-xl">
                      <h2 className="text-2xl font-bold mb-4 text-center">{currentQuiz.question}</h2>
                      <div className="space-y-2">
                        {currentQuiz.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleAnswer(opt)}
                            className="w-full px-4 py-2 text-left bg-blue-100 hover:bg-blue-200 rounded-md"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
            </div>
           
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
