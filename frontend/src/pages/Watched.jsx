import { useEffect } from "react";
import Header from "../components/Header";
import wishlistStore from "../store/wishlistStore";
import { useState } from "react";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Watched = () => {
  const { watched, watchedCount, fetchWatched, removeFromWishlist } =
    wishlistStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [page, setPage] = useState(1);

  const handleClick = (media, id) => {
    navigate(`/details/${media}/${id}`);
  };

  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.max(Math.ceil(watchedCount.totalCount / ITEMS_PER_PAGE), 1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchWatched(page);
      setLoading(false);
    };
    load();
  }, [page]);

  const handleDelete = async () => {
    await removeFromWishlist(idToDelete, "watched");
    setIdToDelete(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white pb-20 md:pb-0">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4  flex items-center">
          Watched
          { !loading && <span className="ml-3 text-lg rounded-full bg-teal-600 px-2">
            {watchedCount.totalCount}
          </span>}
        </h1>
        {loading ? (
          <Loader />
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
              You haven’t marked anything as watched.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {watched?.map((item) => (
              <div
                key={item._id}
                className="relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow hover:shadow-teal-500/20 transition hover:scale-105"
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
                </div>
                <span className="absolute top-2 right-2 bg-teal-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase shadow-md">
                  {item.type}
                </span>
                <button
                  className="absolute z-10 bottom-2 right-2 bg-red-500 p-0.5 rounded flex items-center justify-center hover:bg-red-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIdToDelete(item._id);
                    setShowModal(true);
                  }}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {watched.length !== 0 && !loading && <div className="flex justify-center items-center gap-2 mt-8 pb-4">
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
      </div>}
      <DeleteConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Watched;
