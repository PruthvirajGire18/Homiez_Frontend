import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import {
  Chat as StreamChatUI,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import { StreamChat } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";

import api from "../api/api";
import useAuthUser from "../hooks/useAuthUser";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const Chat = () => {
  const { id: targetUserId } = useParams();
  const { authUser } = useAuthUser();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);

  const { data: tokenData, isLoading } = useQuery({
    queryKey: ["streamToken", authUser?._id],
    enabled: !!authUser,
    queryFn: async () => {
      const res = await api.get("/chat/token");
      return res.data;
    },
  });

  useEffect(() => {
    if (!tokenData?.token || !authUser || !targetUserId) return;

    let client;

    const initChat = async () => {
      try {
        client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullname || authUser.name, // Fallback safety
            image: authUser.profilePicture,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");
        const chatChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await chatChannel.watch();

        setChatClient(client);
        setChannel(chatChannel);
      } catch (error) {
        console.error(error);
        toast.error("Failed to initialize secure chat.");
      }
    };

    initChat();

    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = async () => {
    if (!channel) {
      toast.error("Failed to start video call");
      return;
    }

    const callUrl = `${window.location.origin}/call/${channel.id}`;

    await channel.sendMessage({
      text: `I started a video call. Join here:\n${callUrl}`,
    });

    // You might want to actually navigate the caller to the call page immediately here!
    // navigate(`/call/${channel.id}`);
  };

  // Premium Loading State matches Layout.jsx
  if (isLoading || !chatClient || !channel) {
    return (
      <div className="flex h-full min-h-0 flex-1 items-center justify-center bg-zinc-950 px-4">
        <div className="flex animate-pulse items-center gap-3.5 rounded-2xl border border-zinc-800/80 bg-zinc-900/90 px-5 py-3.5 shadow-xl shadow-black/40 backdrop-blur-md">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm font-medium tracking-wide text-zinc-300">
            Connecting to secure chat...
          </span>
        </div>
      </div>
    );
  }

  return (
    // min-h-0 is absolutely crucial here to stop flex children from expanding beyond the screen when the mobile keyboard opens
    <div className="kollabb-chat flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-zinc-950 sm:rounded-xl sm:border sm:border-zinc-800/60 sm:shadow-2xl">
      <StreamChatUI client={chatClient} theme="messaging dark">
        <Channel channel={channel}>
          <Window>
            
            {/* Header Area */}
            <div className="relative flex w-full flex-col border-b border-zinc-800/80 bg-zinc-950/95">
              {/* Added responsive right padding to prevent Stream's text from hiding under our CallButton */}
              <div className="w-full pr-[140px] sm:pr-[160px]">
                <ChannelHeader />
              </div>
              
              {/* Call Button Container - perfectly centered vertically */}
              <div className="absolute right-3 top-1/2 z-20 -translate-y-1/2 sm:right-5">
                {/* Since we made CallButton w-full on mobile previously, we wrap it 
                  in a fixed width or w-auto container here so it doesn't break the absolute positioning 
                */}
                <div className="w-auto shadow-lg shadow-black/20 rounded-full">
                  <CallButton handleVideoCall={handleVideoCall} />
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex min-h-0 flex-1 flex-col bg-zinc-950/50">
              <MessageList />
              
              {/* Input Area - Added pb-4 for mobile bottom safe area */}
              <div className="border-t border-zinc-800/50 bg-zinc-950 p-2 pb-4 sm:p-4">
                <MessageInput focus />
              </div>
            </div>

          </Window>
          <Thread />
        </Channel>
      </StreamChatUI>
    </div>
  );
};

export default Chat;