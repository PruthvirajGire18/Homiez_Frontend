import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react"; // Assuming you have lucide-react installed

const FriendCard = ({ friend }) => {
  return (
    <div className="group flex h-full flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-black/30 sm:p-5">
      
      {/* PROFILE INFO */}
      <div className="flex items-center gap-3">
        <div className="avatar shrink-0">
          <div className="h-12 w-12 rounded-full ring-1 ring-zinc-700 ring-offset-2 ring-offset-zinc-900 transition-colors duration-300 group-hover:ring-zinc-500">
            <img
              src={friend.profilePicture || "/default-avatar.png"}
              alt={friend.fullname}
              className="object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-zinc-100 transition-colors group-hover:text-white">
            {friend.fullname}
          </h3>
          <p className="truncate text-xs text-zinc-400">
            {friend.location || "Unknown Location"}
          </p>
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div className="mt-4 flex sm:mt-5">
        <Link
          to={`/chat/${friend._id}`}
          className="btn btn-primary btn-sm flex w-full items-center justify-center gap-2 border-0 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 active:scale-95 sm:btn-md sm:w-full"
        >
          <MessageSquare size={16} className="shrink-0" />
          <span>Message</span>
        </Link>
      </div>
      
    </div>
  );
};

export default FriendCard;