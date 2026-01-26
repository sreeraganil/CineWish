import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import TrendingCard from "../components/TrendingCard";
import CardSkeleton from "../components/CardSkeleton";
import studios from "../utilities/studios.json";
import BackHeader from "../components/Backheader";
import studioStore from "../store/studioStore";

const Studio = () => {
  const { id } = useParams();
  const [media, setMedia] = useState("movie");

  const studio = studios.find((s) => String(s.id) === id);

  const observerRef = useRef(null);

  const {
    items,
    page,
    totalPages,
    loading,
    fetchStudio,
    resetStudio,
    studioId,
    scrollPosition,
    setScrollPosition,
  } = studioStore();

  useEffect(() => {
    if (studioId == id) {
      setTimeout(() => {
        window.scrollTo({ top: scrollPosition, behavior: "instant" });
      }, 0);
      return;
    }

    window.scrollTo({ top: 0, behavior: "instant" });
    resetStudio();
    fetchStudio({ studioId: id, page: 1, media });
  }, [id, media]);

  useEffect(() => {
    if (!observerRef.current || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && page < totalPages) {
          fetchStudio({
            studioId: id,
            page: page + 1,
          });
        }
      },
      {
        rootMargin: "400px",
      },
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [page, totalPages, loading]);

  useEffect(() => {
    document.title = studio ? `Cinewish – ${studio.name}` : "Cinewish – Studio";
  }, [studio]);

  return (
    <div
      className="bg-gray-950 min-h-screen text-white"
      onClickCapture={() => setScrollPosition(window.scrollY)}
    >
      <BackHeader title="Studio" />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        {/* Background Gradients */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${
            studio?.gradient || "from-gray-900 to-black"
          } opacity-60`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.1),transparent_50%)]" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          {/* Studio Logo */}
          {studio?.image && (
            <div className="mb-6 sm:mb-8 flex justify-center md:justify-start">
              <img
                src={studio.image}
                alt={studio.name}
                className="h-16 sm:h-20 md:h-24 w-auto object-contain drop-shadow-2xl"
              />
            </div>
          )}

          {/* Studio Info */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {studio?.name || "Studio"}
            </h1>

            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-start text-xs sm:text-sm text-gray-300">
              {studio?.headquarters && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                  <span className="material-symbols-outlined text-teal-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="currentColor"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </span>
                  <span className="truncate max-w-[200px] sm:max-w-none">
                    {studio.headquarters}
                  </span>
                </div>
              )}

              {studio?.homepage && (
                <a
                  href={studio.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-teal-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="currentColor"
                    >
                      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                    </svg>
                  </span>
                  <span>Website</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-gray-950 to-transparent" />
      </section>

      {/* CONTENT SECTION */}
      <section className="max-w-7xl mx-auto px-3 sm:px-5 py-6 sm:py-8">
        {/* Header with Media Toggle */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          {/* Title & Count */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 truncate">
                {media === "movie" ? "Movies" : "TV Shows"}
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">
                {items.length > 0
                  ? `${items.length} ${items.length === 1 ? "item" : "items"} loaded`
                  : "..."}
              </p>
            </div>

            <div className="relative inline-flex bg-gray-900/50 backdrop-blur-sm rounded-lg p-0.5 border border-gray-800">
              <button
                onClick={() => {
                  setMedia("movie");
                  resetStudio();
                  fetchStudio({ studioId: id, page: 1, media: "movie" });
                }}
                className={`px-3 md:px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  media === "movie"
                    ? "bg-teal-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => {
                  setMedia("tv");
                  resetStudio();
                  fetchStudio({ studioId: id, page: 1, media: "tv" });
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  media === "tv"
                    ? "bg-teal-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                TV
              </button>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {items.map((movie, i) => (
            <TrendingCard key={`${movie.id}-${i}`} {...movie} />
          ))}

          {loading &&
            Array.from({ length: 10 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <div className="text-center py-12 sm:py-20">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🎬</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-2 px-4">
              No {media === "movie" ? "movies" : "TV shows"} found
            </h3>
            <p className="text-sm sm:text-base text-gray-500 px-4">
              This studio doesn't have any{" "}
              {media === "movie" ? "movies" : "TV shows"} yet.
            </p>
          </div>
        )}

        {/* SENTINEL */}
        <div
          ref={observerRef}
          className="h-16 sm:h-20 flex justify-center items-center mt-6 sm:mt-8"
        >
          {loading && page > 1 && (
            <div className="flex items-center gap-2 text-teal-400">
              <div
                className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Studio;
