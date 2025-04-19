import { createContext, useContext, useState, ReactNode } from 'react';
// import { Video } from '@shared/schema';

interface VideoContextType {
  selectedVideo: any | null;
  setSelectedVideo: (video: any | null) => void;
  isGenerating : boolean;
  setIsGenerating: (value: any | null) => void;
  progress: number;
  setProgress: (value: any | null) => void;
  status: string;
  setStatus: (value: any | null) => void;
  videoProgress: number;
  setVideoProgress: (value: any | null) => void;
}

// Create the context
const VideoContext = createContext<VideoContextType | undefined>(undefined);

// Provider component
export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(1);
  const [status, setStatus] = useState("");

  return (
    <VideoContext.Provider value={{ selectedVideo, setSelectedVideo, 
    isGenerating, setIsGenerating, progress, setProgress, status, setStatus,
    videoProgress, setVideoProgress
    }}>
      {children}
    </VideoContext.Provider>
  );
};

// Custom hook to use the context
export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
};
