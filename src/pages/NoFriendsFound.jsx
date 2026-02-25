import React from "react";
import { Users } from "lucide-react";

const NoFriendsFound = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-800/80 bg-zinc-900/20 px-6 py-12 text-center transition-colors hover:border-zinc-700/60 hover:bg-zinc-900/40 sm:px-8 sm:py-16">
      
      {/* Visual Anchor */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800/50 ring-4 ring-zinc-900/50 sm:h-20 sm:w-20">
        <Users className="h-8 w-8 text-zinc-500 sm:h-10 sm:w-10" />
      </div>

      {/* Text Content */}
      <h3 className="mb-2 text-lg font-semibold tracking-tight text-zinc-200 sm:text-xl">
        No friends yet
      </h3>
      <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
        Your network is currently empty. Browse the recommended users below to start collaborating and building your team.
      </p>
      
    </div>
  );
};

export default NoFriendsFound;