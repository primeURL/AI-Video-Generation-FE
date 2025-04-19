import axios from 'axios';


export const ApiService = {
  // Videos endpoints
  getVideos: async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/get-all-videos`);
    return response.data;
  },
  
  getVideo: async (videoId : string) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/get-video/${videoId}`);
    return response.data;
  },

  generateVideo: async (data: {
    title: string;
    content: string;
    type: "script" | "topic";
    password : string
  }) => {
    console.log("Generating video with data:", data);
    // console.log("Backend URL:", process.env.VITE_BACKEND_URL);
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/generate-video`, data);
    return response.data;
  },
};