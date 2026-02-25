import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import api from "../api/api";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const navigate = useNavigate();
  const isChatPage = location.pathname.startsWith("/chat");
  const queryClient = useQueryClient();

  const { mutate: logout, isLoading } = useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null);
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {isChatPage && (
            <Link
              to="/"
              className="text-lg font-semibold tracking-tight text-zinc-100 transition-colors hover:text-white"
            >
              Kollab
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="btn btn-ghost btn-sm btn-circle text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <Bell className="h-5 w-5" />
          </Link>

          <div className="avatar">
            <div className="h-9 w-9 rounded-full ring-1 ring-zinc-700/80 ring-offset-2 ring-offset-zinc-950">
              <img
                src={authUser?.profilePicture || "/default-profile.png"}
                alt="Profile"
                className="object-cover"
              />
            </div>
          </div>

          <button
            onClick={logout}
            disabled={isLoading}
            aria-label="Logout"
            className="btn btn-ghost btn-sm btn-circle text-zinc-400 hover:bg-zinc-800 hover:text-red-400 disabled:opacity-60"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
