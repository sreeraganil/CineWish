import { Link } from "react-router-dom";

const WatchHistory = ({ items, onRemove }) => {
  if (!items?.length) return null;

  return (
    <section>
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-teal-400">
          Watch History
        </h2>
        <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full mt-1.5 sm:mt-2" />
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4">
        {items.map((item) => {
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
              className="group relative min-w-[140px] sm:w-auto flex-shrink-0 bg-gray-900 border border-gray-800 rounded-lg sm:rounded-xl overflow-hidden hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 sm:hover:-translate-y-1"
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

              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove?.(item);
                }}
                aria-label="Remove from watch history"
                className="absolute top-1 right-1 sm:top-2 sm:right-2 z-20 w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-black/80 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-500 hover:scale-110 transition-all border border-white/20 shadow-lg"
              >
                <svg
                  className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Meta */}
              <div className="p-1.5 sm:p-2.5">
                <h3 className="text-[11px] sm:text-sm font-semibold text-white truncate group-hover:text-teal-300 transition-colors">
                  {item.title ?? "Unknown"}
                </h3>

                {/* Episode + Date Inline */}
                <div className="flex items-center justify-between gap-1 mt-0.5">
                  <span className="inline-flex items-center gap-1 px-1 py-0.5 bg-gray-800 rounded text-[9px] sm:text-[11px] text-gray-300 font-medium">
                    {item.mediaType === "tv" ? (
                      <>
                        <span>S{item.season}</span>
                        <span className="text-gray-600">•</span>
                        <span>E{item.episode}</span>
                      </>
                    ) : (
                      "Movie"
                    )}
                  </span>

                  <span className="text-[9px] sm:text-[11px] text-teal-400 font-medium">
                    {new Date(item.lastWatchedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default WatchHistory;
