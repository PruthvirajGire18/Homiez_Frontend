import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

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
            name: authUser.name,
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
        toast.error("Failed to initialize chat");
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

    toast.success("Video call started");
  };

  // Premium Loading State
  if (isLoading || !chatClient || !channel) {
    return (
      <div className="flex h-full min-h-0 flex-1 items-center justify-center bg-zinc-950 px-4">
        <div className="flex animate-pulse items-center gap-3.5 rounded-2xl border border-zinc-800/80 bg-zinc-900/90 px-5 py-3.5 shadow-xl shadow-black/40 backdrop-blur-md">
          <div className="loading loading-spinner loading-md text-emerald-500" />
          <span className="text-sm font-medium tracking-wide text-zinc-300">Connecting to secure chat...</span>
        </div>
      </div>
    );
  }

  return (
    // Flex-1 and overflow-hidden ensure the chat stays strictly within the viewport, crucial for mobile keyboards
    <div className="kollabb-chat flex h-full w-full flex-1 flex-col overflow-hidden bg-zinc-950 sm:rounded-xl sm:border sm:border-zinc-800/60 sm:shadow-2xl">
      <StreamChatUI client={chatClient} theme="messaging dark">
        <Channel channel={channel}>
          <Window>
            {/* Header Overlay Refactor */}
            <div className="relative flex w-full flex-col border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md supports-[backdrop-filter]:bg-zinc-950/80">
              {/* Padding right ensures Stream's header text doesn't slide under our custom button */}
              <div className="w-full pr-[110px] sm:pr-[130px]">
                <ChannelHeader />
              </div>
              
              {/* Call Button Container */}
              <div className="pointer-events-none absolute inset-y-0 right-3 z-20 flex items-center sm:right-5">
                <div className="pointer-events-auto transition-transform active:scale-95">
                  <CallButton handleVideoCall={handleVideoCall} />
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex min-h-0 flex-1 flex-col bg-zinc-950/50">
              <MessageList />
              <div className="border-t border-zinc-800/50 bg-zinc-950 p-2 sm:p-4">
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