import { Video, Loader2 } from "lucide-react";

const CallButton = ({ handleVideoCall, isLoading = false, disabled = false }) => {
  return (
    <button
      onClick={handleVideoCall}
      disabled={disabled || isLoading}
      aria-label={isLoading ? "Connecting video call" : "Start video call"}
      aria-busy={isLoading}
      className={`
        group inline-flex w-full items-center justify-center gap-2.5 rounded-full 
        h-12 px-6 sm:h-11 sm:w-auto sm:justify-start
        border border-emerald-500/40 bg-emerald-600 text-sm font-semibold text-white 
        shadow-md shadow-emerald-900/20 transition-all duration-200 ease-in-out 
        hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-900/30 
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 
        active:scale-95 
        disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none
      `}
    >
      {isLoading ? (
        <Loader2 
          size={18} 
          strokeWidth={2.5} 
          className="animate-spin text-emerald-400 disabled:text-zinc-500" 
        />
      ) : (
        <Video 
          size={18} 
          strokeWidth={2.5}
          className="transition-transform duration-200 group-hover:scale-110" 
        />
      )}
      <span>{isLoading ? "Connecting..." : "Start call"}</span>
    </button>
  );
};

export default CallButton;