import { Link } from "react-router-dom";

const WatchHistory = ({ items, onRemove }) => {
  if (!items?.length) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-teal-400">
        Watch History
      </h2>

      {/* Card Row */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2 md:px-5">
        {items.map((item) => {
          const watchUrl =
            item.mediaType === "tv"
              ? `/watch/tv/${item.mediaId}/${item.season}/${item.episode}`
              : `/watch/movie/${item.mediaId}`;

          return (
            <Link
              key={`${item.mediaType}-${item.mediaId}-${item.season}-${item.episode}`}
              to={watchUrl}
              state={{
                title: item.title,
                progressSeconds: item.progressSeconds,
                poster: item.poster,
                backdrop: item.backdrop,
              }}
              className="relative group flex-none w-[160px] bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-teal-400 transition"
            >
              {/* Poster */}
              <div className="relative h-[240px] bg-slate-800 overflow-hidden">
                {item.poster ? (
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                    —
                  </div>
                )}
              </div>

              <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRemove?.(item);
                    }}
                    className="
                      absolute top-2 right-2 z-20
                      w-6 h-6
                      rounded-full
                      bg-black/70 text-white
                      text-sm
                      hover:bg-teal-600
                      transition
                    "
                  >
                    ✕
                  </button>

              {/* Meta */}
              <div className="p-3">
                <h3 className="text-sm font-semibold text-white truncate">
                  {item.title ?? "Unknown"}
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  {item.mediaType === "tv"
                    ? `S${item.season} • E${item.episode}`
                    : "Movie"}
                </p>

                <p className="text-[11px] text-teal-400 mt-1">
                  {new Date(item.lastWatchedAt).toLocaleDateString()}
                </p>
              </div>

            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default WatchHistory;
