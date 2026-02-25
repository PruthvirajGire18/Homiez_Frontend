import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import useAuthUser from "../hooks/useAuthUser";

const Layout = ({ children, showSidebar = true }) => {
  const { isLoading } = useAuthUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-300 grid place-items-center">
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 shadow-lg shadow-black/30">
          <span className="loading loading-spinner loading-sm text-primary" />
          <span className="text-sm font-medium">Loading workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      {showSidebar && <Sidebar />}
      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
