import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import api from "../api/api";
import { Loader2, VideoOff } from "lucide-react";
import toast from "react-hot-toast";

import {
  Call,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const Video = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  
  const { authUser } = useAuthUser();

  const { data: tokenData, isLoading } = useQuery({
    queryKey: ["streamToken", authUser?._id], // Added authUser._id for better cache invalidation
    queryFn: async () => {
      const res = await api.get("/chat/token");
      return res.data;
    },
    enabled: !!authUser,
  });

  useEffect(() => {
    let videoClient;

    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) return;
      
      try {
        const user = {
          id: authUser._id,
          name: authUser.fullname || authUser.name, // Added fallback
          image: authUser.profilePicture || "/default-profile.png",
        };

        videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });
        
        setClient(videoClient);
        setCall(callInstance);
        setIsConnecting(false);
      } catch (error) {
        toast.error("Failed to initialize secure connection");
        console.error(error);
        setIsConnecting(false); // Stop loading on error
      }
    };

    initCall();

    // CRITICAL: Cleanup function to release hardware (camera/mic) when the user navigates away
    return () => {
      if (videoClient) {
        videoClient.disconnectUser();
      }
    };
  }, [tokenData, authUser, callId]);

  // Premium Loading State
  if (isLoading || isConnecting) {
    return (
      <div className="flex h-[100dvh] w-full flex-col items-center justify-center bg-zinc-950 px-4">
        <div className="flex animate-pulse items-center gap-3.5 rounded-2xl border border-zinc-800/80 bg-zinc-900/90 px-6 py-4 shadow-xl shadow-black/40 backdrop-blur-md">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
          <span className="text-sm font-medium tracking-wide text-zinc-300">
            Connecting to secure video room...
          </span>
        </div>
      </div>
    );
  }

  // Error State / Call Not Found
  if (!client || !call) {
    return (
      <div className="flex h-[100dvh] w-full flex-col items-center justify-center bg-zinc-950 px-4">
        <div className="flex max-w-sm flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 ring-4 ring-red-500/20">
            <VideoOff className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-zinc-100">Call Unavailable</h2>
          <p className="mt-2 text-sm text-zinc-400">We couldn't connect you to this room. The link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  return (
    // h-[100dvh] and overflow-hidden strictly constrain the video to the screen boundaries
    <div className="kollabb-video-wrapper relative flex h-[100dvh] w-full flex-col overflow-hidden bg-zinc-950">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <CallContent />
        </StreamCall>
      </StreamVideo>
    </div>
  );
};

// Extracted Call Content Component
const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  // Safely handle navigation outside of the render cycle
  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/"); // Adjust route if needed, e.g., back to the chat room
    }
  }, [callingState, navigate]);

  if (callingState === CallingState.LEFT) {
    return null; // Don't render UI while navigating away
  }

  return (
    <StreamTheme className="flex h-full w-full flex-col">
      <SpeakerLayout />
      {/* Stream's CallControls come with built-in responsive styling, but placing them inside a flexible theme wrapper ensures they stay anchored to the bottom */}
      <CallControls />
    </StreamTheme>
  );
};

export default Video;