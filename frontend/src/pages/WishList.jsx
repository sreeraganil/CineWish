import { useEffect, useState } from "react";
import Header from "../components/Header";
import wishlistStore from "../store/wishlistStore";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const WishList = () => {
  const [loading, setLoading] = useState(true);
  const {
    wishlist,
    wishlistCount,
    fetchWishlist,
    markAsWatched,
    removeFromWishlist,
  } = wishlistStore();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const [typeFilter, setTypeFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [page, setPage] = useState(1);

  const activeFilterCount = [
    typeFilter,
    genreFilter,
    yearFilter,
    ratingFilter,
  ].filter(Boolean).length;

  const clearFilters = async () => {
    setTypeFilter("");
    setGenreFilter("");
    setYearFilter("");
    setRatingFilter("");
    setLoading(true);
    (typeFilter || genreFilter || yearFilter || ratingFilter) &&
      (await fetchWishlist(""));
    setLoading(false);
  };

  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(wishlistCount / ITEMS_PER_PAGE);

  const handleClick = (media, id) => {
    navigate(`/details/${media}/${id}`);
  };

  const fetchData = async () => {
    setLoading(true);
    const queries = new URLSearchParams({
      t: typeFilter,
      g: genreFilter,
      y: yearFilter,
      r: ratingFilter,
    }).toString();
    await fetchWishlist(queries, page);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleDelete = async () => {
    await removeFromWishlist(idToDelete, "wishlist");
    console.log("Deleted!");
    setIdToDelete(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white pb-20 md:pb-0">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative mb-4 flex flex-col items-end">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-2xl font-bold flex items-center justify-center">
              Your Wishlist
              {!loading && (
                <span className="ml-3 text-lg rounded-full bg-teal-600 px-2">
                  {wishlistCount}
                </span>
              )}
            </h2>
            <div className="relative">
              <span
                className={`material-symbols-outlined cursor-pointer select-none ${
                  showFilter && "text-teal-500"
                }`}
                onClick={() => setShowFilter((prev) => !prev)}
              >
                tune
              </span>
              {activeFilterCount > 0 && (
                <span className="absolute rounded-full bg-teal-500 px-1 top-[-30%] right-[-50%] text-xs font-semibold">
                  {activeFilterCount}
                </span>
              )}
            </div>
          </div>
          {showFilter && (
            <div className="mt-4 bg-gray-800 text-white p-4 rounded-lg space-y-4 max-w-lg">
              <div className="flex gap-4 justify-center flex-wrap">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm mb-1">Type</label>
                  <select
                    className="bg-gray-900 px-2 py-1 rounded"
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
                  <label className="block text-sm mb-1">Genre</label>
                  <select
                    className="bg-gray-900 px-2 py-1 rounded"
                    onChange={(e) => setGenreFilter(e.target.value)}
                    value={genreFilter}
                  >
                    <option value="">All</option>
                    <option value="Action">Action</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Drama">Drama</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Science Fiction">Sci-Fi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Year</label>
                  <input
                    type="number"
                    className="bg-gray-900 px-2 py-1 rounded w-24"
                    placeholder="e.g. 2023"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Min Rating</label>
                  <input
                    type="number"
                    className="bg-gray-900 px-2 py-1 rounded w-24"
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="e.g. 6"
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                  />
                </div>
              </div>

              <div className="text-right w-full  flex justify-between">
                <button
                  onClick={clearFilters}
                  className="px-3 py-[2px] bg-red-600 rounded hover:bg-red-700 transition duration-300"
                >
                  Clear Filters
                </button>
                <button
                  onClick={fetchData}
                  className="px-3 py-[2px] bg-teal-500 rounded hover:bg-teal-700 transition duration-300"
                >
                  Show Results
                </button>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <Loader />
        ) : wishlist?.length === 0 ? (
          <>
            <div className="relative w-full flex flex-col items-center justify-center gap-4">
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
              <p className="text-gray-500 text-center">
                Your wishlist is empty.
              </p>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {wishlist?.map((item) => (
              <div
                key={item._id}
                className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow hover:shadow-teal-500/20 transition hover:scale-105 relative"
                onClick={() => handleClick(item.type, item.tmdbId)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster}`}
                  alt={item.title}
                  className="h-60 w-full object-cover"
                />
                <div className="p-3">
                  <h3 className="text-sm font-semibold truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400">{item.year}</p>
                  <p className="text-xs text-teal-400 mt-1">
                    Rating: {parseFloat(item.rating).toFixed(1) || "N/A"}
                  </p>

                  <div className="relative mt-2 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsWatched(item._id);
                      }}
                      className="w-3/4 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-1.5 rounded"
                    >
                      Watched
                    </button>
                    <button
                      className="bg-red-500 p-0.5 rounded flex items-center justify-center hover:bg-red-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIdToDelete(item._id);
                        setShowModal(true);
                      }}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
                <span className="absolute top-2 right-2 bg-teal-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase shadow-md">
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      {wishlist.length !== 0 && (
        <div className="flex justify-center items-center gap-2 mt-8 pb-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-teal-500 text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}
      <DeleteConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default WishList;
