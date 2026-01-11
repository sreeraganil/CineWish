import { Link } from "react-router-dom";
import { formatTime, progressPercent } from "../../utilities/watch.utilities";

const ContinueWatching = ({ items }) => {
  if (!items?.length) return null;

  return (
    <section className="pb-8">
      <h2 className="text-2xl font-bold mb-4 text-teal-400">
        Continue Watching
      </h2>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2 md:px-5">
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
              className="group flex-none w-[240px] sm:w-[260px] lg:w-[280px]"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-md overflow-hidden bg-slate-800">
                {item.backdrop ? (
                  <img
                    src={item.backdrop}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                    No Image
                  </div>
                )}

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/40">
                  <div
                    className="h-full bg-teal-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Title */}
              <div className="mt-1 text-sm text-white font-medium truncate">
                {item.title ?? `Media ${item.mediaId}`}
              </div>

              {/* Episode / time */}
              <div className="flex justify-between text-xs text-slate-400">
                {item.mediaType === "tv" ? (
                  <span>
                    S{item.season} • E{item.episode}
                  </span>
                ) : (
                  <span>Movie</span>
                )}
                <span>{formatTime(item.progressSeconds)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ContinueWatching;
