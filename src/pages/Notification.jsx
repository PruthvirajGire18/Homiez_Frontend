import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserCheck, Inbox, UserPlus, Loader2 } from "lucide-react";
import api from "../api/api";

const Notification = () => {
  const queryClient = useQueryClient();
  const [acceptingId, setAcceptingId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: () => api.get("/user/getFriendRequests").then((res) => res.data),
  });

  const pending = data?.pending || [];
  const accepted = data?.accepted || [];

  const { mutate: acceptRequest } = useMutation({
    mutationFn: (id) => api.put(`/user/acceptfriend/${id}/accept`),

    onMutate: async (senderId) => {
      setAcceptingId(senderId); // Set targeted loading state
      await queryClient.cancelQueries({ queryKey: ["friendRequests"] });
      const prev = queryClient.getQueryData({ queryKey: ["friendRequests"] });

      queryClient.setQueryData({ queryKey: ["friendRequests"] }, (old) => {
        if (!old) return old;
        const moved = old.pending.find((r) => r.sender._id === senderId);
        return {
          pending: old.pending.filter((r) => r.sender._id !== senderId),
          accepted: moved ? [moved, ...old.accepted] : old.accepted,
        };
      });

      return { prev };
    },

    onError: (_e, _id, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData({ queryKey: ["friendRequests"] }, ctx.prev);
      }
    },

    onSettled: () => {
      setAcceptingId(null); // Clear loading state
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["recommended"] });
    },
  });

  // Reusable Skeleton for premium loading UX
  const SkeletonCard = () => (
    <div className="flex animate-pulse flex-col gap-4 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 sm:p-5">
      <div className="flex items-center gap-3.5">
        <div className="h-12 w-12 shrink-0 rounded-full bg-zinc-800/80"></div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-24 rounded bg-zinc-800/80"></div>
          <div className="h-3 w-16 rounded bg-zinc-800/80"></div>
        </div>
      </div>
      <div className="mt-auto pt-2">
        <div className="h-11 w-full rounded-lg bg-zinc-800/80"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      
      {/* PENDING REQUESTS SECTION */}
      <section className="flex flex-col rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-4 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-100 sm:text-2xl">
              Friend Requests
            </h1>
            <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
              Review and accept pending connections.
            </p>
          </div>
          {pending.length > 0 && !isLoading && (
            <span className="flex h-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 px-3 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/30">
              {pending.length} New
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : pending.length === 0 ? (
          <div className="group flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-800/60 bg-zinc-900/20 px-4 py-10 text-center transition-colors hover:border-zinc-700/60 hover:bg-zinc-900/40 sm:px-6 sm:py-16">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800/50 ring-4 ring-zinc-900/50 transition-transform duration-300 group-hover:scale-105">
              <Inbox className="h-6 w-6 text-zinc-500 transition-colors group-hover:text-zinc-400" />
            </div>
            <h3 className="text-base font-semibold text-zinc-300">No pending requests</h3>
            <p className="mt-1 max-w-[250px] text-xs text-zinc-500 sm:text-sm">You're all caught up! Share your profile to get more connections.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {pending.map((req) => {
              const isCurrentlyAccepting = acceptingId === req.sender._id;

              return (
                <div
                  key={req._id}
                  className="group flex flex-col justify-between gap-4 rounded-xl border border-zinc-800/80 bg-zinc-900/80 p-4 shadow-md transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800/50 hover:shadow-lg sm:p-5"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="avatar shrink-0">
                      <div className="h-12 w-12 rounded-full ring-2 ring-transparent transition-all group-hover:ring-zinc-600">
                        <img
                          src={req.sender.profilePicture || "/default-profile.png"}
                          alt={req.sender.fullname}
                          loading="lazy"
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold text-zinc-100 transition-colors group-hover:text-white">
                        {req.sender.fullname}
                      </h3>
                      <p className="truncate text-xs text-zinc-400 sm:text-sm">
                        {req.sender.location || "Unknown Location"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto pt-2">
                    <button
                      onClick={() => acceptRequest(req.sender._id)}
                      disabled={isCurrentlyAccepting}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all duration-200 hover:bg-emerald-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none"
                    >
                      {isCurrentlyAccepting ? (
                        <>
                          <Loader2 size={18} className="animate-spin text-emerald-500" />
                          <span>Accepting...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={18} />
                          <span>Accept Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ACCEPTED CONNECTIONS SECTION */}
      <section className="flex flex-col rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-4 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold tracking-tight text-zinc-100 sm:text-2xl">
            Recently Accepted
          </h2>
          <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
            Your newest teammates and connections.
          </p>
        </div>

        {/* Hide this section while loading initially to prevent UI jumping */}
        {!isLoading && accepted.length === 0 ? (
          <div className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-800/60 bg-zinc-900/20 px-4 py-10 text-center transition-colors hover:border-zinc-700/60 hover:bg-zinc-900/40">
            <UserCheck className="mb-2 h-8 w-8 text-zinc-600 transition-colors group-hover:text-zinc-500" />
            <p className="text-xs text-zinc-500 sm:text-sm">No recently accepted connections.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {accepted.map((req) => (
              <div
                key={req._id}
                className="flex items-center gap-3.5 rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-3.5 transition-colors hover:border-zinc-700/60 hover:bg-zinc-800/60 sm:p-4"
              >
                <div className="avatar shrink-0">
                  <div className="h-10 w-10 rounded-full ring-1 ring-zinc-700">
                    <img
                      src={req.sender.profilePicture || "/default-profile.png"}
                      alt={req.sender.fullname}
                      loading="lazy"
                      className="object-cover opacity-90"
                    />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-zinc-200 sm:text-base">
                    {req.sender.fullname}
                  </h3>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                    <UserCheck size={14} />
                    <span>Connected</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      
    </div>
  );
};

export default Notification;