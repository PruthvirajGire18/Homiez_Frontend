import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Bell, Info } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  // We define an array to map over, keeping our JSX clean and DRY
  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/friends", label: "Friends", icon: Users },
    { path: "/notifications", label: "Notifications", icon: Bell },
    { path: "/about", label: "About", icon: Info },
  ];

  return (
    <aside className="fixed bottom-0 left-0 z-40 flex w-full flex-row justify-around border-t border-zinc-800/80 bg-zinc-950/90 pb-safe backdrop-blur-lg transition-all md:relative md:h-[100dvh] md:w-64 md:shrink-0 md:flex-col md:justify-start md:border-r md:border-t-0 md:bg-zinc-950 md:pb-0 md:backdrop-blur-none lg:w-72">
      
      {/* HEADER: Hidden on mobile, visible on desktop */}
      <div className="hidden border-b border-zinc-800/80 px-6 py-6 md:block">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-zinc-100 transition-colors hover:text-white"
        >
          Homiez
        </Link>
        <p className="mt-1 text-xs text-zinc-500">Team communication hub</p>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex w-full flex-row items-center justify-around px-2 py-2 md:mt-4 md:flex-1 md:flex-col md:items-stretch md:justify-start md:space-y-1 md:px-4 md:py-0">
        {navLinks.map(({ path, label, icon: Icon }) => {
          const isActive = currentPath === path;
          
          return (
            <Link 
              key={path} 
              to={path} 
              className={`
                group flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs font-medium transition-all duration-200 
                md:flex-none md:flex-row md:justify-start md:gap-3 md:px-3 md:py-2.5 md:text-sm
                ${isActive 
                  ? "text-zinc-100 md:bg-zinc-800 md:shadow-sm md:shadow-black/30" 
                  : "text-zinc-500 hover:text-zinc-200 active:scale-95 md:text-zinc-400 md:hover:bg-zinc-900 md:hover:text-zinc-100 md:active:scale-100"
                }
              `}
            >
              <Icon 
                size={20} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={`transition-transform duration-200 ${isActive ? "text-primary md:text-zinc-100" : "group-hover:scale-110"}`} 
              />
              <span className={`md:block ${isActive ? "font-semibold" : "font-medium"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* USER PROFILE CARD: Hidden on mobile (handled by Navbar), visible on desktop */}
      <div className="hidden border-t border-zinc-800/80 px-4 py-4 md:block">
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-3 transition-colors hover:border-zinc-700 hover:bg-zinc-800/50">
          <div className="avatar shrink-0">
            <div className="h-10 w-10 rounded-full ring-1 ring-zinc-700/80 ring-offset-2 ring-offset-zinc-900">
              <img
                src={authUser?.profilePicture || "/default-profile.png"}
                alt={authUser?.fullname || "Profile"}
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-100">
              {authUser?.fullname || "Guest"}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;