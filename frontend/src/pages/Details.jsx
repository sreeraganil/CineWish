import { Link, useLocation, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import API from "../config/axios";
import wishlistStore from "../store/wishlistStore";
import toast from "react-hot-toast";
import BackHeader from "../components/Backheader";
import Loader from "../components/Loader";
import userStore from "../store/userStore";
import SimilarContent from "../components/SimilarContent";
import { useMemo } from "react";
import MediaVideos from "../components/MediaVideos";

const Details = () => {
  const { media, id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [openSeason, setOpenSeason] = useState(1);
  const [progress, setProgress] = useState(null);
  const detailpageRef = useRef();
  const [error, setError] = useState(null);

  const { addToWishlist } = wishlistStore();
  const { user } = userStore();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const { hash } = useLocation();
  const ep_id = hash?.slice(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = `CineWish - ${item?.title || item?.name || "Loading..."}`;
  }, [item, id]);

  useEffect(() => {
    if (user) checkStatus();
  }, [id, user]);

  const extraEvent = () => {
    setIsTransitioning(true);

    setTimeout(() => {
      setIsTransitioning(false);
      if (id == 66732) {
        detailpageRef.current.classList.toggle("stranger-things");
      }
    }, 800);
  };

  const checkStatus = async () => {
    try {
      const { data } = await API.get(`/wishlist/check/${id}`);
      setIsInWishlist(Boolean(data.exists));
    } catch (err) {
      console.error("Wishlist check failed:", err);
    }
  };

  const handleAdd = async (status) => {
    try {
      setClicked(true);
      await addToWishlist({
        tmdbId: item.id,
        title: item.title || item.name,
        type: media,
        poster: item.poster_path,
        year: new Date(item.release_date || item.first_air_date).getFullYear(),
        genre: item.genres?.map((g) => g.name) ?? [],

        rating: item.imdbRating || item.vote_average,
        status,
      });
      toast.success(
        `Added to ${status === "towatch" ? "wishlist" : "watched list"}`,
      );
      checkStatus();
    } catch (err) {
      toast.error("Failed to add");
    } finally {
      setClicked(false);
    }
  };

  useEffect(() => {
    const el = document.getElementById(ep_id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [item]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await API.get(`/tmdb/details/${media}/${id}`);
        setItem(data);
        setError(false);
      } catch (err) {
        console.error("Failed to fetch details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    const fetchProgress = async () => {
      try {
        const { data } = await API.get(`/watch/progress/${media}/${id}`);
        setProgress(data);
        if (media === "tv" && data?.length) {
          const watching = data.find((p) => p.status === "watching");
          const target = watching || data[0];
          setOpenSeason(target.season);
        }
      } catch (err) {
        console.error("Failed to fetch details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
    user && fetchProgress();
  }, [media, id]);

  const formatVotes = (v) => {
    const n = Number(v?.toString().replace(/,/g, ""));
    if (!n) return "0";
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
    return n.toString();
  };

  const formatDuration = (runtimes) => {
    if (!runtimes || runtimes.length === 0) return null;
    const avg = runtimes.reduce((a, b) => a + b, 0) / runtimes.length;
    return `${Math.round(avg)} min (Avg)`;
  };

  const toggleSeason = (seasonNumber) => {
    setOpenSeason((prev) => (prev === seasonNumber ? null : seasonNumber));
  };

  const getLatestEpisode = () => {
    if (!progress?.length) return null;

    const watching = progress.find((p) => p.status === "watching");
    return watching || progress[0];
  };

  const progressMap = useMemo(() => {
    const map = new Map();

    progress?.length &&
      progress?.forEach((p) => {
        const key = `${p.season}-${p.episode}`;
        map.set(key, p);
      });

    return map;
  }, [progress]);

  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Failed to load details
      </div>
    );

  if (loading || !item)
    return (
      <div className="h-screen">
        <Loader />
      </div>
    );

  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

  const castData =
    media === "tv" ? item.aggregate_credits?.cast : item.credits?.cast;
  const crewData =
    media === "tv" ? item.aggregate_credits?.crew : item.credits?.crew;

  const topCast = castData?.slice(0, 8) ?? [];
  const crew = crewData ?? [];

  const director = crew.find((c) => c.job === "Director");
  const creators = media === "tv" ? item.created_by : null;
  const composers = crew.filter((c) => c.job === "Original Music Composer");
  const producers = crew.filter((c) => c.job === "Producer").slice(0, 3);

  const primaryRating =
    item.imdbRating > 0 ? item.imdbRating : item.vote_average;
  const primaryVotes = item.imdbRating > 0 ? item.imdbVotes : item.vote_count;
  const isImdb = item.imdbRating > 0;

  const flatrateProviders = item.watchProviders?.flatrate || [];
  const rentProviders = item.watchProviders?.rent || [];
  const buyProviders = item.watchProviders?.buy || [];

  const hasProviders =
    flatrateProviders.length > 0 ||
    rentProviders.length > 0 ||
    buyProviders.length > 0;

  return (
    <div ref={detailpageRef}>
      <BackHeader title="Details" />

      {id == 66732 && (
        <>
          {/* Rift Button */}
          <div className="fixed bottom-15 left-1/2 -translate-x-1/2 z-50">
            <button
              className="rift-button"
              aria-label="Enter the Upside Down"
              onClick={extraEvent}
            />
          </div>

          {/* Red Screen */}
          <div
            className={`
    fixed inset-0 z-40
    pointer-events-none
    ${isTransitioning ? "portal-open" : "portal-close"}
  `}
            style={{
              background:
                "radial-gradient(circle at 50% 85%, #ef4444 0%, #b91c1c 35%, #7f1d1d 65%, #450a0a 100%)",
              transformOrigin: "50% 85%",
            }}
          >
            {/* <img src="/images/portal.png" alt="" className="w-full h-full object-cover" /> */}
          </div>
        </>
      )}

      <div className="fixed inset-0 -z-10 w-full st">
        <img
          src={
            item.backdrop_path
              ? `https://image.tmdb.org/t/p/original/${item.backdrop_path}`
              : "https://via.placeholder.com/1280x720"
          }
          alt={item.title || item.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto p-6 text-white">
        {/* Rating badge - Improved conditional logic */}
        {primaryRating > 0 && (
          <div
            className={`absolute right-6 top-2 px-3 py-1 rounded-lg font-semibold text-xs sm:text-lg st ${
              isImdb ? "bg-[#f5c518] text-black" : "bg-[#032541] text-white"
            }`}
          >
            {isImdb ? "IMDb" : "TMDB"} {primaryRating.toFixed(1)} (
            {formatVotes(primaryVotes)})
          </div>
        )}

        <h1
          className={`text-2xl sm:text-4xl font-bold st title pt-5 ${!item.tagline && "mb-6"}`}
        >
          {item.title || item.name}
        </h1>

        {item.tagline && (
          <p className="italic text-gray-300 mb-6 st">"{item.tagline}"</p>
        )}

        <div className="flex items-center flex-col md:flex-row gap-6 pb-1 st">
          {/* Poster */}
          <div className="relative flex-shrink-0 mx-auto md:mx-0">
            <img
              src={
                item.poster_path
                  ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                  : "https://via.placeholder.com/300x450"
              }
              alt={item.title || item.name}
              loading="eager"
              className="w-48 sm:w-56 md:w-64 aspect-[2/3] rounded-xl shadow-2xl"
            />
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-4">
            {/* Overview */}
            {item.overview && (
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                {item.overview}
              </p>
            )}

            {media === "tv" && item?.external_ids?.imdb_id && (
              <div className="pt-1">
                <Link
                  to={`/ratings/${item.external_ids.imdb_id}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5
                 rounded-md text-sm font-semibold
                 bg-indigo-600 hover:bg-indigo-600/30
                 text-indigo-100 hover:text-white
                 border border-indigo-500/70
                 transition-all"
                >
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    {" "}
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.93 8.719c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.119-3.292z" />{" "}
                  </svg>
                  <span className="h-full flex items-center mb-0.5">
                    Episode-wise Ratings
                  </span>
                </Link>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2.5 text-sm">
              {item.release_date && (
                <div>
                  <span className="text-gray-400">Release:</span>{" "}
                  <span className="text-white font-medium">
                    {item.release_date}
                  </span>
                </div>
              )}

              {item.first_air_date && media === "tv" && (
                <div>
                  <span className="text-gray-400">First Aired:</span>{" "}
                  <span className="text-white font-medium">
                    {item.first_air_date}
                  </span>
                </div>
              )}

              {media === "movie" && item.runtime > 0 && (
                <div>
                  <span className="text-gray-400">Runtime:</span>{" "}
                  <span className="text-white font-medium">
                    {item.runtime} min
                  </span>
                </div>
              )}

              {media === "tv" && item.episode_run_time?.length > 0 && (
                <div>
                  <span className="text-gray-400">Episode:</span>{" "}
                  <span className="text-white font-medium">
                    {formatDuration(item.episode_run_time)}
                  </span>
                </div>
              )}

              {media === "tv" && item.number_of_seasons > 0 && (
                <div>
                  <span className="text-gray-400">Seasons:</span>{" "}
                  <span className="text-white font-medium">
                    {item.number_of_seasons}
                  </span>
                </div>
              )}

              {media === "tv" && item.number_of_episodes > 0 && (
                <div>
                  <span className="text-gray-400">Episodes:</span>{" "}
                  <span className="text-white font-medium">
                    {item.number_of_episodes}
                  </span>
                </div>
              )}

              {item.budget > 0 && media === "movie" && (
                <div>
                  <span className="text-gray-400">Budget:</span>{" "}
                  <span className="text-white font-medium">
                    ${item.budget.toLocaleString()}
                  </span>
                </div>
              )}

              {item.revenue > 0 && media === "movie" && (
                <div>
                  <span className="text-gray-400">Revenue:</span>{" "}
                  <span className="text-white font-medium">
                    ${item.revenue.toLocaleString()}
                  </span>
                </div>
              )}

              {item.status && (
                <div>
                  <span className="text-gray-400">Status:</span>{" "}
                  <span className="text-white font-medium">{item.status}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {item.genres?.length > 0 && (
              <div>
                <span className="text-gray-400 text-sm">Genres:</span>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {item.genres.map((g) => (
                    <Link
                      to={`/genre/${g.id}`}
                      key={g.id}
                      className="bg-teal-500/20 text-teal-300 px-2.5 py-1 rounded-md text-xs font-medium border border-teal-500/30"
                    >
                      {g.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Crew */}
            {!!(
              director ||
              creators?.length ||
              composers?.length ||
              producers?.length
            ) && (
              <div className="text-sm space-y-1.5 pt-2">
                {media === "tv" && creators?.length > 0 && (
                  <div>
                    <span className="text-gray-400">Created By:</span>{" "}
                    <span className="text-white font-medium">
                      {creators.map((c, i, t) => (
                        <React.Fragment key={c.id}>
                          <Link
                            key={c.id}
                            className="text-teal-500 underline font-medium"
                            to={`/people/${c.id}`}
                          >
                            {c.name}
                          </Link>
                          {t.length !== i + 1 && ", "}
                        </React.Fragment>
                      ))}
                    </span>
                  </div>
                )}
                {media === "movie" && director && (
                  <div>
                    <span className="text-gray-400">Director:</span>{" "}
                    <Link
                      to={`/people/${director.id}`}
                      className="text-teal-500 underline font-medium"
                    >
                      {director.name}
                    </Link>
                  </div>
                )}
                {composers.length > 0 && (
                  <div>
                    <span className="text-gray-400">Music:</span>{" "}
                    <span className="text-white font-medium">
                      {composers.map((c, i, t) => (
                        <React.Fragment key={c.id}>
                          <Link
                            key={c.id}
                            className="text-teal-500 underline font-medium"
                            to={`/people/${c.id}`}
                          >
                            {c.name}
                          </Link>
                          {t.length !== i + 1 && ", "}
                        </React.Fragment>
                      ))}
                    </span>
                  </div>
                )}
                {producers.length > 0 && (
                  <div>
                    <span className="text-gray-400">Producers:</span>{" "}
                    <span className="text-white font-medium">
                      {producers.map((p, i, t) => (
                        <React.Fragment key={p.id}>
                          <Link
                            key={p.id}
                            className="text-teal-500 underline font-medium"
                            to={`/people/${p.id}`}
                          >
                            {p.name}
                          </Link>
                          {t.length !== i + 1 && ", "}
                        </React.Fragment>
                      ))}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {user && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-3">
                <button
                  onClick={() => handleAdd("towatch")}
                  disabled={isInWishlist || clicked}
                  className={`flex items-center disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    isInWishlist
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-teal-600 hover:bg-teal-700 text-white"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        isInWishlist
                          ? "M5 13l4 4L19 7"
                          : "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      }
                    />
                  </svg>
                  <span className="truncate">
                    {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                  </span>
                </button>

                {!isInWishlist && (
                  <button
                    onClick={() => handleAdd("watched")}
                    disabled={clicked}
                    className="flex items-center justify-center disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed gap-2 px-4 py-2.5 rounded-lg font-medium text-sm bg-teal-600 hover:bg-teal-700 text-white transition-all"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="truncate">Mark as Watched</span>
                  </button>
                )}

                {media === "tv" ? (
                  <span
                    onClick={() => {
                      const latest = getLatestEpisode();

                      const id = latest
                        ? `s${String(latest.season).padStart(2, "0")}e${String(
                            latest.episode,
                          ).padStart(2, "0")}`
                        : "s01e01";

                      const el = document.getElementById(id);
                      if (el) {
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm bg-amber-500 hover:bg-amber-600 text-black transition-all cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    <span className="truncate">
                      {progress?.length ? "Resume" : "Watch"}
                    </span>
                  </span>
                ) : (
                  <Link
                    to={`/watch/${media}/${id}`}
                    state={{
                      title: item.title || item.name,
                      poster: item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : "/placeholder.png",
                      backdrop: item.backdrop_path
                        ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}`
                        : "/placeholder.png",
                      mediaType: media,
                      mediaId: id,
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm bg-amber-500 hover:bg-amber-600 text-black transition-all"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    <span className="truncate">Watch</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {hasProviders && (
          <div className="pt-6 space-y-6 border-t border-gray-700/50 st">
            <h3 className="text-lg md:text-xl font-bold text-teal-400 flex items-center">
              <i className="fas fa-tv mr-2"></i> Watch Options
            </h3>

            <div className="space-y-3">
              {[
                { title: "STREAM", data: flatrateProviders },
                { title: "RENT", data: rentProviders },
                { title: "BUY", data: buyProviders },
              ].map(
                (category) =>
                  category.data.length > 0 && (
                    <div
                      key={category.title}
                      className="bg-gradient-to-br from-gray-800/60 to-gray-900/40 rounded-xl border border-gray-700/30 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300 overflow-hidden"
                    >
                      {/* Category Label with Vertical Text */}
                      <div className="flex items-stretch">
                        <div className="flex-shrink-0 bg-teal-600 flex items-center justify-center w-5 md:w-6">
                          <span
                            className="text-white font-black text-[10px] md:text-[12px] tracking-widest whitespace-nowrap"
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(180deg)",
                            }}
                          >
                            {category.title}
                          </span>
                        </div>

                        {/* Responsive Grid System */}
                        <div className="flex-1 p-3 md:p-4">
                          <div className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3 md:gap-4">
                            {category.data.map((provider) => (
                              <Link
                                to={`/provider/${provider.provider_id}`}
                                key={`${provider.provider_id}-${category.title}`}
                                className="group flex flex-col items-center justify-start text-center cursor-pointer"
                              >
                                <div className="relative w-full aspect-square max-w-[50px] md:max-w-[60px] mx-auto">
                                  <img
                                    src={`${IMAGE_BASE_URL}${provider.logo_path}`}
                                    alt={provider.provider_name}
                                    className="w-full h-full object-cover rounded-lg shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-teal-500/20 ring-0 group-hover:ring-2 group-hover:ring-teal-400/50"
                                    loading="lazy"
                                  />
                                  {/* Hover Overlay */}
                                  <div className="absolute inset-0 bg-teal-500/0 group-hover:bg-teal-500/10 rounded-lg transition-all duration-300"></div>
                                </div>
                                <p className="mt-1.5 text-[10px] md:text-xs text-gray-300 group-hover:text-teal-300 transition-colors duration-200 w-full line-clamp-2 leading-tight font-medium">
                                  {provider.provider_name}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
              )}
            </div>
          </div>
        )}

        {/* New TV Next/Last Episode Info */}
        {media === "tv" && (item.lastEpisodeToAir || item.nextEpisodeToAir) && (
          <div className="pt-8 bg-gray-900/50 p-4 rounded-lg mt-4 st">
            <h3 className="text-lg font-semibold mb-2">Episode Status</h3>
            {item.nextEpisodeToAir && (
              <p className="text-sm mb-2">
                <span className="text-teal-400 font-medium">Next Episode:</span>{" "}
                S{item.nextEpisodeToAir.season_number}E
                {item.nextEpisodeToAir.episode_number} -{" "}
                {item.nextEpisodeToAir.name} (Airs on{" "}
                {item.nextEpisodeToAir.air_date})
              </p>
            )}
            {item.lastEpisodeToAir && (
              <p className="text-sm">
                <span className="text-gray-400">Last Episode:</span> S
                {item.lastEpisodeToAir.season_number}E
                {item.lastEpisodeToAir.episode_number} -{" "}
                {item.lastEpisodeToAir.name} (Aired on{" "}
                {item.lastEpisodeToAir.air_date})
              </p>
            )}
          </div>
        )}

        {/* Collection (Movies Only) */}
        {media === "movie" && item.belongs_to_collection && (
          <div className="pt-8">
            <h3 className="text-lg font-semibold mb-2">Collection</h3>

            <Link
              to={`/collection/${item.belongs_to_collection.id}`}
              className="flex items-center gap-4 bg-gray-900/50 p-4 rounded-lg hover:bg-gray-800 transition"
            >
              <img
                src={
                  item.belongs_to_collection.poster_path
                    ? `https://image.tmdb.org/t/p/w200${item.belongs_to_collection.poster_path}`
                    : "/placeholder.png"
                }
                className="w-20 rounded object-cover"
                alt={`${item.belongs_to_collection.name} poster`}
                loading="lazy"
              />

              <p className="text-white font-medium">
                {item.belongs_to_collection.name}
              </p>
            </Link>
          </div>
        )}

        {/* Cast - Note: Uses 'aggregate_credits' structure for TV */}
        {topCast.length > 0 && (
          <div className="pt-8 st">
            <h3 className="text-xl font-bold text-teal-400 mb-4">Top Cast</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
              {topCast.map((c) => (
                <Link
                  to={`/people/${c.id}`}
                  key={c.id || c.credit_id}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-lg mb-2 bg-gray-800">
                    <img
                      src={`https://image.tmdb.org/t/p/w185${c.profile_path}`}
                      alt={c.name}
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                      }}
                      className="aspect-[2/3] w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-white leading-tight mb-0.5 truncate">
                    {c.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400 leading-tight truncate">
                    {media === "tv" ? c.roles?.[0]?.character : c.character}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Seasons & Episodes Section (TV Only) */}
        {media === "tv" && item.episodes?.length > 0 && (
          <div className="pt-8">
            <h3 className="text-lg font-semibold mb-4">
              Seasons ({item.episodes.length})
            </h3>

            <div className="space-y-4">
              {item.episodes.map((season) => {
                const isOpen = openSeason === season.season_number;

                return (
                  <div
                    key={season.id}
                    className="bg-gray-800/70 rounded-lg overflow-hidden"
                  >
                    {/* SEASON HEADER */}
                    <div
                      onClick={() => toggleSeason(season.season_number)}
                      className="relative p-4 flex gap-4 items-center cursor-pointer hover:bg-gray-700/50 transition"
                    >
                      <img
                        src={
                          season.poster_path
                            ? `https://image.tmdb.org/t/p/w185${season.poster_path}`
                            : "/placeholder.png"
                        }
                        alt={season.name}
                        className="w-16 h-24 object-cover rounded-md flex-shrink-0"
                      />

                      <div className="flex-1">
                        <p className="font-semibold text-lg">{season.name}</p>

                        <p className="text-sm text-gray-300">
                          {season.air_date?.slice(0, 4) ?? "—"} •{" "}
                          {season.episodes?.length ?? 0} Episodes
                        </p>

                        <p className="text-xs mt-2 line-clamp-2">
                          {season.overview || "No overview available."}
                        </p>
                      </div>

                      <span className="text-xl">
                        {isOpen ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            width="24"
                            height="24"
                          >
                            <path d="M18 15l-6-6-6 6" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            width="24"
                            height="24"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        )}
                      </span>
                    </div>

                    {/* EPISODES */}
                    {isOpen && season.episodes?.length > 0 && (
                      <div className="w-full md:w-[95%] lg:w-[90%] ml-auto border-t border-gray-700 divide-y divide-gray-700">
                        {season.episodes.map((ep) => {
                          // 🔥 progress lookup
                          const key = `${season.season_number}-${ep.episode_number}`;
                          const p = progressMap.get(key);

                          const isWatching = p?.status === "watching";
                          const isWatched = p?.status === "completed";

                          const isLatest =
                            progress?.[0]?.season === season.season_number &&
                            progress?.[0]?.episode === ep.episode_number;

                          return (
                            <div
                              key={ep.id}
                              id={`s${String(season.season_number).padStart(2, "0")}e${String(
                                ep.episode_number,
                              ).padStart(2, "0")}`}
                              className={`p-4 flex flex-col mx-1 md:flex-row gap-4 scroll-mt-32 transition
                        ${isLatest ? "ring-2 ring-teal-400 bg-amber-500/5" : ""}
                        hover:bg-gray-700/40`}
                            >
                              {/* Thumbnail */}
                              <div className="relative">
                                <img
                                  src={
                                    ep.still_path
                                      ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
                                      : "/placeholder.png"
                                  }
                                  alt={ep.name}
                                  className="w-full sm:w-32 md:w-40 aspect-video object-cover rounded shadow-md"
                                />

                                {/* ✔ Watched Badge */}
                                {isWatched && (
                                  <div className="absolute top-1 right-1 bg-emerald-500 text-white text-xs px-1.5 rounded">
                                    ✓
                                  </div>
                                )}
                              </div>

                              {/* Info */}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold truncate">
                                    E{ep.episode_number} • {ep.name}
                                  </p>

                                  {/* ▶ Watching badge */}
                                  {isWatching && (
                                    <span className="text-[10px] px-2 py-0.5 bg-amber-500 text-black rounded font-semibold">
                                      Watching
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-gray-400 mb-2">
                                  {ep.air_date ?? "TBA"}
                                  {ep.runtime ? ` • ${ep.runtime} min` : ""}
                                </p>

                                {ep.overview && (
                                  <p className="text-xs line-clamp-2 text-gray-300">
                                    {ep.overview}
                                  </p>
                                )}

                                {/* ▶ Progress bar */}
                                {isWatching && p?.durationSeconds && (
                                  <div className="w-full h-1 bg-gray-600 rounded mt-2 overflow-hidden">
                                    <div
                                      className="h-full bg-amber-400"
                                      style={{
                                        width: `${(p.progressSeconds / p.durationSeconds) * 100}%`,
                                      }}
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Watch Button */}
                              <Link
                                className="bg-teal-600 hover:bg-teal-700 text-xs md:text-sm text-white px-4 py-2 rounded font-medium whitespace-nowrap self-start md:self-center"
                                to={`/watch/${media}/${id}/${season.season_number}/${ep.episode_number}`}
                                state={{
                                  title: item.title || item.name,
                                  poster: item.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                    : "/placeholder.png",
                                  backdrop: ep.still_path
                                    ? `https://image.tmdb.org/t/p/w185${ep.still_path}`
                                    : "/placeholder.png",
                                  mediaType: media,
                                  mediaId: id,
                                }}
                              >
                                Watch S{season.season_number}E
                                {ep.episode_number}
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <MediaVideos data={item} />
      <SimilarContent key={item?.id} media={media} id={id} />
    </div>
  );
};

export default Details;
