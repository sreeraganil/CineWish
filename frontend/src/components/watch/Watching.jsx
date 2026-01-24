import { useEffect } from "react";
import watchStore from "../../store/watchStore";
import ContinueWatching from "./ContinueWatching";

const Watching = () => {
  const {
    continueWatching,
    loading,
    fetchWatchProgress, // ✅ get the action
    removeFromHistory,
  } = watchStore();

  // ✅ CALL THE FETCH ONCE
  useEffect(() => {
    fetchWatchProgress();
  }, [fetchWatchProgress]);

  if (loading || !continueWatching.length) return null;

  return (
    <div className="bg-gray-950 pt-8 px-4 text-white relative">
      <div className="max-w-7xl mx-auto">
        <ContinueWatching
          items={continueWatching.slice(0, 5)}
          onRemove={removeFromHistory}
        />
      </div>
    </div>
  );
};

export default Watching;
