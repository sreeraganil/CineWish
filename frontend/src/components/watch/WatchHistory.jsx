import { Link } from "react-router-dom";

const WatchHistory = ({ items }) => {
  if (!items?.length) return null;

  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Watch History
      </h2>

      <div className="space-y-4">
        {items.map((item) => {
          const watchUrl =
            item.mediaType === "tv"
              ? `/watch/tv/${item.mediaId}/${item.season}/${item.episode}`
              : `/watch/movie/${item.mediaId}`;

          return (
            <Link
              to={watchUrl}
              state={{
                title: item.title,
                progressSeconds: item.progressSeconds,
                poster: item.poster,
                backdrop: item.backdrop,
              }}
              key={`${item.mediaType}-${item.mediaId}-${item.season}-${item.episode}`}
              className="
                flex items-center gap-4
                bg-slate-900
                rounded-lg
                px-4 py-3
                hover:bg-slate-800
                transition
              "
            >
              {/* Poster */}
              <div className="w-14 h-20 shrink-0 rounded overflow-hidden bg-slate-800">
                {item.poster ? (
                  <img
                    src={item.poster}
                    alt={item.title ?? `Media ${item.mediaId}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                    —
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium truncate">
                  {item.title ?? `Media ${item.mediaId}`}
                </div>

                <div className="text-sm text-slate-400 mt-1">
                  {item.mediaType === "tv"
                    ? `Season ${item.season} • Episode ${item.episode}`
                    : "Movie"}
                </div>
              </div>

              {/* Date */}
              <div className="text-sm text-slate-400 whitespace-nowrap">
                {new Date(item.lastWatchedAt).toLocaleDateString()}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default WatchHistory;
