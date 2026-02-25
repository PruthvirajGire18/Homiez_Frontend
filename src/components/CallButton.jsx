import { Video } from "lucide-react";

const CallButton = ({ handleVideoCall, isLoading = false, disabled = false }) => {
  return (
    <button
      onClick={handleVideoCall}
      disabled={disabled || isLoading}
      aria-label="Start video call"
      className="group inline-flex h-11 items-center gap-2.5 rounded-full border border-emerald-500/40 bg-emerald-600 px-6 text-sm font-semibold text-white shadow-md shadow-emerald-900/20 transition-all duration-200 ease-in-out hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-900/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Video 
        size={18} 
        strokeWidth={2.5}
        className={`transition-transform duration-200 ${isLoading ? 'animate-pulse' : 'group-hover:scale-110'}`} 
      />
      <span>{isLoading ? "Connecting..." : "Start call"}</span>
    </button>
  );
};

export default CallButton;