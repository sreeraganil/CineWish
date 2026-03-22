import { useEffect } from "react";
import ContinueWatching from "../components/watch/ContinueWatching";
import WatchHistory from "../components/watch/WatchHistory";
import watchStore from "../store/watchStore";
import Loader from "../components/Loader";
import Header from "../components/Header";

const WatchOverviewPage = () => {
  const {
    continueWatching,
    loading,
    historyPage,
    fetchContinueWatching,
    removeFromHistory,
  } = watchStore();

  /* ---------- Initial Fetch ---------- */
  useEffect(() => {
    fetchContinueWatching();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = "CineWish - History";
  }, []);

  /* ---------- Initial Loader ---------- */
  if (loading && historyPage === 1 && continueWatching.length === 0) {
    return (
      <>
        <Header />
        <div className="h-[calc(100vh-64px)]">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="relative min-h-[calc(100vh-64px)] pb-[80px] bg-gray-950 px-3 sm:px-4 md:px-6 md:pb-6 sm:pb-8 pt-4 sm:pt-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-3 md:space-y-5">
          
          {/* Continue Watching */}
          {continueWatching?.length > 0 && (
            <ContinueWatching
              items={continueWatching}
              onRemove={removeFromHistory}
            />
          )}

          {/* Watch History (always render) */}
          <WatchHistory onRemove={removeFromHistory} />

        </div>
      </div>
    </>
  );
};

export default WatchOverviewPage;