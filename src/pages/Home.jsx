import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";
import NoFriendsFound from "./NoFriendsFound";
import FriendCard from "../components/FriendCard";

const Home = () => {
  const queryClient = useQueryClient();
  const [loadingId, setLoadingId] = useState(null);

  const { data: friends = [], isLoading: friendsLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: () => api.get("/user/friends").then((res) => res.data),
  });

  const { data: recommended = [], isLoading: recommendedLoading } = useQuery({
    queryKey: ["recommended"],
    queryFn: () => api.get("/user").then((res) => res.data),
  });

  const { data: outgoing = [] } = useQuery({
    queryKey: ["outgoing"],
    queryFn: () =>
      api.get("/user/outgoingFriendRequests").then((res) => res.data),
  });

  const outgoingIds = new Set(outgoing.map((r) => r.receiver._id));

  const { mutate: sendRequest } = useMutation({
    mutationFn: (id) => api.post(`/user/addfriend/${id}`),
    onMutate: (id) => setLoadingId(id), // Set loading state for specific button
    onSettled: () => setLoadingId(null), // Clear loading state when done
    onSuccess: () => {
      // Use object syntax for v5 compatibility and cleaner invalidation
      queryClient.invalidateQueries({ queryKey: ["outgoing"] });
    },
  });

  // Reusable Skeleton Component for better UX while loading
  const SkeletonCard = () => (
    <div className="flex h-full animate-pulse flex-col justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 rounded-full bg-zinc-800/80"></div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-24 rounded bg-zinc-800/80"></div>
          <div className="h-3 w-16 rounded bg-zinc-800/80"></div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-zinc-800/80"></div>
        <div className="h-3 w-4/5 rounded bg-zinc-800/80"></div>
      </div>
      <div className="mt-5 h-9 w-full rounded bg-zinc-800/80"></div>
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* FRIENDS SECTION */}
      <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 shadow-xl shadow-black/20 sm:p-5 md:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-zinc-100 sm:text-xl md:text-2xl">
              Your Friends
            </h2>
            <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
              People you are already connected with.
            </p>
          </div>
          <span className="badge badge-ghost border-zinc-700 bg-zinc-900 px-3 py-1 font-medium text-zinc-300">
            {friends.length} {friends.length === 1 ? 'Friend' : 'Friends'}
          </span>
        </div>

        {friendsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
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

      {/* RECOMMENDED USERS */}
      <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 shadow-xl shadow-black/20 sm:p-5 md:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-bold tracking-tight text-zinc-100 sm:text-xl md:text-2xl">
            People You May Know
          </h2>
          <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
            Suggested teammates based on your network.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recommendedLoading ? (
            // Show 3 skeletons while loading recommendations
            [1, 2, 3].map((i) => <SkeletonCard key={i} />)
          ) : recommended.length === 0 ? (
             <div className="py-8 text-center text-sm text-zinc-500">
               No new recommendations right now. Check back later!
             </div>
          ) : (
            recommended.map((user) => {
              const sent = outgoingIds.has(user._id);
              const isCurrentlyLoading = loadingId === user._id;

              return (
                <div
                  key={user._id}
                  className="flex h-full flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-black/30 sm:p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="avatar shrink-0">
                      <div className="h-12 w-12 rounded-full ring-1 ring-zinc-700">
                        <img
                          src={user.profilePicture || "/default-avatar.png"} // Added fallback
                          alt={user.fullname}
                          className="object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold text-zinc-100">
                        {user.fullname}
                      </h3>
                      <p className="truncate text-xs text-zinc-400">
                        {user.location || "Unknown Location"}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-2 text-xs text-zinc-400 sm:text-sm">
                    {user.bio || "No bio available."}
                  </p>

                  <button
                    disabled={sent || isCurrentlyLoading}
                    onClick={() => sendRequest(user._id)}
                    className={`btn btn-sm mt-4 w-full transition-all sm:btn-md ${
                      sent
                        ? "btn-disabled cursor-not-allowed border-zinc-700 bg-zinc-800/50 text-zinc-500"
                        : "btn-primary border-0 shadow-lg shadow-primary/20 hover:shadow-primary/40"
                    }`}
                  >
                    {isCurrentlyLoading ? (
                      <span className="loading loading-spinner loading-xs text-primary"></span>
                    ) : sent ? (
                      "Request Sent"
                    ) : (
                      "Add Friend"
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;