import { useState, useEffect } from "react";
import { VideoCard } from "@/components/VideoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiService } from "@/lib/apiService";
import { useVideoContext } from "@/lib/VideoContext";
export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([]); // Add proper type instead of any
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const {setSelectedVideo,videoProgress, setVideoProgress} = useVideoContext()
  const [pendingVideo, setPendingVideo] = useState([])
  
  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const {data} = await ApiService.getVideos();
        // console.log('data',data)
        const pendingVideos = data.filter((video: any) => video.status === 'created').map((video:any)=> video.videoId);
        setPendingVideo(pendingVideos)
        // console.log(pendingVideos)
        // Ensure data is an array before setting it
        setVideos(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch videos'));
        setVideos([]); // Reset videos to empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideos();
  }, [pendingVideo.length === 0]);

  useEffect(()=>{

    if (pendingVideo.length > 0) {
      let intervalId: NodeJS.Timeout;
      
      const checkVideoStatus = async () => {
        try {
          const {data} = await ApiService.getVideo(pendingVideo[0]);
          console.log('data', data)
          setVideoProgress((preValue:number)=> preValue + 1.5)
          if (data[0].status === 'done') {
            // Clear the interval when status is done
            console.log('inside')
            clearInterval(intervalId);
            setPendingVideo([]);
          }
        } catch (error) {
          // Optional: Handle errors and clear interval if needed
          console.error('Error checking video status:', error);
          clearInterval(intervalId);
        }
      };
    
      // Store interval ID so we can clear it
      intervalId = setInterval(checkVideoStatus, 2000);
    
      // Cleanup function
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }
  },[pendingVideo.length > 0])

  return (
    <div id="videos-section" className="py-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Videos</h2>
        <p className="text-slate-500 mb-6">Access and manage your generated educational videos.</p>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="relative aspect-video w-full mb-4">
                  <Skeleton className="absolute inset-0" />
                </div>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-500 mb-2">Error loading videos</p>
            <p className="text-sm text-slate-500">Please try again later</p>
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video, index) => (
              <VideoCard 
                progress={videoProgress}
                key={video.videoId || index}
                video={video} 
                onPlay={() => setSelectedVideo(video)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-12 border border-dashed rounded-lg">
            <h3 className="text-lg font-medium text-slate-900 mb-2">No videos yet</h3>
            <p className="text-slate-500 mb-4">Create your first educational video by going to the Generate section.</p>
          </div>
        )}
      </div>
    </div>
  );
}
