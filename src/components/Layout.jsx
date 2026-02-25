import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import useAuthUser from "../hooks/useAuthUser";
import { Loader2 } from "lucide-react"; // Assuming you have lucide-react

const Layout = ({ children, showSidebar = true }) => {
  const { isLoading } = useAuthUser();

  if (isLoading) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-zinc-950 text-zinc-300">
        <div className="flex animate-pulse items-center gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/80 px-5 py-3.5 shadow-xl shadow-black/40 backdrop-blur-sm">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm font-medium tracking-wide">Loading workspace...</span>
        </div>
      </div>
    );
  }

  return (
    // h-[100dvh] prevents mobile browser URL bar issues
    <div className="flex h-[100dvh] w-full overflow-hidden bg-zinc-950 text-zinc-100">
      
      {/* Note: Ensure your <Sidebar /> component has mobile logic built-in 
        (e.g., hidden on mobile, or absolute positioned with a toggle) 
        so it doesn't squish the main content on small screens.
      */}
      {showSidebar && <Sidebar />}

      {/* min-w-0 is crucial here to prevent flex children from overflowing the screen width */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        
        {/* Strictly constrain scrolling to the main content area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth px-4 pb-12 pt-5 sm:px-6 sm:pb-8 sm:pt-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
};

export default Layout;