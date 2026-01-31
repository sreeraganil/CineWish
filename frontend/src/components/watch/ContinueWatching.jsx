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
      <h2 className="text-2xl font-bold mb-6 text-teal-400">
        Continue Watching
      </h2>

      <div className="relative group/button px-2">
        {/* Left Arrow */}
        {canScroll && (
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="hidden absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-2 rounded-full sm:flex items-center justify-center opacity-0 group-hover/button:opacity-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {canScroll && (
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="hidden absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-2 rounded-full sm:flex items-center justify-center opacity-0 group-hover/button:opacity-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide scroll-smooth"
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
                className="group/card flex-none w-[200px] sm:w-[240px] lg:w-[280px]"
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
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800 transition-all duration-300 border border-gray-800 hover:border-teal-500/50">
                      {/* Backdrop Image */}
                      {item.backdrop ? (
                        <img
                          src={item.backdrop}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                          <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}

                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Play Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                        <div className="bg-teal-500/90 backdrop-blur-sm rounded-full p-3 transform group-hover/card:scale-110 transition-transform duration-300 shadow-xl border border-teal-400/50">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50 backdrop-blur-sm">
                        <div
                          className="h-full bg-gradient-to-r from-teal-400 to-teal-500 transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      {/* Media Type Badge */}
                      <div className="absolute top-1 left-2">
                        <span className="bg-teal-600 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shadow-lg border border-white/20">
                          {item.mediaType === "tv" ? `S${item.season}E${item.episode}` : "Movie"}
                        </span>
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
                    aria-label="Remove from continue watching"
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 backdrop-blur-sm text-white text-sm hover:bg-red-600 hover:scale-110 transition-all duration-200 flex items-center justify-center border border-white/20 shadow-lg"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Title and Info */}
                <div className="mt-2 px-1">
                  <h3 className="text-xs sm:text-sm font-semibold text-white truncate group-hover/card:text-teal-400 transition-colors mb-1">
                    {item.title ?? `Media ${item.mediaId}`}
                  </h3>

                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{formatTime(item.progressSeconds)}</span>
                    </div>
                    <span className="text-teal-400 font-medium">{Math.round(percent)}%</span>
                  </div>
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