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
  const [openSeason, setOpenSeason] = useState(null);
  const [season, setSeason] = useState([]);

  const { addToWishlist } = wishlistStore();
  const { user } = userStore();

  useEffect(() => {
    if (user) checkStatus();
  }, [id, user]);

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
        `Added to ${status === "towatch" ? "wishlist" : "watched list"}`
      );
      checkStatus();
    } catch (err) {
      toast.error("Failed to add");
    } finally {
      setClicked(false);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await API.get(`/tmdb/details/${media}/${id}`);
        setItem(data);
        console.log(data.episodes);
      } catch (err) {
        console.error("Failed to fetch details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
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
    console.log(openSeason);
  };

  if (loading)
    return (
      <div className="h-screen">
        <Loader />
      </div>
    );

  if (!item)
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Failed to load details
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
    <>
      <BackHeader title="Details" />

      <div className="fixed inset-0 -z-10">
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
            className={`absolute right-6 top-6 px-3 py-1 rounded-lg font-semibold ${
              isImdb ? "bg-[#f5c518] text-black" : "bg-[#032541] text-white"
            }`}
          >
            {isImdb ? "IMDb" : "TMDB"} {primaryRating.toFixed(1)} (
            {formatVotes(primaryVotes)})
          </div>
        )}

        <h1 className="text-4xl font-bold mb-2 pt-16">
          {item.title || item.name}
        </h1>

        {item.tagline && (
          <p className="italic text-gray-300 mb-6">"{item.tagline}"</p>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          <div>
            <img
              src={
                item.poster_path
                  ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                  : "https://via.placeholder.com/300x450"
              }
              alt={item.title || item.name}
              loading="eager"
              className="w-64 aspect-[2/3] rounded-xl shadow-lg flex-shrink-0"
            />
          </div>

          <div className="flex-1 space-y-5">
            {item.overview && (
              <p className="text-gray-300 leading-relaxed">{item.overview}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {/* Release Date vs First Air Date */}
              {item.release_date && (
                <div>
                  <span className="text-gray-400">Release Date:</span>{" "}
                  {item.release_date}
                </div>
              )}
              {item.first_air_date && media === "tv" && (
                <div>
                  <span className="text-gray-400">First Air Date:</span>{" "}
                  {item.first_air_date}
                </div>
              )}

              {/* Runtime: Movie vs TV */}
              {media === "movie" && item.runtime > 0 && (
                <div>
                  <span className="text-gray-400">Runtime:</span> {item.runtime}{" "}
                  min
                </div>
              )}
              {media === "tv" && item.episode_run_time?.length > 0 && (
                <div>
                  <span className="text-gray-400">Episode Length:</span>{" "}
                  {formatDuration(item.episode_run_time)}
                </div>
              )}

              {/* TV Specific Counts */}
              {media === "tv" && item.number_of_seasons > 0 && (
                <div>
                  <span className="text-gray-400">Seasons:</span>{" "}
                  {item.number_of_seasons}
                </div>
              )}
              {media === "tv" && item.number_of_episodes > 0 && (
                <div>
                  <span className="text-gray-400">Total Episodes:</span>{" "}
                  {item.number_of_episodes}
                </div>
              )}

              {/* Movie Specific Financials */}
              {item.budget > 0 && media === "movie" && (
                <div>
                  <span className="text-gray-400">Budget:</span> $
                  {item.budget.toLocaleString()}
                </div>
              )}
              {item.revenue > 0 && media === "movie" && (
                <div>
                  <span className="text-gray-400">Box Office:</span> $
                  {item.revenue.toLocaleString()}
                </div>
              )}

              {/* Shared Details */}
              {item.genres?.length > 0 && (
                <div>
                  <span className="text-gray-400">Genres:</span>{" "}
                  {item.genres.map((g) => g.name).join(", ")}
                </div>
              )}

              {item.production_countries?.length > 0 && (
                <div>
                  <span className="text-gray-400">Countries:</span>{" "}
                  {item.production_countries.map((c) => c.name).join(", ")}
                </div>
              )}

              {item.spoken_languages?.length > 0 && (
                <div>
                  <span className="text-gray-400">Languages:</span>{" "}
                  {item.spoken_languages.map((l) => l.english_name).join(", ")}
                </div>
              )}

              {item.status && (
                <div>
                  <span className="text-gray-400">Status:</span> {item.status}
                </div>
              )}
            </div>

            {/* Crew/Creators Section */}
            {(director ||
              creators?.length > 0 ||
              composers.length ||
              producers.length) && (
              <div className="pt-4 text-sm space-y-1">
                {/* TV Creator */}
                {media === "tv" && creators?.length > 0 && (
                  <div>
                    <span className="text-gray-400">Created By:</span>{" "}
                    {creators.map((c) => c.name).join(", ")}
                  </div>
                )}
                {/* Movie Director */}
                {media === "movie" && director && (
                  <div>
                    <span className="text-gray-400">Director:</span>{" "}
                    {director.name}
                  </div>
                )}
                {composers.length > 0 && (
                  <div>
                    <span className="text-gray-400">Music:</span>{" "}
                    {composers.map((c) => c.name).join(", ")}
                  </div>
                )}
                {producers.length > 0 && (
                  <div>
                    <span className="text-gray-400">Producers:</span>{" "}
                    {producers.map((p) => p.name).join(", ")}
                  </div>
                )}
              </div>
            )}

            {user && (
              <div className="flex flex-wrap gap-3 pt-4">
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
              </div>
            )}
          </div>
        </div>

        {hasProviders && (
          <div className="pt-6 space-y-6 border-t border-gray-700/50">
            <h3 className="text-xl font-bold text-teal-400">
              <i className="fas fa-tv mr-2"></i> Watch Options
            </h3>

            <div className="space-y-6">
              {/* 1. Flatrate (Streaming) Providers */}
              {flatrateProviders.length > 0 && (
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-base font-semibold text-gray-200 mb-3 border-b border-gray-600 pb-2">
                    Stream Subscription
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {flatrateProviders.map((provider) => (
                      <div
                        key={provider.provider_id}
                        className="relative group flex flex-col items-center w-24"
                      >
                        <img
                          src={`${IMAGE_BASE_URL}${provider.logo_path}`}
                          alt={provider.provider_name}
                          className="w-14 h-14 object-cover rounded-md shadow-lg transition-transform duration-200 hover:scale-105"
                        />
                        <p className="mt-1 text-xs text-gray-400 group-hover:text-white transition-colors w-full text-center overflow-hidden whitespace-nowrap text-ellipsis">
                          {provider.provider_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Rent Providers */}
              {rentProviders.length > 0 && (
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-base font-semibold text-gray-200 mb-3 border-b border-gray-600 pb-2">
                    Rent
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {rentProviders.map((provider) => (
                      <div
                        key={provider.provider_id}
                        className="relative group flex flex-col items-center w-24" // FIXED WIDTH
                      >
                        <img
                          src={`${IMAGE_BASE_URL}${provider.logo_path}`}
                          alt={provider.provider_name}
                          className="w-14 h-14 object-cover rounded-md shadow-lg transition-transform duration-200 hover:scale-105"
                        />
                        <p className="mt-1 text-xs text-gray-400 group-hover:text-white transition-colors w-full text-center overflow-hidden whitespace-nowrap text-ellipsis">
                          {provider.provider_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Buy Providers */}
              {buyProviders.length > 0 && (
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-base font-semibold text-gray-200 mb-3 border-b border-gray-600 pb-2">
                    Buy
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {buyProviders.map((provider) => (
                      <div
                        key={provider.provider_id}
                        className="relative group flex flex-col items-center w-24"
                      >
                        <img
                          src={`${IMAGE_BASE_URL}${provider.logo_path}`}
                          alt={provider.provider_name}
                          className="w-14 h-14 object-cover rounded-md shadow-lg transition-transform duration-200 hover:scale-105"
                        />
                        <p className="mt-1 text-xs text-gray-400 group-hover:text-white transition-colors w-full text-center overflow-hidden whitespace-nowrap text-ellipsis">
                          {provider.provider_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* New TV Next/Last Episode Info */}
        {media === "tv" && (item.lastEpisodeToAir || item.nextEpisodeToAir) && (
          <div className="pt-8 bg-gray-900/50 p-4 rounded-lg mt-4">
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
            <div className="flex items-center gap-4 bg-gray-900/50 p-4 rounded-lg">
              {item.belongs_to_collection.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${item.belongs_to_collection.poster_path}`}
                  className="w-20 rounded"
                  alt={item.belongs_to_collection.name}
                />
              )}
              <p>{item.belongs_to_collection.name}</p>
            </div>
          </div>
        )}

        {/* Cast - Note: Uses 'aggregate_credits' structure for TV */}
        {topCast.length > 0 && (
          <div className="pt-8">
            <h3 className="text-lg font-semibold mb-4">Top Cast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 overflow-x-auto pb-4">
              {topCast.map((c) => (
                <div
                  key={c.id || c.credit_id}
                  className="text-center w-full min-w-[100px]"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w185${c.profile_path}`}
                    alt={c.name}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png";
                    }}
                    className="aspect-[2/3] rounded-lg mb-2 w-full h-auto object-cover"
                  />

                  <p className="text-sm font-medium leading-tight">{c.name}</p>
                  <p className="text-xs text-gray-400 leading-tight">
                    {/* Character is nested differently for TV shows */}
                    {media === "tv" ? c.roles?.[0]?.character : c.character}
                  </p>
                </div>
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
                    key={season._id}
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
                            : "https://via.placeholder.com/100x150"
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

                      <span className="material-symbols-outlined text-xl">
                        {isOpen ? "expand_less" : "expand_more"}
                      </span>
                    </div>

                    {/* EPISODES DROPDOWN */}
                    {isOpen && season.episodes?.length > 0 && (
                      <div className="w-[90%] ml-auto border-t border-gray-700 divide-y divide-gray-700">
                        {season.episodes.map((ep) => (
                          <div
                            key={ep.id}
                            className="p-4 flex gap-4 hover:bg-gray-700/40"
                          >
                            <img
                              src={
                                ep.still_path
                                  ? `https://image.tmdb.org/t/p/w185${ep.still_path}`
                                  : "/placeholder.png"
                              }
                              alt={ep.name}
                              className="w-32 h-20 object-cover rounded"
                            />

                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                E{ep.episode_number} • {ep.name}
                              </p>

                              <p className="text-xs text-gray-400">
                                {ep.air_date ?? "TBA"}
                                {ep.runtime ? ` • ${ep.runtime} min` : ""}
                              </p>

                              {ep.overview && (
                                <p className="text-xs mt-1 line-clamp-2 text-gray-300">
                                  {ep.overview}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Details;
