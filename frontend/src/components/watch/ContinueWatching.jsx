import { Link } from "react-router-dom";
import { formatTime, progressPercent } from "../../utilities/watch.utilities";
import { useEffect, useRef, useState } from "react";

const ContinueWatching = ({ items, onRemove }) => {
  const scrollRef = useRef(null);
  const [canScroll, setCanScroll] = useState(false);

  if (!items?.length) return null;

  const checkOverflow = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScroll(el.scrollWidth > el.clientWidth + 1);
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [items]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = direction * (el.clientWidth - 200);
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="pb-8">
      <h2 className="text-2xl font-bold mb-4 text-teal-400">
        Continue Watching
      </h2>

      <div className="relative px-2 md:px-5">
        {canScroll && (
          <button
            onClick={() => scroll(-1)}
            className="hidden absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-2 rounded-full sm:flex items-center justify-center"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
        )}

        {canScroll && (
          <button
            onClick={() => scroll(1)}
            className="hidden absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-2 rounded-full sm:flex items-center justify-center"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        )}

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
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
              <div
                key={`${item.mediaType}-${item.mediaId}-${item.season}-${item.episode}`}
                className="group flex-none w-[240px] sm:w-[260px] lg:w-[280px]"
              >
                <div className="relative">
                  <Link
                    to={watchUrl}
                    state={{
                      title: item.title,
                      progressSeconds: item.progressSeconds,
                      poster: item.poster,
                      backdrop: item.backdrop,
                    }}
                  >
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

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/40">
                        <div
                          className="h-full bg-teal-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </Link>

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRemove?.(item);
                    }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 text-white text-sm hover:bg-teal-600 transition"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-1 text-sm text-white font-medium truncate">
                  {item.title ?? `Media ${item.mediaId}`}
                </div>

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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContinueWatching;
