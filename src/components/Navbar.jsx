import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import api from "../api/api";

const Navbar = ({ onMenuClick }) => {
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
    <header className="sticky top-0 z-30 h-16 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="btn btn-ghost btn-sm btn-circle text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          {isChatPage && (
            <Link
              to="/"
              className="text-lg font-semibold tracking-tight text-zinc-100 transition-colors hover:text-white"
            >
              Kollabb
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

          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="avatar btn btn-ghost btn-sm btn-circle"
              aria-label="User menu"
            >
              <div className="h-8 w-8 rounded-full">
                <img
                  src={authUser?.profilePicture || "/default-profile.png"}
                  alt="Profile"
                  className="object-cover"
                />
              </div>
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-zinc-900 rounded-box z-[1] w-52 p-2 shadow-lg border border-zinc-800"
            >
              <li>
                <button
                  onClick={() => logout()}
                  disabled={isLoading}
                  className="text-red-400 hover:bg-red-950 hover:text-red-300"
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
