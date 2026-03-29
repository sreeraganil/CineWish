import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import genreStore from "../store/genreStore";
import GenreGrid from "../components/GenreGrid";
import GENRE from "../utilities/genres.json";
import BackHeader from "../components/BackHeader";

const GenrePage = () => {
  const { id } = useParams();
  const genre = GENRE.find((genre) => genre.id == id);
  const [media, setMedia] = useState("movie");
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = {
    year: searchParams.get("year") || "",
    rating: searchParams.get("rating") || "",
    sort: searchParams.get("sort") || "popularity.desc",
  };

  const [openDropdown, setOpenDropdown] = useState(null);
  const [yearInput, setYearInput] = useState(filters.year || "");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

    fetchGenre({
      genreId: id,
      page: 1,
      media,
      ...filters,
    });
  }, [id, media, searchParams]);

  useEffect(() => {
    document.title = genre?.name
      ? `Cinewish – ${genre.name}`
      : "Cinewish – Genre";
  }, [genre]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    setSearchParams(params, { replace: true });

    window.scrollTo({ top: 0, behavior: "instant" });
    resetGenre();
  };

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
        <div className="relative max-w-7xl mx-auto px-2 sm:px-6 py-6 sm:py-12">
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
      <section className="max-w-7xl mx-auto px-3 sm:px-5 pb-6 sm:pb-8 mt-4">
        {/* Header with Filters & Media Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6 sm:mb-8">
          {/* Title & Toggle Container */}
          <div className="flex items-center justify-between md:justify-start gap-4 md:gap-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white truncate">
              {media === "movie" ? "Movies" : "TV Shows"}
            </h2>

            {/* Media Toggle - Mobile Compact */}
            <div className="relative inline-flex bg-gray-900/50 backdrop-blur-sm rounded-lg p-0.5 border border-gray-800 shrink-0">
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

          {/* Filter Dropdowns */}
          <div
            ref={dropdownRef}
            className="grid gap-2 sm:flex sm:flex-wrap sm:gap-3"
            style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
          >
            {/* Year */}
            <div className="relative min-w-0">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "year" ? null : "year")
                }
                className={`w-full flex items-center justify-between gap-1 appearance-none cursor-pointer bg-gray-900/60 backdrop-blur-sm border rounded-full pl-3 pr-2 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-teal-500/60 ${
                  filters.year
                    ? "border-teal-500/60 text-teal-400"
                    : "border-gray-700/60 text-gray-400 hover:border-gray-600 hover:text-white"
                }`}
              >
                <span className="truncate">{filters.year || "Year"}</span>
                <svg
                  className={`shrink-0 w-3 h-3 transition-transform ${openDropdown === "year" ? "rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>

              {openDropdown === "year" && (
                <div className="absolute z-50 top-full mt-1 left-0 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
                  {/* Text input */}
                  <div className="p-2 border-b border-gray-700/60">
                    <input
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      placeholder="Type year..."
                      value={yearInput}
                      onChange={(e) => setYearInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && yearInput) {
                          updateFilter("year", yearInput);
                          setOpenDropdown(null);
                        }
                      }}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-teal-500/60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  {/* Scrollable year list */}
                  <div className="max-h-48 overflow-y-auto">
                    <button
                      onClick={() => {
                        updateFilter("year", "");
                        setYearInput("");
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-800 transition-colors ${!filters.year ? "text-teal-400" : "text-gray-400"}`}
                    >
                      All years
                    </button>
                    {Array.from({ length: 30 }, (_, i) => {
                      const y = String(new Date().getFullYear() - i);
                      return (
                        <button
                          key={y}
                          onClick={() => {
                            updateFilter("year", y);
                            setYearInput(y);
                            setOpenDropdown(null);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-800 transition-colors ${filters.year === y ? "text-teal-400 bg-teal-500/10" : "text-gray-400"}`}
                        >
                          {y}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="relative min-w-0">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "rating" ? null : "rating")
                }
                className={`w-full flex items-center justify-between gap-1 cursor-pointer bg-gray-900/60 backdrop-blur-sm border rounded-full pl-3 pr-2 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-teal-500/60 ${
                  filters.rating
                    ? "border-teal-500/60 text-teal-400"
                    : "border-gray-700/60 text-gray-400 hover:border-gray-600 hover:text-white"
                }`}
              >
                <span className="truncate">
                  {filters.rating ? `${filters.rating}+` : "Rating"}
                </span>
                <svg
                  className={`shrink-0 w-3 h-3 transition-transform ${openDropdown === "rating" ? "rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>

              {openDropdown === "rating" && (
                <div className="absolute z-50 top-full mt-1 left-0 w-36 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
                  {[
                    { value: "", label: "Any rating" },
                    { value: "5", label: "5+" },
                    { value: "6", label: "6+" },
                    { value: "7", label: "7+" },
                    { value: "8", label: "8+" },
                    { value: "9", label: "9+" },
                  ].map((o) => (
                    <button
                      key={o.value}
                      onClick={() => {
                        updateFilter("rating", o.value);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-800 transition-colors ${filters.rating === o.value ? "text-teal-400 bg-teal-500/10" : "text-gray-400"}`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="relative min-w-0">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "sort" ? null : "sort")
                }
                className={`w-full flex items-center justify-between gap-1 cursor-pointer bg-gray-900/60 backdrop-blur-sm border rounded-full pl-3 pr-2 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-teal-500/60 ${
                  filters.sort && filters.sort !== "popularity.desc"
                    ? "border-teal-500/60 text-teal-400"
                    : "border-gray-700/60 text-gray-400 hover:border-gray-600 hover:text-white"
                }`}
              >
                <span className="truncate">
                  {{
                    "popularity.desc": "Popular",
                    "vote_average.desc": "Top Rated",
                    "release_date.desc": "Latest",
                  }[filters.sort] || "Sort"}
                </span>
                <svg
                  className={`shrink-0 w-3 h-3 transition-transform ${openDropdown === "sort" ? "rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>

              {openDropdown === "sort" && (
                <div className="absolute z-50 top-full mt-1 right-0 w-40 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
                  {[
                    { value: "popularity.desc", label: "Popular" },
                    { value: "vote_average.desc", label: "Top Rated" },
                    { value: "release_date.desc", label: "Latest" },
                  ].map((o) => (
                    <button
                      key={o.value}
                      onClick={() => {
                        updateFilter("sort", o.value);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-800 transition-colors ${filters.sort === o.value ? "text-teal-400 bg-teal-500/10" : "text-gray-400"}`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
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
              media,
              ...filters,
            })
          }
        />
      </section>
    </div>
  );
};

export default GenrePage;
