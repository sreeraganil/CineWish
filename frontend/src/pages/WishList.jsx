import { useEffect, useState } from "react";
import Header from "../components/Header";
import wishlistStore from "../store/wishlistStore";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";


const WishList = () => {
  const [loading, setLoading] = useState(true);
  const { wishlist, fetchWishlist, markAsWatched, removeFromWishlist } =
    wishlistStore();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterData, setFilterData] = useState(wishlist);

  const [typeFilter, setTypeFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  const clearFilters = () => {
    setTypeFilter("");
    setGenreFilter("");
    setYearFilter("");
    setRatingFilter("");
  };

  const handleClick = (media, id) => {
    navigate(`/details/${media}/${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchWishlist();
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filteredWishlist = wishlist.filter((item) => {
      return (
        (!typeFilter || item.type === typeFilter) &&
        (!genreFilter || item.genre.includes(genreFilter)) &&
        (!yearFilter || item.year === parseInt(yearFilter)) &&
        (!ratingFilter || item.rating >= parseFloat(ratingFilter))
      );
    });

    setFilterData(filteredWishlist);
  }, [typeFilter, genreFilter, yearFilter, ratingFilter, wishlist]);

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
            <h2 className="text-2xl font-bold">Your Wishlist</h2>
            <span
              className={`material-symbols-outlined cursor-pointer select-none ${showFilter && "text-teal-500"}`}
              onClick={() => setShowFilter((prev) => !prev)}
            >
              tune
            </span>
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

              <div className="text-right">
                <button
                  onClick={clearFilters}
                  className="px-3 py-[2px] sm:py-1 bg-red-600 rounded hover:bg-red-700"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <Loader />
        ) : filterData.length === 0 ? (
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
            {filterData.map((item) => (
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
      <DeleteConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default WishList;
