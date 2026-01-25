import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import CardSkeleton from "./CardSkeleton";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const GenreGrid = ({ items, loading, hasMore, onLoadMore }) => {
  const observerRef = useRef(null);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      {
        rootMargin: "500px",
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  if(!items.length) {
    return <div className="relative w-full flex flex-col items-center justify-center gap-4">
          <DotLottieReact
            src="/lottie/no_result.lottie"
            loop
            autoplay
            style={{
              width: "clamp(100px, 40vw, 200px)",
              height: "clamp(100px, 40vw, 200px)",
              borderRadius: "50%",
              overflow: "hidden",
              marginTop: "100px",
            }}
          />
          <p className="text-center text-gray-600">No results</p>
        </div>
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4 lg:px-4 py-1">

        {/* Cards */}
        {items.map((item, i) => {
          const media = item.media_type || "movie";
          const title = item.title || item.name;
          const year = item.release_date?.slice(0, 4);
          const rating = item.vote_average?.toFixed(1);

          return (
            <Link
              key={`${media}-${item.id}-${i}`}
              to={`/details/${media}/${item.id}`}
              className="
                min-w-[160px]
                my-1
                relative
                bg-gray-900
                rounded-xl
                border border-gray-800
                overflow-hidden
                shadow
                hover:border-teal-300
                transition-all
                group
              "
            >
              {/* Poster */}
              <img
              loading="lazy"
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : "/placeholder.png"
                }
                alt={title}
                className="
                  h-48 w-full object-cover
                  group-hover:object-bottom
                  transition-all
                "
              />

              {/* Info */}
              <div className="p-3 text-white">
                <h3 className="text-sm font-semibold truncate">
                  {title}
                </h3>

                <p className="text-xs text-gray-400">
                  {year}
                </p>

              </div>

              {/* Badge */}
              <span className="absolute top-2 right-2 bg-teal-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase shadow-md">
                {media}
              </span>

              {rating && parseFloat(rating) > 0 && (
                  <div className="absolute top-2 left-2">
                    <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                      <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-white text-xs font-semibold">{rating}</span>
                    </div>
                  </div>
                )}
            </Link>
          );
        })}

        {loading &&
          Array.from({ length: 12 }).map((_, i) => (
            <CardSkeleton key={`skeleton-${i}`} />
          ))}
      </div>

      {/* Intersection Sentinel */}
      {hasMore && (
        <div
          ref={observerRef}
          className="flex justify-center py-12 text-teal-400 text-sm"
        >
          {loading ? "Loading…" : "Scroll for more"}
        </div>
      )}
    </>
  );
};

export default GenreGrid;
