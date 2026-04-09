import { useEffect } from "react";
import watchStore from "../../store/watchStore";
import ContinueWatching from "./ContinueWatching";
import userStore from "../../store/userStore";

const Watching = () => {
  const { continueWatching, loading, fetchContinueWatching, removeFromHistory } =
    watchStore();

  const { user } = userStore();

  useEffect(() => {
    user && fetchContinueWatching();
  }, [fetchContinueWatching]);

  if (loading || !continueWatching.length) return null;

  return (
    <div className="bg-gray-950 px-2 sm:px-4 text-white relative">
      <div className="max-w-8xl mx-auto">
        <ContinueWatching
          items={continueWatching.slice(0, 5)}
          onRemove={removeFromHistory}
        />
      </div>
    </div>
  );
};

export default Watching;
