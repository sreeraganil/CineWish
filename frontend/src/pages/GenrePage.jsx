import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import genreStore from "../store/genreStore";
import GenreGrid from "../components/GenreGrid";
import BackHeader from "../components/Backheader";
import GENRE from "../utilities/genres.json";

const GenrePage = () => {
  const { id } = useParams();
  const genre = GENRE.find((genre) => genre.id == id);
  const [media, setMedia] = useState("movie");

  const {
    items,
    page,
    totalPages,
    loading,
    fetchGenre,
    resetGenre,
    genreId,
    scrollPosition,
    setScrollPosition,
  } = genreStore();

  useEffect(() => {
    if (genreId == id) {
      setTimeout(() => {
        window.scrollTo({ top: scrollPosition, behavior: "instant" });
      }, 0);
      return;
    }

    window.scrollTo({ top: 0, behavior: "instant" });
    resetGenre();
    fetchGenre({ genreId: id, page: 1, media });
  }, [id]);

  useEffect(() => {
    document.title = genre?.name
      ? `Cinewish – ${genre.name}`
      : "Cinewish – Genre";
  }, [genre]);

  return (
    <div
      className="min-h-screen bg-gray-950 text-white"
      onClickCapture={() => setScrollPosition(window.scrollY)}
    >
      <BackHeader title="Genre" />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        {/* Dynamic Background Gradient based on genre */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${genre?.gradient || "from-gray-900 to-black"} opacity-60`}
        />

        {/* Radial Glow Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.1),transparent_50%)]" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          {/* Genre Info */}
          <div className="text-center md:text-left">
            {/* Genre Icon (if available) */}
            {genre?.icon && (
              <div className="mb-4 sm:mb-6 flex justify-center md:justify-start">
                <div className="bg-teal-500/20 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-teal-500/30">
                  <span className="text-4xl sm:text-5xl">{genre.icon}</span>
                </div>
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {genre?.name || "Genre"}
            </h1>

            {genre?.description && (
              <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto md:mx-0 mb-4">
                {genre.description}
              </p>
            )}

            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-start text-xs sm:text-sm">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                <span className="material-symbols-outlined text-teal-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                  >
                    <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm6 10h-4V5h4v14zm4-2h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z" />
                  </svg>
                </span>
                <span className="text-gray-300">Genre Collection</span>
              </div>

              {items.length > 0 && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                  <span className="material-symbols-outlined text-teal-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="currentColor"
                    >
                      <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
                    </svg>
                  </span>
                  <span className="text-gray-300">
                    {items.length} items loaded
                  </span>
                </div>
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
          {/* Title & Toggle Container */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-white truncate">
                {media === "movie" ? "Movies" : "TV Shows"}
              </h2>
            </div>

            {/* Media Toggle - Mobile Compact */}
            <div className="relative inline-flex bg-gray-900/50 backdrop-blur-sm rounded-lg p-0.5 border border-gray-800">
              {["movie", "tv"].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMedia(m);
                    window.scrollTo({ top: 0, behavior: "instant" });
                    resetGenre();
                    fetchGenre({ genreId: id, page: 1, media: m });
                  }}
                  className={`px-3 md:px-5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    media === m
                      ? "bg-teal-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {m === "movie" ? "Movies" : "TV"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Genre Grid */}
        <GenreGrid
          items={items}
          loading={loading}
          hasMore={page < totalPages}
          onLoadMore={() =>
            fetchGenre({
              genreId: id,
              page: page + 1,
            })
          }
        />
      </section>
    </div>
  );
};

export default GenrePage;
