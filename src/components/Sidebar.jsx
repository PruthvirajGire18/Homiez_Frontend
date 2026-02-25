import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Bell, X } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";

const Sidebar = ({ onClose }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const linkClasses = (path) =>
    `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
      currentPath === path
        ? "bg-zinc-800 text-zinc-100 shadow-sm"
        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
    }`;

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-950 lg:bg-zinc-950">
      <div className="border-b border-zinc-800/80 px-6 py-6">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-semibold tracking-tight text-zinc-100 transition-colors hover:text-white"
            onClick={onClose}
          >
            Kollabb
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle text-zinc-400 hover:text-zinc-100 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-zinc-500">Team communication hub</p>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        <Link to="/" className={linkClasses("/")} onClick={onClose}>
          <Home size={18} />
          Home
        </Link>

        <Link to="/friends" className={linkClasses("/friends")} onClick={onClose}>
          <Users size={18} />
          Friends
        </Link>

        <Link to="/notifications" className={linkClasses("/notifications")} onClick={onClose}>
          <Bell size={18} />
          Notifications
        </Link>
      </nav>

      <div className="border-t border-zinc-800/80 px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg border border-zinc-800/80 bg-zinc-900/70 p-3">
          <div className="avatar">
            <div className="h-10 w-10 rounded-full">
              <img
                src={authUser?.profilePicture || "/default-profile.png"}
                alt="Profile"
                className="object-cover"
              />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-100">
              {authUser?.fullname || "Guest"}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs text-emerald-400">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              Online
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
