import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";

const Notification = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: () =>
      api.get("/user/getFriendRequests").then(res => res.data),
  });

  const pending = data?.pending || [];
  const accepted = data?.accepted || [];

  const { mutate: acceptRequest, isPending } = useMutation({
    mutationFn: (id) =>
      api.put(`/user/acceptfriend/${id}/accept`),

    onMutate: async (senderId) => {
      await queryClient.cancelQueries(["friendRequests"]);

      const prev = queryClient.getQueryData(["friendRequests"]);

      queryClient.setQueryData(["friendRequests"], old => {
        if (!old) return old;

        const moved = old.pending.find(
          r => r.sender._id === senderId
        );

        return {
          pending: old.pending.filter(
            r => r.sender._id !== senderId
          ),
          accepted: moved ? [...old.accepted, moved] : old.accepted,
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

  if (isLoading) {
    return (
      <div className="grid min-h-[40vh] place-items-center text-zinc-400">
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-3">
          <span className="loading loading-spinner loading-sm text-primary" />
          Loading notifications...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-xl shadow-black/20 sm:p-6">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-zinc-100 sm:text-2xl">
              Friend Requests
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Review and accept pending requests.
            </p>
          </div>
          <span className="badge badge-ghost border-zinc-700 bg-zinc-900 text-zinc-300">
            {pending.length} pending
          </span>
        </div>

        {pending.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/70 px-4 py-8 text-center text-sm text-zinc-400">
            No requests
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(req => (
              <div
                key={req._id}
                className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="avatar">
                    <div className="h-12 w-12 rounded-full ring-1 ring-zinc-700">
                      <img
                        src={req.sender.profilePicture}
                        alt={req.sender.fullname}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-zinc-100">
                      {req.sender.fullname}
                    </h3>
                    <p className="truncate text-sm text-zinc-400">
                      {req.sender.location}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => acceptRequest(req.sender._id)}
                  disabled={isPending}
                  className="btn btn-sm btn-primary border-0 px-5 normal-case shadow-lg shadow-primary/20"
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-xl shadow-black/20 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-zinc-100 sm:text-xl">
            Accepted
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Recent accepted connections.
          </p>
        </div>

        {accepted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/70 px-4 py-8 text-center text-sm text-zinc-400">
            No accepted yet
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {accepted.map(req => (
              <div
                key={req._id}
                className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/90 p-4"
              >
                <div className="avatar">
                  <div className="h-10 w-10 rounded-full ring-1 ring-zinc-700">
                    <img
                      src={req.sender.profilePicture}
                      alt={req.sender.fullname}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-zinc-100">
                    {req.sender.fullname}
                  </h3>
                  <p className="text-sm text-emerald-400">Friends connected</p>
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
