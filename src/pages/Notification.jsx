import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserCheck, Inbox, UserPlus } from "lucide-react";
import api from "../api/api";

const Notification = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: () => api.get("/user/getFriendRequests").then((res) => res.data),
  });

  const pending = data?.pending || [];
  const accepted = data?.accepted || [];

  const { mutate: acceptRequest, isPending } = useMutation({
    mutationFn: (id) => api.put(`/user/acceptfriend/${id}/accept`),

    onMutate: async (senderId) => {
      await queryClient.cancelQueries(["friendRequests"]);
      const prev = queryClient.getQueryData(["friendRequests"]);

      queryClient.setQueryData(["friendRequests"], (old) => {
        if (!old) return old;

        const moved = old.pending.find((r) => r.sender._id === senderId);

        return {
          pending: old.pending.filter((r) => r.sender._id !== senderId),
          accepted: moved ? [moved, ...old.accepted] : old.accepted, // Pushed to front of list
        };
      });

      return { prev };
    },

    onError: (_e, _id, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(["friendRequests"], ctx.prev);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries(["friendRequests"]);
      queryClient.invalidateQueries(["friends"]);
      queryClient.invalidateQueries(["recommended"]);
    },
  });

  // Premium Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="flex animate-pulse items-center gap-3.5 rounded-2xl border border-zinc-800/80 bg-zinc-900/90 px-5 py-3.5 shadow-xl shadow-black/40 backdrop-blur-md">
          <div className="loading loading-spinner loading-md text-emerald-500" />
          <span className="text-sm font-medium tracking-wide text-zinc-300">
            Loading notifications...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      
      {/* PENDING REQUESTS SECTION */}
      <section className="flex flex-col rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
              Friend Requests
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Review and accept pending connections.
            </p>
          </div>
          {pending.length > 0 && (
            <span className="flex h-7 min-w-[28px] items-center justify-center rounded-full bg-emerald-500/10 px-2.5 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/30">
              {pending.length} New
            </span>
          )}
        </div>

        {pending.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-800/60 bg-zinc-900/20 px-6 py-12 text-center sm:py-16">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800/50 ring-4 ring-zinc-900/50">
              <Inbox className="h-6 w-6 text-zinc-500" />
            </div>
            <h3 className="text-base font-semibold text-zinc-300">No pending requests</h3>
            <p className="mt-1 text-sm text-zinc-500">You're all caught up!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {pending.map((req) => (
              <div
                key={req._id}
                className="group flex flex-col gap-4 rounded-xl border border-zinc-800/80 bg-zinc-900/80 p-4 shadow-md transition-all duration-300 hover:border-zinc-700 hover:shadow-lg sm:p-5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="avatar shrink-0">
                    <div className="h-12 w-12 rounded-full bg-zinc-800 ring-2 ring-transparent transition-all group-hover:ring-zinc-600">
                      <img
                        src={req.sender.profilePicture || "/default-profile.png"}
                        alt={req.sender.fullname}
                        loading="lazy"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-zinc-100 transition-colors group-hover:text-white">
                      {req.sender.fullname}
                    </h3>
                    <p className="truncate text-sm text-zinc-400">
                      {req.sender.location || "Unknown Location"}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-2">
                  <button
                    onClick={() => acceptRequest(req.sender._id)}
                    disabled={isPending}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all duration-200 hover:bg-emerald-500 active:scale-95 disabled:opacity-60"
                  >
                    <UserPlus size={18} />
                    Accept Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ACCEPTED CONNECTIONS SECTION */}
      <section className="flex flex-col rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
            Recently Accepted
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Your newest teammates and connections.
          </p>
        </div>

        {accepted.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-800/60 bg-zinc-900/20 px-6 py-10 text-center">
            <UserCheck className="mb-2 h-8 w-8 text-zinc-600" />
            <p className="text-sm text-zinc-500">No recently accepted connections.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {accepted.map((req) => (
              <div
                key={req._id}
                className="flex items-center gap-3.5 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4 transition-colors hover:border-zinc-700/60 hover:bg-zinc-900/60"
              >
                <div className="avatar shrink-0">
                  <div className="h-10 w-10 rounded-full bg-zinc-800 ring-1 ring-zinc-700">
                    <img
                      src={req.sender.profilePicture || "/default-profile.png"}
                      alt={req.sender.fullname}
                      loading="lazy"
                      className="object-cover opacity-90"
                    />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-zinc-200">
                    {req.sender.fullname}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
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