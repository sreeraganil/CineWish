import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import watchStore from "../../store/watchStore";

const WatchHistory = ({ onRemove }) => {
  const { history, historyPage, historyTotalPages, fetchHistory, loading } =
    watchStore();

  const observerRef = useRef(null);
  const observerInstance = useRef(null);
  const fetchingRef = useRef(false); // ✅ added

  /* ---------- Initial Fetch ---------- */
  useEffect(() => {
    if (history.length === 0) {
      fetchHistory(1);
    }
  }, []);

  /* ---------- Infinite Scroll ---------- */
  useEffect(() => {
    if (!observerRef.current) return;

    // disconnect previous observer
    if (observerInstance.current) {
      observerInstance.current.disconnect();
    }

    observerInstance.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (
          entry.isIntersecting &&
          historyPage < historyTotalPages &&
          !fetchingRef.current // ✅ guard instead of loading
        ) {
          fetchingRef.current = true;

          fetchHistory(historyPage + 1).finally(() => {
            fetchingRef.current = false;
          });
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0,
      },
    );

    observerInstance.current.observe(observerRef.current);

    return () => {
      if (observerInstance.current) {
        observerInstance.current.disconnect();
      }
    };
  }, [historyPage, historyTotalPages]);

  if (!history?.length && !loading) return null;

  return (
    <section>
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-teal-400">
          Watch History
        </h2>
        <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full mt-1.5 sm:mt-2" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4">
        {history.map((item) => {
          const url =
            item.mediaType === "tv"
              ? `/details/tv/${item.mediaId}`
              : `/details/movie/${item.mediaId}`;

          return (
            <Link
              key={`${item.mediaType}-${item.mediaId}-${item.season}-${item.episode}`}
              to={url}
              state={{
                title: item.title,
                progressSeconds: item.progressSeconds,
                poster: item.poster,
                backdrop: item.backdrop,
              }}
              className="group relative bg-gray-900 border border-gray-800 rounded-lg sm:rounded-xl overflow-hidden hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 sm:hover:-translate-y-1"
            >
              {/* Poster */}
              <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-gray-800 overflow-hidden">
                <img
                  src={item.poster}
                  alt={item.title}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.png";
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Remove */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove?.(item);
                }}
                className="absolute top-1 right-1 sm:top-2 sm:right-2 z-20 w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-red-500 hover:scale-110 transition-all border border-white/20"
              >
                <svg
                  className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Meta */}
              <div className="p-1.5 sm:p-2.5">
                <h3 className="text-[11px] sm:text-sm font-semibold text-white truncate group-hover:text-teal-300">
                  {item.title ?? "Unknown"}
                </h3>

                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[9px] sm:text-[11px] text-gray-300">
                    {item.mediaType === "tv"
                      ? `S${item.season} • E${item.episode}`
                      : "Movie"}
                  </span>

                  <span className="text-[9px] sm:text-[11px] text-teal-400">
                    {new Date(item.lastWatchedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
        {loading &&
          historyPage < historyTotalPages &&
          Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-900 border border-gray-800 rounded-lg sm:rounded-xl overflow-hidden"
            >
              {/* Poster skeleton */}
              <div className="w-full aspect-[4/5] sm:aspect-[3/4] bg-gray-800" />

              {/* Meta skeleton */}
              <div className="p-1.5 sm:p-2.5 space-y-2">
                <div className="h-3 bg-gray-700 rounded w-3/4" />
                <div className="h-2 bg-gray-800 rounded w-1/2" />
              </div>
            </div>
          ))}
          
        {/* Sentinel */}
        <div ref={observerRef} className="h-10 w-full" />
      </div>
    </section>
  );
};

export default WatchHistory;
