import { Link } from "react-router-dom";

const WatchHistory = ({ items, onRemove }) => {
  if (!items?.length) return null;

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-teal-400">
          Watch History
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full mt-2" />
      </div>

      {/* Card Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
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
              className="group relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Poster */}
              <div className="relative h-[240px] bg-gray-800 overflow-hidden">
                <img
                  src={item.poster}
                  alt={item.title}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.png";
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove?.(item);
                }}
                className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-black/80 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-500 hover:scale-110 transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100"
              >
                <span className="text-sm font-bold">✕</span>
              </button>

              {/* Meta */}
              <div className="p-3 space-y-1.5">
                <h3 className="text-sm font-semibold text-white truncate group-hover:text-teal-300 transition-colors duration-200">
                  {item.title ?? "Unknown"}
                </h3>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gray-800 rounded text-[11px] text-gray-300 font-medium">
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
                </div>

                <p className="text-[11px] text-teal-400 font-medium">
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