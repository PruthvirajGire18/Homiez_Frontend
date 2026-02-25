import { Video } from "lucide-react";

const CallButton = ({ handleVideoCall }) => {
  return (
    <button
      onClick={handleVideoCall}
      className="flex items-center gap-1 px-3 py-1.5
                 bg-emerald-600 hover:bg-emerald-700
                 text-white text-xs font-semibold
                 rounded-full shadow-md"
    >
      <Video size={16} />
      Call
    </button>
  );
};

export default CallButton;