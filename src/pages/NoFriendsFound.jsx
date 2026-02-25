import React from "react";
import { Users } from "lucide-react";

const NoFriendsFound = () => {
  return (
    <div className="group flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-800/80 bg-zinc-900/20 px-4 py-10 text-center transition-all duration-300 hover:border-zinc-700/60 hover:bg-zinc-900/40 sm:px-8 sm:py-16">
      
      {/* Visual Anchor with Hover Pop */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800/50 ring-4 ring-zinc-900/50 transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20">
        <Users className="h-8 w-8 text-zinc-500 transition-colors duration-300 group-hover:text-zinc-400 sm:h-10 sm:w-10" />
      </div>

      {/* Text Content */}
      <h3 className="mb-2 text-base font-semibold tracking-tight text-zinc-200 sm:text-lg">
        No friends yet
      </h3>
      <p className="max-w-[260px] text-xs leading-relaxed text-zinc-400 sm:max-w-sm sm:text-sm">
        Your network is currently empty. Browse the recommended users below to start collaborating and building your team.
      </p>
      
    </div>
  );
};

export default NoFriendsFound;