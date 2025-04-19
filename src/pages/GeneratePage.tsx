import { useState } from "react";
import { GenerateForm } from "@/components/GenerateForm";
import { GenerationStatus } from "@/components/GenerationStatus";
// import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ApiService } from "@/lib/apiService";
import { useVideoContext } from "@/lib/VideoContext";

export default function GeneratePage() {

  const {isGenerating, setIsGenerating , progress, setProgress, status, setStatus} = useVideoContext()
  const [isSubmitting, setIsSubmitting] = useState(false);
//   const { toast } = useToast();
  const navigate = useNavigate()

  const generateVideo = async (data: {
    title: string;
    content: string;
    type: "script" | "topic";
  }) => {
    try {
      setIsSubmitting(true);
      // let intervalId: NodeJS.Timeout;
      // intervalId = setInterval(checkVideoStatus, 2000);
      await ApiService.generateVideo(data);
      
    //   toast({
    //     title: "Video generated successfully",
    //     description: "Your video is now available in the Videos section.",
    //   });
      setIsGenerating(false);
      navigate("/videos");
    } catch (error) {
    //   toast({
    //     title: "Error generating video",
    //     description: error instanceof Error ? error.message : "An unknown error occurred",
    //     variant: "destructive",
    //   });
    console.log('err',error)
      setIsGenerating(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGenerate = (data: {
    title: string;
    content: string;
    type: "script" | "topic";
  }) => {


    setIsGenerating(true);
    generateVideo(data);

    setProgress(0);
    setStatus("Processing script and preparing assets...");
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress((prev:number) => {
        const newProgress = prev + 3;
        
        if (newProgress >= 95) {
          clearInterval(interval);
          setStatus("Finalizing video...");
          
          // Trigger the actual generation
         
          return 95;
        }
        
        if (newProgress > 30 && newProgress < 60) {
          setStatus("Generating visuals...");
        } else if (newProgress >= 60 && newProgress < 80) {
          setStatus("Adding narration...");
        } else if (newProgress >= 80) {
          setStatus("Compiling video...");
        }
        
        return newProgress;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  };
  
  const handleCancel = () => {
    setIsGenerating(false);
    // toast({
    //   title: "Generation cancelled",
    //   description: "Video generation has been cancelled.",
    // });
  };

  return (
    <div id="generate-section" className="py-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Generate Educational Video</h2>
        <p className="text-slate-500 mb-6">Create educational videos by entering a script or selecting from predefined topics.</p>
        
        {isGenerating ? (
          // <div>
          //   <p>LLM is generating the script</p>
          //   <p>Hang On...</p>
          // </div>
          <GenerationStatus 
            progress={progress} 
            status={status} 
            onCancel={handleCancel} 
          />
        ) : (
          <GenerateForm onGenerate={handleGenerate} />
        )}
      </div>
    </div>
  );
}
