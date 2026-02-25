import React from "react";
import { Link } from "react-router-dom";

const FriendCard = ({ friend }) => {
  return (
    <div className="card group flex h-full border border-zinc-800 bg-zinc-900/80 text-zinc-100 shadow-lg shadow-black/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/40">
      <div className="card-body flex h-full flex-col p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="avatar">
            {/* Added bg-zinc-800 as an image loading fallback */}
            <div className="w-12 shrink-0 rounded-full bg-zinc-800 ring-1 ring-zinc-700 ring-offset-2 ring-offset-zinc-900 transition-colors duration-300 group-hover:ring-zinc-500">
              <img
                src={friend.profilePicture}
                alt={friend.fullname}
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* flex-1 ensures it pushes against the edges for proper truncation */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-zinc-100 transition-colors group-hover:text-white">
              {friend.fullname}
            </h3>
            <p className="truncate text-xs text-zinc-400 sm:text-sm">
              {friend.location || "Unknown Location"}
            </p>
          </div>
        </div>

        {/* mt-auto pushes the button to the bottom if card heights vary in a grid */}
        <div className="card-actions mt-auto justify-end">
          <Link
            to={`/chat/${friend._id}`}
            className="btn btn-primary flex h-11 min-h-[44px] w-full items-center justify-center rounded-lg px-6 text-sm font-medium normal-case transition-all active:scale-95 sm:w-auto"
          >
            Message
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FriendCard;