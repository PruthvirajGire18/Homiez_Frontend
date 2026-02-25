import React from "react";
import { Link } from "react-router-dom";

const FriendCard = ({ friend }) => {
  return (
    <div className="card border border-zinc-800 bg-zinc-900/80 text-zinc-100 shadow-lg shadow-black/20 transition-all duration-200 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/30">
      <div className="card-body p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="avatar">
            <div className="w-12 rounded-full ring-1 ring-zinc-700 ring-offset-2 ring-offset-zinc-900">
              <img
                src={friend.profilePicture}
                alt={friend.fullname}
                className="object-cover"
              />
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-zinc-100">
              {friend.fullname}
            </h3>
            <p className="truncate text-xs text-zinc-400">
              {friend.location || "Unknown Location"}
            </p>
          </div>
        </div>

        <div className="card-actions justify-end">
          <Link
            to={`/chat/${friend._id}`}
            className="btn btn-sm btn-primary px-4 normal-case"
          >
            Message
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FriendCard;