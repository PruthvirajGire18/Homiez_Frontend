import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, LogOut, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import api from "../api/api";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const navigate = useNavigate();
  const isChatPage = location.pathname.startsWith("/chat");
  const queryClient = useQueryClient();

  const { mutate: logout, isPending } = useMutation({
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      
      {/* LEFT SECTION - Holds space even if empty */}
      <div className="flex min-w-[100px] items-center gap-4">
        {/* You might want a mobile Hamburger menu icon here later! */}
        {isChatPage && (
          <Link
            to="/"
            className="text-lg font-bold tracking-tight text-zinc-100 transition-colors hover:text-white"
          >
            Homiez
          </Link>
        )}
      </div>

      {/* RIGHT SECTION - Actions & Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Notifications */}
        <Link
          to="/notifications"
          aria-label="Notifications"
          className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 active:scale-95"
        >
          <Bell className="h-5 w-5 transition-transform group-hover:scale-110" />
          {/* Optional: Add a notification dot indicator here if needed */}
        </Link>

        {/* Profile Avatar */}
        <div className="avatar shrink-0 cursor-pointer transition-transform hover:scale-105 active:scale-95">
          <div className="h-9 w-9 rounded-full ring-1 ring-zinc-700 ring-offset-2 ring-offset-zinc-950 transition-colors hover:ring-zinc-500">
            <img
              src={authUser?.profilePicture || "/default-profile.png"}
              alt={`${authUser?.fullname || "User"}'s Profile`}
              className="object-cover"
            />
          </div>
        </div>

        {/* About link */}
        <a
          href="/about"
          className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-all hover:bg-zinc-800/10 hover:text-zinc-100 active:scale-95"
          aria-label="About"
        >
          <span className="text-lg font-medium">i</span>
        </a>

        {/* Divider line for visual hierarchy */}
        <div className="h-6 w-px bg-zinc-800/80" aria-hidden="true" />

        {/* Logout */}
        <button
          onClick={() => logout()}
          disabled={isPending}
          aria-label="Logout"
          className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-all hover:bg-red-500/10 hover:text-red-400 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin text-red-400" />
          ) : (
            <LogOut className="h-5 w-5 transition-transform group-hover:scale-110" />
          )}
        </button>
        
      </div>
    </header>
  );
};

export default Navbar;