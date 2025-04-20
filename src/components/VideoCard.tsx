import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDuration } from "@/lib/utils";
// import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
// import { Video } from "@shared/schema";
import axios from "axios";
import { Progress } from "@/components/ui/progress"



export function VideoCard({ video, onPlay, progress }: any) {
//   const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const handleDownload = async (publicUrl:string,fileName:string) => {
    try {
      setIsDownloading(true);
      
      const response = await axios.get(publicUrl, { responseType: 'blob' }  );
      
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    //   toast({
    //     title: "Download started",
    //     description: "Your video will be downloaded shortly.",
    //   });
    } catch (error) {
    //   toast({
    //     title: "Download failed",
    //     description: "There was an error downloading the video.",
    //     variant: "destructive",
    //   });
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <Card className="hover:shadow-md transition-shadow py-0">
      <CardContent className="p-0">
        <div className="relative rounded-t-lg overflow-hidden h-60 bg-slate-200">
          {
            video.status === 'created' ? (
              <>
                <Progress 
                 value={progress} 
                 className="h-5 mt-30"
                />
                <div className="flex items-center justify-center">
                <p className="text-gray-500 text-sm">Video generation takes about 3-4 mins</p>

                </div>
              </>
             
                
            ) : (
              <>
              <div className="w-full h-full bg-gradient-to-r from-primary/10 to-primary/30 flex items-center justify-center">
                <video src={video.publicUrl}/>
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Button 
                  variant="default" 
                  size="icon" 
                  className="h-12 w-12 rounded-full bg-primary/90 hover:bg-primary"
                  onClick={onPlay}
                >
                  <Play className="h-6 w-6" />
                </Button>
              </div>
              </>
            )
          }
         
        
        </div>
        
        <div className="px-4 py-2">
          <h3 className="text-lg font-medium text-slate-900 mb-1">{video.scriptTitle}</h3>
          <p className="text-sm text-slate-500 mb-3">{formatDate(new Date(video.createdAt))}</p>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
              Duration : {formatDuration(Number(video.videoDuration))}
            </Badge>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={()=>handleDownload(video.publicUrl, video.fileName)}
              disabled={isDownloading}
            >
              <Download className="h-5 w-5 text-slate-500" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
