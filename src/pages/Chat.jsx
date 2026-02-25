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

  /* ------------------ GET STREAM TOKEN ------------------ */
  const { data: tokenData, isLoading } = useQuery({
    queryKey: ["streamToken", authUser?._id],
    enabled: !!authUser,
    queryFn: async () => {
      const res = await api.get("/chat/token");
      return res.data;
    },
  });

  /* ------------------ INIT STREAM CHAT ------------------ */
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

  /* ------------------ VIDEO CALL ------------------ */
  const handleVideoCall = async () => {
    if (!channel) {
      toast.error("Failed to start video call");
      return;
    }

    const callUrl = `${window.location.origin}/call/${channel.id}`;

    await channel.sendMessage({
      text: `📞 I have started a video call. Join here:\n${callUrl}`,
    });

    toast.success("Video call started");
  };

  /* ------------------ LOADING ------------------ */
  if (isLoading || !chatClient || !channel) {
    return (
      <div className="flex items-center justify-center h-screen text-zinc-200">
        Loading chat...
      </div>
    );
  }

  /* ------------------ UI ------------------ */
  return (
    <div className="h-screen bg-zinc-900">
      <StreamChatUI client={chatClient} theme="messaging dark">
       <Channel channel={channel}>
  <Window>
    <div className="relative">
      <ChannelHeader />

      {/* Video Call Button – Top Right */}
      <div className="absolute top-2 right-3 z-50">
        <CallButton handleVideoCall={handleVideoCall} />
      </div>
    </div>

    <MessageList />
    <MessageInput focus />
  </Window>

  <Thread />
</Channel>
      </StreamChatUI>
    </div>
  );
};

export default Chat;