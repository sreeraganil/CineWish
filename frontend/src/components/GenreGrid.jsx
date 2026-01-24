import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

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

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4 lg:px-4 py-1">
        {items.map((item) => {
          const media = item.media_type || "movie";
          const title = item.title || item.name;
          const year = item.release_date?.slice(0, 4);
          const rating = item.vote_average?.toFixed(1);

          return (
            <Link
              key={`${media}-${item.id}`}
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

                {rating && (
                  <p className="text-xs text-teal-400 mt-1">
                    Rating: {rating}
                  </p>
                )}
              </div>

              {/* Badge */}
              <span className="absolute top-2 right-2 bg-teal-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase shadow-md">
                {media}
              </span>
            </Link>
          );
        })}
      </div>

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
