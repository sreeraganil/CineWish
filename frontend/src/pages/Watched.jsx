import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import wishlistStore from "../store/wishlistStore";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import CardSkeleton from "../components/CardSkeleton";
import genreList from "../utilities/genres.json";

const Watched = () => {
  const { watched, watchedCount, fetchWatched, removeFromWishlist } =
    wishlistStore();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const loaderRef = useRef(null);
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [typeFilter, setTypeFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  const [activeFilterCount, setActiveFilterCount] = useState(0);

  const clearFilters = () => {
    setTypeFilter("");
    setGenreFilter("");
    setYearFilter("");
    setRatingFilter("");
    setActiveFilterCount(0);
    setPage(1);
    fetchData(true);
  };

  const applyFilters = () => {
    setPage(1);
    fetchData();
    setActiveFilterCount(
      [typeFilter, genreFilter, yearFilter, ratingFilter].filter(Boolean)
        .length,
    );
    setShowFilter(false);
  };

  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.max(
    Math.ceil(
      (watchedCount.filterTotalCount || watchedCount.totalCount) /
        ITEMS_PER_PAGE,
    ),
    1,
  );

  const fetchData = async (reset = false) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const queries = new URLSearchParams({
      t: reset ? "" : typeFilter,
      g: reset ? "" : genreFilter,
      y: reset ? "" : yearFilter,
      r: reset ? "" : ratingFilter,
    }).toString();

    await fetchWatched(page, queries);

    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    document.title = "CineWish – Your Watched List";
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          !loadingMore &&
          page < totalPages
        ) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "600px 0px",
        threshold: 0,
      },
    );

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) observer.observe(currentLoaderRef);

    return () => {
      if (currentLoaderRef) observer.unobserve(currentLoaderRef);
    };
  }, [loading, loadingMore, page, totalPages]);

  const handleClick = (media, id) => {
    navigate(`/details/${media}/${id}`);
  };

  const handleDelete = async () => {
    await removeFromWishlist(idToDelete, "watched");
    setIdToDelete(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white pb-20 md:pb-0">
      <Header />
      <div className="max-w-8xl mx-auto px-4 py-6">
        <div className="relative mb-4 flex flex-col items-end">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-2xl font-bold flex items-center">
              Watched
              {!loading && (
                <span className="ml-3 text-lg rounded-full bg-teal-600 px-2">
                  {watchedCount.filterTotalCount || watchedCount.totalCount}
                </span>
              )}
            </h1>
            <div className="relative">
              <span
                className={`material-symbols-outlined cursor-pointer select-none ${
                  showFilter && "text-teal-500"
                }`}
                onClick={() => setShowFilter((prev) => !prev)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
                </svg>
              </span>
              {activeFilterCount > 0 && (
                <span className="absolute rounded-full bg-teal-500 px-1 top-[-30%] right-[-50%] text-xs font-semibold">
                  {activeFilterCount}
                </span>
              )}
            </div>
          </div>
          {showFilter && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowFilter(false)}
              />

              {/* Filter Panel */}
              <div className="absolute top-4 z-50 mt-4 bg-gray-900 border border-gray-800 text-white p-4 rounded-lg shadow-xl max-w-lg">
                <div className="flex gap-3 justify-center flex-wrap">
                  {/* Type Filter */}
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 mb-1">
                      Type
                    </label>
                    <select
                      className="bg-gray-800 border border-gray-700 px-2 py-1 rounded text-xs focus:outline-none focus:border-teal-500 transition-all duration-200"
                      onChange={(e) => setTypeFilter(e.target.value)}
                      value={typeFilter}
                    >
                      <option value="">All</option>
                      <option value="movie">Movie</option>
                      <option value="tv">TV</option>
                    </select>
                  </div>

                  {/* Genre Filter */}
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 mb-1">
                      Genre
                    </label>
                    <select
                      className="bg-gray-800 border border-gray-700 px-2 py-1 rounded text-xs focus:outline-none focus:border-teal-500 transition-all duration-200"
                      onChange={(e) => setGenreFilter(e.target.value)}
                      value={genreFilter}
                    >
                      <option value="">All</option>
                      {genreList?.map((genre) => (
                        <option key={genre.id} value={genre.name}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Year Filter */}
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      className="bg-gray-800 border border-gray-700 px-2 py-1 rounded w-20 text-xs focus:outline-none focus:border-teal-500 transition-all duration-200"
                      placeholder="2023"
                      value={yearFilter}
                      onChange={(e) => setYearFilter(e.target.value)}
                    />
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 mb-1">
                      Min Rating
                    </label>
                    <input
                      type="number"
                      className="bg-gray-800 border border-gray-700 px-2 py-1 rounded w-20 text-xs focus:outline-none focus:border-teal-500 transition-all duration-200"
                      step="0.1"
                      min="0"
                      max="10"
                      placeholder="6.0"
                      value={ratingFilter}
                      onChange={(e) => setRatingFilter(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center gap-2">
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded hover:border-red-500/50 hover:text-red-400 transition-all duration-200"
                  >
                    Clear
                  </button>

                  <button
                    onClick={applyFilters}
                    className="px-3 py-1 bg-teal-500 text-white text-xs rounded hover:bg-teal-600 transition-all duration-200 font-medium"
                  >
                    Show Results
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {loading && page === 1 ? (
          <div className="h-[calc(100vh-200px)]">
            <Loader />
          </div>
        ) : watched?.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center gap-4">
            <DotLottieReact
              src="/lottie/no_data_found.lottie"
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
            <p className="text-gray-400 text-center">
              {activeFilterCount > 0
                ? "No results found matching your filters."
                : "You haven't marked anything as watched."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8  gap-2 sm:gap-3 md:gap-4">
              {watched?.map((item, i) => (
                <div
                  key={`${item._id}-${i}`}
                  className="group relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow transition cursor-pointer sm:hover:scale-105 hover:shadow-teal-500/20"
                  onClick={() => handleClick(item.type, item.tmdbId)}
                >
                  {/* Poster */}
                  <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-gray-800 overflow-hidden">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.poster}`}
                      alt={item.title}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Rating */}
                    <div className="absolute top-1 left-1">
                      <div className="flex items-center gap-0.5 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                        <svg
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-white text-[10px] sm:text-xs font-semibold">
                          {parseFloat(item.rating || 0).toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Type */}
                    <span className="absolute top-1 right-1 bg-teal-600 text-white text-[8px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase shadow-md">
                      {item.type}
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="p-2 sm:p-3">
                    <h3 className="text-xs sm:text-sm font-semibold truncate">
                      {item.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-400">
                      {item.year}
                    </p>
                  </div>

                  {/* Delete */}
                  <button
                    className="absolute bottom-1 right-1 z-10 bg-red-500 p-1 rounded hover:bg-red-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIdToDelete(item._id);
                      setShowModal(true);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="currentColor"
                    >
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                  </button>
                </div>
              ))}

              {loadingMore &&
                Array.from({ length: 12 }).map((_, i) => (
                  <CardSkeleton key={`skeleton-${i}`} />
                ))}
            </div>

            <div
              ref={loaderRef}
              className="h-10 mt-4 flex justify-center items-center"
            >
              {loadingMore && page > 1 && (
                <span className="text-teal-400">Loading more...</span>
              )}
            </div>
          </>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Watched;
