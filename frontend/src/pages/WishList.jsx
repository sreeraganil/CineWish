import { useEffect, useState } from "react";
import Header from "../components/Header";
import wishlistStore from "../store/wishlistStore";
import { useNavigate } from "react-router-dom";

const WishList = () => {
  const [loading, setLoading] = useState(true);
  const { wishlist, fetchWishlist } = wishlistStore();
  const navigate = useNavigate();

  const handleClick = (media, id) => {
    navigate(`/details/${media}/${id}`)
  }


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      fetchWishlist();
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold mb-4">Your Wishlist</h2>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : wishlist.length === 0 ? (
          <p className="text-gray-500">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {wishlist.map((item) => (
              <div
                key={item._id}
                className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow hover:shadow-teal-500/20 transition"
                onClick={()=>handleClick(item.type, item.tmdbId)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster}`}
                  alt={item.title}
                  className="h-60 w-full object-cover"
                />
                <div className="p-3">
                  <h3 className="text-sm font-semibold truncate">{item.title}</h3>
                  <p className="text-xs text-gray-400">{item.year}</p>
                  <p className="text-xs text-teal-400 mt-1">
                    IMDb: {item.rating || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishList;
