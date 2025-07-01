import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../config/axios";
import wishlistStore from "../store/wishlistStore";

const Details = () => {
  const { media, id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { addToWishlist, wishlist, fetchWishlist } = wishlistStore();

  useEffect(() => {
    fetchWishlist();
  }, []);

  useEffect(() => {
    setIsInWishlist(wishlist?.some((multimedia) => multimedia.tmdbId == id));
    console.log(wishlist);
  }, [wishlist]);

  const handleAdd = async () => {
    try {
      const data = {
        tmdbId: item.id,
        title: item.title || item.name,
        type: media,
        poster: item.poster_path,
        year: new Date(item.release_date || item.first_air_date).getFullYear(),
        genre: item.genre_ids || [],
        rating: item.vote_average,
      };
      await addToWishlist(data);
      alert("Added to wishlist");
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await API.get(`/tmdb/details/${media}/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error("Failed to fetch details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [media, id]);

  if (loading) return <div className="text-white p-4 h-screen flex justify-center items-center">Loading...</div>;
  if (!item)
    return (
      <div className="text-white p-4 h-screen flex flex-col justify-center items-center">
        <p>Item not found or failed to load.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded text-white"
        >
          Refresh Page
        </button>
      </div>
    );

  return (
    <>
      <div className="p-4 text-white max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">{item.title || item.name}</h2>
        <p className="text-sm text-gray-400 mb-4">{item.overview}</p>
        <img
          className="rounded-xl mb-4"
          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
          alt="poster"
        />
        <div className="flex items-center justify-between">
          <p className="text-teal-400 mb-4">Rating: {item.vote_average}</p>
          <button
            onClick={handleAdd}
            disabled={isInWishlist}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded"
          >
            {isInWishlist ? (
              <span className="material-symbols-outlined">bookmark_added</span>
            ) : (
              <span className="material-symbols-outlined">bookmark_add</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Details;
