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
        <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>

        {loading ? (
          <Loader />
        ) : wishlist.length === 0 ? (
          <>
            <div className="relative w-full flex flex-col items-center justify-center gap-4">
              <DotLottieReact
                // src="https://lottie.host/9d2b2f06-56f3-48e6-a778-513d8f97fb34/SdOaUoj0vE.lottie"
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
            {wishlist.map((item) => (
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
