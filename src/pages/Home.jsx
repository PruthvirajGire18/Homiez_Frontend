import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";
import useAuthUser from "../hooks/useAuthUser";
import NoFriendsFound from "./NoFriendsFound";
import FriendCard from "../components/FriendCard";

const Home = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const { data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: () => api.get("/user/friends").then(res => res.data),
  });

  const { data: recommended = [] } = useQuery({
    queryKey: ["recommended"],
    queryFn: () => api.get("/user").then(res => res.data),
  });

  const { data: outgoing = [] } = useQuery({
    queryKey: ["outgoing"],
    queryFn: () =>
      api.get("/user/outgoingFriendRequests").then(res => res.data),
  });

  const outgoingIds = new Set(outgoing.map(r => r.receiver._id));

  const { mutate: sendRequest } = useMutation({
    mutationFn: (id) => api.post(`/user/addfriend/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["outgoing"]),
  });

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* FRIENDS SECTION */}
      <section className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 shadow-sm sm:p-6 lg:rounded-2xl lg:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100 sm:text-xl lg:text-2xl">
              Your Friends
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              People you are already connected with.
            </p>
          </div>
          <span className="badge badge-ghost border-zinc-700 bg-zinc-900 text-zinc-300 text-xs">
            {friends.length}
          </span>
        </div>

        {friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {friends.map(friend => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </section>

      {/* RECOMMENDED USERS */}
      <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-xl shadow-black/20 sm:p-6">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-zinc-100 sm:text-2xl">
            People You May Know
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Suggested teammates based on your network.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recommended.map(user => {
            const sent = outgoingIds.has(user._id);

            return (
              <div
                key={user._id}
                className="flex h-full flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/90 p-5 transition-all duration-200 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/30"
              >
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="h-12 w-12 rounded-full ring-1 ring-zinc-700">
                      <img
                        src={user.profilePicture}
                        alt={user.fullname}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-zinc-100">
                      {user.fullname}
                    </h3>
                    <p className="truncate text-xs text-zinc-400">
                      {user.location}
                    </p>
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 text-sm text-zinc-400">
                  {user.bio}
                </p>

                <button
                  disabled={sent}
                  onClick={() => sendRequest(user._id)}
                  className={`mt-4 btn btn-sm ${
                    sent
                      ? "btn-disabled cursor-not-allowed border-zinc-700 bg-zinc-800 text-zinc-400"
                      : "btn-primary border-0 shadow-lg shadow-primary/20"
                  }`}
                >
                  {sent ? "Request Sent" : "Add Friend"}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;