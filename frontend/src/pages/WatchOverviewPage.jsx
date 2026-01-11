import { useEffect, useState } from "react";
import ContinueWatching from "../components/watch/ContinueWatching";
import WatchHistory from "../components/watch/WatchHistory";
import watchStore from "../store/watchStore";

const WatchOverviewPage = () => {
  const {
    continueWatching,
    history,
    loading,
    fetchWatchProgress,
    removeFromContinueWatching,
  } = watchStore();

  useEffect(() => {
    fetchWatchProgress();
  }, [fetchWatchProgress]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-8 text-teal-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8">
      <ContinueWatching
        items={continueWatching}
        onRemove={removeFromContinueWatching}
      />
      <WatchHistory items={history} />
    </div>
  );
};

export default WatchOverviewPage;
