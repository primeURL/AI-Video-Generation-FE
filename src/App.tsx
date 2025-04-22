import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import { VideoModal } from "./components/VideoModal";
import GeneratePage from "./pages/GeneratePage";
import VideosPage from "./pages/VideosPage";
import { useVideoContext } from "./lib/VideoContext";


export default function App() {
  const { selectedVideo } = useVideoContext();
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* <MobileHeader /> */}
        <main className="flex-1 relative z-0 overflow-y-auto pt-2 pb-6 md:pt-6 focus:outline-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <Routes>
              <Route path="/" Component={GeneratePage} />
              <Route path="/videos" Component={VideosPage} />
            </Routes>
          </div>
        </main>
      </div>
      {selectedVideo && <VideoModal /> }
     
    </div>
  );
}
