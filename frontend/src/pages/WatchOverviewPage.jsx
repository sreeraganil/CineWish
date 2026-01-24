import { useEffect, useState } from "react";
import ContinueWatching from "../components/watch/ContinueWatching";
import WatchHistory from "../components/watch/WatchHistory";
import watchStore from "../store/watchStore";
import Loader from "../components/Loader";
import BackHeader from "../components/Backheader";

const WatchOverviewPage = () => {
  const {
    continueWatching,
    history,
    loading,
    fetchWatchProgress,
    removeFromHistory,
  } = watchStore();

  useEffect(() => {
    fetchWatchProgress();
  }, [fetchWatchProgress]);

  if (loading) {
    return (
      <div className="h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <BackHeader title="History" />
      <div className="min-h-[calc(100%-72px)] bg-slate-950 px-6 pb-8">
        <ContinueWatching
          items={continueWatching}
          onRemove={removeFromHistory}
        />
        <WatchHistory items={history} onRemove={removeFromHistory} />
      </div>
    </>
  );
};

export default WatchOverviewPage;
