import { useQuery } from "@tanstack/react-query";
import api from "../api/api";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "./NoFriendsFound";

const Friends = () => {
  const {
    data: friends = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: () => api.get("/user/friends").then((res) => res.data),
  });

  // Skeleton same Home jaisa UX ke liye
  const SkeletonCard = () => (
    <div className="flex h-full animate-pulse flex-col justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-zinc-800/80"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-24 rounded bg-zinc-800/80"></div>
          <div className="h-3 w-16 rounded bg-zinc-800/80"></div>
        </div>
      </div>
      <div className="mt-4 h-9 w-full rounded bg-zinc-800/80"></div>
    </div>
  );

  return (
    <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 shadow-xl shadow-black/20 sm:p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 sm:text-xl md:text-2xl">
            Your Friends
          </h2>
          <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
            All your connected friends
          </p>
        </div>

        <span className="badge badge-ghost border-zinc-700 bg-zinc-900 px-3 py-1 text-zinc-300">
          {friends.length} {friends.length === 1 ? "Friend" : "Friends"}
        </span>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : isError ? (
        <p className="text-center text-red-500">
          Unable to fetch friends. Please try again later.
        </p>
      ) : friends.length === 0 ? (
        <NoFriendsFound />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {friends.map((friend) => (
            <FriendCard key={friend._id} friend={friend} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Friends;