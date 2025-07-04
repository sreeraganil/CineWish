import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../config/axios";
import wishlistStore from "../store/wishlistStore";
import toast from "react-hot-toast";
import BackHeader from "../components/Backheader";
import Loader from "../components/Loader";

const Details = () => {
  const { media, id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [clicked, setClicked] = useState(false);
  const { addToWishlist, wishlist, watched, fetchWishlist, fetchWatched } = wishlistStore();

  useEffect(() => {
    fetchWishlist();
    fetchWatched();
  }, []);

  useEffect(() => {
    setIsInWishlist(
      [...wishlist, ...watched].some((multimedia) => multimedia.tmdbId == id)
    );
    console.log(isInWishlist);
  }, [wishlist]);

  const handleAdd = async (status = "towatch") => {
    try {
      setClicked(true);
      const data = {
        tmdbId: item.id,
        title: item.title || item.name,
        type: media,
        poster: item.poster_path,
        year: new Date(item.release_date || item.first_air_date).getFullYear(),
        genre: item.genres?.map((g) => g.name) || [],
        rating: item.vote_average,
        status,
      };
      await addToWishlist(data);
      toast.success(`Added to ${status === "towatch" ? "wishlist" : "watched list"}`);
    } catch (err) {
      toast.error(err.message || "Failed to add");
      console.log(err);
    } finally {
      setClicked(false);
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

  if (loading)
    return (
      <div className="my-auto h-screen">
        <Loader />
      </div>
    );
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
      <BackHeader title={"Details"} />
      <div className="fixed top-0 left-0 z-0 h-screen w-screen">
        <img
          className="w-full h-full object-cover object-center"
          src={`https://image.tmdb.org/t/p/original/${item.backdrop_path}`}
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000bb] to-[#000000a3]"></div>
      </div>
      <div className="relative z-10 p-4 max-w-4xl mx-auto text-white">
        <h2 className="text-3xl font-bold mb-1">{item.title || item.name}</h2>
        <p className="text-sm text-gray-400 mb-4">{item.tagline}</p>

        <div className="flex flex-col md:flex-row gap-4">
          <img
            className="rounded-xl w-full max-w-[300px] h-auto object-cover mx-auto md:mx-0"
            src={
              item.poster_path
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt="poster"
          />

          <div className="flex-1">
            <p className="mb-3 text-gray-300">{item.overview}</p>

            <ul className="text-sm text-gray-400 space-y-1">
              <li>
                <span className="text-white">Release:</span>{" "}
                {item.release_date || item.first_air_date}
              </li>
              <li>
                <span className="text-white">Language:</span>{" "}
                {item.original_language?.toUpperCase()}
              </li>
              <li>
                <span className="text-white">Genres:</span>{" "}
                {item.genres?.map((g) => g.name).join(", ")}
              </li>
              <li>
                <span className="text-white">Runtime:</span>{" "}
                {item.runtime || "-"} min
              </li>
              <li>
                <span className="text-white">Rating:</span>
                {item.vote_average?.toFixed(1)} ({item.vote_count} votes)
              </li>
              <li>
                <span className="text-white">Production:</span>{" "}
                {item.production_companies
                  ?.slice(0, 3)
                  .map((c) => c.name)
                  .join(", ")}
              </li>
              <li>
                <span className="text-white">Box Office:</span>{" "}
                {item.revenue && "$"}
                {item.revenue?.toLocaleString() || "N/A"}
              </li>
              <li>
                <span className="text-white">Status:</span> {item.status}
              </li>
            </ul>

            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                disabled={isInWishlist || clicked}
                className="mt-5 flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded disabled:opacity-60"
              >
                <span className="material-symbols-outlined">
                  {isInWishlist ? "bookmark_added" : "bookmark_add"}
                </span>
                {isInWishlist ? "Added to Wishlist" : "Add to Wishlist"}
              </button>
              { !isInWishlist && <button
                onClick={() => handleAdd("watched")}
                className="mt-5 flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded disabled:opacity-60"
              >
                <span className="material-symbols-outlined">
                  preview
                </span>
                Mark as Watched
              </button>}
            </div>

            {item.homepage && (
              <a
                href={item.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-teal-400 hover:text-teal-300 text-sm"
              >
                Official Website ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
