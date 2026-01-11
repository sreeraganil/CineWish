import { Link } from "react-router-dom";
import { formatTime, progressPercent } from "../../utilities/watch.utilities";

const ContinueWatching = ({ items }) => {
  if (!items?.length) return null;

  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold text-white mb-4">
        Continue Watching
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const percent = progressPercent(
            item.progressSeconds,
            item.durationSeconds
          );

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
              className="group relative block"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-800">
                {item.backdrop ? (
                  <img
                    src={item.backdrop}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    No Image
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Title & episode */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white font-semibold leading-snug line-clamp-2">
                    {item.title ?? `Media ${item.mediaId}`}
                  </div>

                  {item.mediaType === "tv" && (
                    <div className="text-xs text-slate-300 mt-1">
                      S{item.season} • E{item.episode}
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
                  <div
                    className="h-full bg-teal-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Time info */}
              <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                <span>{formatTime(item.progressSeconds)}</span>
                <span>{percent}% watched</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ContinueWatching;
