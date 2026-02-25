import React from 'react'
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import api from '../api/api';
import { useEffect } from 'react';
import {
  Call,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css"
import toast from 'react-hot-toast';

const STREAM_API_KEY=import.meta.env.VITE_STREAM_API_KEY;

const Video = () => {
  const {id:callId}=useParams();
  const [client,setClient]=useState(null);
  const [call,setCall]=useState(null);
  const [isConnecting,setIsConnecting]=useState(true);
  const {authUser,loading}=useAuthUser();
  
  const {data:tokenData,isLoading}=useQuery({
    queryKey:["streamToken"],
    queryFn:async()=>{
      const res=await api.get("/chat/token");
      return res.data;
    },
    enabled:!! authUser
  });
  useEffect(()=>{
    const inItCall=async()=>{
      if(!tokenData || !tokenData.token || !authUser || !callId) return;
      try {
        console.log("Initializing call...");
        const user={
          id:authUser._id,
          name:authUser.name,
          image:authUser.profilePicture
        }
        const videoClient=new StreamVideoClient({
          apiKey:STREAM_API_KEY,
          user,
          token:tokenData.token,
        })
        const callInstance=videoClient.call("default",callId);
        await callInstance.join({create:true})
        console.log("Joined call successfully");
        setClient(videoClient);
        setCall(callInstance);
        setIsConnecting(false);
        
      } catch (error) {
        toast.error("Failed to initialize call");
        console.error(error);
      }
    }
    inItCall();
  },[tokenData,authUser,callId])
  if(isLoading || isConnecting){
    return (
      <div className="flex items-center justify-center h-screen text-zinc-200">
        Loading call...
      </div>
    );
  }
  return (
   <>
    <div>
      {client && call?(
        <StreamVideo client={client}>
          <StreamCall call={call}>
              <CallContent/>
          </StreamCall>
        </StreamVideo>
      ):(
        <p>Call not found.</p>
      )}
    </div>
   </>
  )
}
const CallContent=()=>{
  const {useCallCallingState}=useCallStateHooks();
  const callingState=useCallCallingState();
  const navigate=useNavigate();
  if(callingState===CallingState.LEFT) return navigate("/");
  return (
    <StreamTheme>
      <SpeakerLayout/>
        <CallControls/>
    </StreamTheme>
  )
}

export default Video
