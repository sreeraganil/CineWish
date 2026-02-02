import { useEffect } from "react";
import ContinueWatching from "../components/watch/ContinueWatching";
import WatchHistory from "../components/watch/WatchHistory";
import watchStore from "../store/watchStore";
import Loader from "../components/Loader";
import Header from "../components/Header";

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

  useEffect(() => {
    document.title = "CineWish - History";
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="h-[calc(100vh-64px)]">
          <Loader />
        </div>
      </>
    );
  }

  const isEmpty = !continueWatching.length && !history.length;

  return (
    <>
      <Header />
      <div className="relative min-h-[calc(100vh-64px)] bg-gray-950 px-6 pb-8 pt-6">
        {isEmpty ? (
          <div className="h-full flex flex-col justify-center items-center gap-3 py-32">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-teal-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  fill="currentColor"
                >
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
              </span>
            </div>
            <h1 className="text-white font-semibold text-lg mt-2">
              No watch history
            </h1>
            <p className="text-gray-500 text-sm text-center max-w-xs leading-relaxed">
              Start watching something and it will show up here
            </p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-10">
            <ContinueWatching
              items={continueWatching}
              onRemove={removeFromHistory}
            />
            <WatchHistory items={history} onRemove={removeFromHistory} />
          </div>
        )}
      </div>
    </>
  );
};

export default WatchOverviewPage;
