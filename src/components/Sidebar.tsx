import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
// import { useMobile } from "@/hooks/use-mobile";
import { PlusCircle, VideoIcon, Settings, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Sidebar() {
  const location = useLocation();
//   const { isMobile, isMenuOpen, setIsMenuOpen } = useMobile();

  return (
    <div 
      className={cn(
        "z-40 bg-white border-r border-slate-200 flex flex-col"
      )}
    >
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
        {(
          <div className="flex items-center flex-shrink-0 px-4 mb-6">
            <h1 className="text-xl font-bold text-slate-900">AI Video Generator</h1>
          </div>
        )}
        
        <nav className="flex-1 px-2 pb-4 space-y-1">
          <Link
            to="/"
            className={cn(
              "flex items-center px-2 py-2 text-sm font-medium rounded-md group",
              location.pathname === "/" 
                ? "bg-primary text-white" 
                : "text-slate-700 hover:bg-slate-100"
            )}
          >
            <PlusCircle className={cn(
              "mr-3 flex-shrink-0 h-5 w-5",
              location.pathname === "/" ? "" : "text-slate-500"
            )} />
            Generate
          </Link>
          
          <Link
            to="/videos"
            className={cn(
              "flex items-center px-2 py-2 text-sm font-medium rounded-md group",
              location.pathname === "/videos" 
                ? "bg-primary text-white" 
                : "text-slate-700 hover:bg-slate-100"
            )}
          >
            <VideoIcon className={cn(
              "mr-3 flex-shrink-0 h-5 w-5",
              location.pathname === "/videos" ? "" : "text-slate-500"
            )} />
            Videos
          </Link>
          
          <button className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100 group w-full text-left">
            <Settings className="mr-3 flex-shrink-0 h-5 w-5 text-slate-500" />
            Settings
          </button>
        </nav>
      </div>
      
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium text-slate-700">John Doe</p>
            <p className="text-xs font-medium text-slate-500">john@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
