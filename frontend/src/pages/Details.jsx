import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../config/axios";
import wishlistStore from "../store/wishlistStore";
import toast from "react-hot-toast";
import BackHeader from "../components/Backheader";
import Loader from "../components/Loader";
import userStore from "../store/userStore";

const Details = () => {
  const { media, id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [clicked, setClicked] = useState(false);
  const { addToWishlist, wishlist, watched, fetchWishlist, fetchWatched } =
    wishlistStore();
  const { user } = userStore();

  useEffect(() => {
    user && fetchWishlist();
    user && fetchWatched();
  }, []);

  useEffect(() => {
    setIsInWishlist(
      [...wishlist, ...watched].some((multimedia) => multimedia.tmdbId == id)
    );
  }, [wishlist]);

  const handleAdd = async (status) => {
    try {
      setClicked(true);
      const data = {
        tmdbId: item.id,
        title: item.title || item.name,
        type: media,
        poster: item.poster_path,
        year: new Date(item.release_date || item.first_air_date).getFullYear(),
        genre: item.genres?.map((g) => g.name) || [],
        rating: item.imdbRating || item.vote_average,
        status,
      };
      await addToWishlist(data);
      toast.success(
        `Added to ${status === "towatch" ? "wishlist" : "watched list"}`
      );
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

  const formatVotes = (votes) => {
    const n = Number(votes.toString().replace(/,/g, ""));
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
    return n.toString();
  };

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
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000bb] via-[#00000088] to-[#000000dd]"></div>
      </div>

      <div className="relative z-10 p-0 sm:p-4 max-w-4xl mx-auto text-white">
        <div className="mt-8 md:mt-5 p-6 bg-opacity-70 rounded-xl backdrop-blur-sm">
          {item.imdbRating && item?.imdbRating !== 0 ? (
            <div className="absolute z-20 flex justify-center top-[-15px] right-2">
              <div className="flex items-center gap-2 bg-[#f5c518] text-black px-2 py-1 rounded-lg shadow-md text-lg font-semibold">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
                  alt="IMDb"
                  className="h-5 w-auto"
                />
                <span className="text-sm font-bold">
                  {parseFloat(item.imdbRating).toFixed(1)}
                </span>
                {item?.imdbVotes && (
                  <span className="text-xs sm:text-sm font-medium text-gray-700 ml-1">
                    ({formatVotes(item.imdbVotes)} votes)
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="absolute z-20 flex justify-center top-[-15px] right-2">
              <div className="flex items-center gap-2 bg-[#032541] px-2 py-1 rounded-lg shadow-md text-lg font-semibold text-white">
                <span className="text-sm font-bold bg-gradient-to-r from-[#9cccb6] to-[#00bae1] text-transparent bg-clip-text">
                  TMDB
                </span>
                <span className="text-sm font-bold">
                  {parseFloat(item.vote_average).toFixed(1)}
                </span>
                {item?.vote_count && (
                  <span className="text-xs sm:text-sm font-medium text-white-100 opacity-70 ml-1">
                    ({formatVotes(item.vote_count)} votes)
                  </span>
                )}
              </div>
            </div>
          )}
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            {item.title || item.name}
          </h2>
          {item.tagline && (
            <p className="text-sm italic text-gray-300 mb-6">
              "{item.tagline}"
            </p>
          )}

          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="flex-shrink-0">
              <img
                className="rounded-xl w-full max-w-[280px] h-auto object-cover mx-auto md:mx-0 shadow-lg"
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt="poster"
              />
            </div>

            <div className="flex-1 space-y-4">
              {item.overview && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Overview</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {item.overview}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {item.release_date || item.first_air_date ? (
                  <div>
                    <span className="text-gray-400">
                      {item.release_date ? "Release Date:" : "First Air Date:"}
                    </span>{" "}
                    <span className="text-white">
                      {item.release_date || item.first_air_date}
                    </span>
                  </div>
                ) : null}

                {item.last_air_date && (
                  <div>
                    <span className="text-gray-400">Last Air Date:</span>{" "}
                    <span className="text-white">{item.last_air_date}</span>
                  </div>
                )}

                {item.original_language && (
                  <div>
                    <span className="text-gray-400">Language:</span>{" "}
                    <span className="text-white">
                      {item.original_language.toUpperCase()}
                    </span>
                  </div>
                )}

                {item.genres?.length > 0 && (
                  <div>
                    <span className="text-gray-400">Genres:</span>{" "}
                    <span className="text-white">
                      {item.genres.map((g) => g.name).join(", ")}
                    </span>
                  </div>
                )}

                {item.runtime ? (
                  <div>
                    <span className="text-gray-400">Runtime:</span>{" "}
                    <span className="text-white">{item.runtime} min</span>
                  </div>
                ) : item.episode_run_time?.length > 0 ? (
                  <div>
                    <span className="text-gray-400">Episode Runtime:</span>{" "}
                    <span className="text-white">
                      {item.episode_run_time.join(", ")} min
                    </span>
                  </div>
                ) : null}

                {item.number_of_seasons && (
                  <div>
                    <span className="text-gray-400">Seasons:</span>{" "}
                    <span className="text-white">{item.number_of_seasons}</span>
                  </div>
                )}
                {item.number_of_episodes && (
                  <div>
                    <span className="text-gray-400">Episodes:</span>{" "}
                    <span className="text-white">
                      {item.number_of_episodes}
                    </span>
                  </div>
                )}

                {item.production_companies?.length > 0 && (
                  <div>
                    <span className="text-gray-400">Production:</span>{" "}
                    <span className="text-white">
                      {item.production_companies
                        .slice(0, 3)
                        .map((c) => c.name)
                        .join(", ")}
                    </span>
                  </div>
                )}

                {item.networks?.length > 0 && (
                  <div>
                    <span className="text-gray-400">Network:</span>{" "}
                    <span className="text-white">
                      {item.networks.map((n) => n.name).join(", ")}
                    </span>
                  </div>
                )}

                {item.revenue && item.revenue !== 0 && (
                  <div>
                    <span className="text-gray-400">Box Office:</span>{" "}
                    <span className="text-white">
                      ${item.revenue.toLocaleString()}
                    </span>
                  </div>
                )}

                {item.status && (
                  <div>
                    <span className="text-gray-400">Status:</span>{" "}
                    <span className="text-white">{item.status}</span>
                  </div>
                )}

                {item.created_by?.length > 0 && (
                  <div>
                    <span className="text-gray-400">Created By:</span>{" "}
                    <span className="text-white">
                      {item.created_by.map((c) => c.name).join(", ")}
                    </span>
                  </div>
                )}
              </div>

              { user && <div className="flex flex-wrap gap-3 pt-4">
                <button
                  onClick={() => handleAdd("towatch")}
                  disabled={isInWishlist || clicked}
                  className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                    isInWishlist
                      ? "bg-gray-600 text-gray-300"
                      : "bg-teal-600 hover:bg-teal-700 text-white"
                  } disabled:opacity-60`}
                >
                  <span className="material-symbols-outlined">
                    {isInWishlist ? "bookmark_added" : "bookmark_add"}
                  </span>
                  {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                </button>

                {!isInWishlist && (
                  <button
                    onClick={() => handleAdd("watched")}
                    disabled={clicked}
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined">preview</span>
                    Mark as Watched
                  </button>
                )}
              </div>}

              {item.homepage && (
                <div className="pt-2">
                  <a
                    href={item.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-teal-400 hover:text-teal-300 text-sm transition-colors"
                  >
                    Official Website
                    <span className="material-symbols-outlined ml-1 text-base">
                      open_in_new
                    </span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
