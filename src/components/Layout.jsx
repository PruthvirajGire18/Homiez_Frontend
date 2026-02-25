import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import useAuthUser from "../hooks/useAuthUser";

const Layout = ({ children, showSidebar = true }) => {
  const { isLoading } = useAuthUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-300 grid place-items-center">
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 shadow-lg shadow-black/30">
          <div className="loading loading-spinner loading-sm text-primary" />
          <span className="text-sm font-medium">Loading workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      {/* Mobile sidebar overlay */}
      {showSidebar && (
        <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      {showSidebar && (
        <div className="hidden lg:flex">
          <Sidebar />
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
