import { useEffect } from "react";
import Header from "../components/Header";
import wishlistStore from "../store/wishlistStore";
import { useState } from "react";
import Loader from "../components/Loader";

const Watched = () => {
  const { watched, fetchWatched } = wishlistStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchWatched();
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Watched</h1>
        {loading ? (
          <Loader />
        ) : watched?.length === 0 ? (
          <p className="text-gray-400">
            You haven’t marked anything as watched.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {watched?.map((item) => (
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

export default Watched;
