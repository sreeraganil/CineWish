import { useEffect, useState } from "react";
import Header from "../components/Header";
import API from "../config/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import userStore from "../store/userStore";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { searchResult, setSearchResult } = userStore();

  const type = searchParams.get("t") || "";

  useEffect(() => {
    const query = searchParams.get("q") || "";
    !query && setSearchResult([]);
  }, []);

  useEffect(() => {
    handleSearch();
  }, [type]);

  const handleSearch = async (e) => {
    e && e.preventDefault();
    const query = searchParams.get("q") || "";
    const type = searchParams.get("t") || "multi";
    if (!query.trim()) return;

    setLoading(true);
    setSearchResult([]);
    try {
      const { data } = await API.get(`/tmdb/search`, {
        params: { query, type },
      });
      setSearchResult(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (media, id) => {
    navigate(`/details/${media}/${id}`);
  };

  const handleChange = (e, param) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    console.log(searchParams);
    console.log(currentParams)
    setSearchParams(
      {
        ...currentParams,
        [param]: e.target.value,
      },
      { replace: true }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white pb-20 md:pb-0">
      <Header />
      <div className="relative max-w-xl mx-1 sm:mx-auto my-6 flex gap-1 sm:gap-2 items-center">
        <form
          onSubmit={handleSearch}
          className="relative flex items-center flex-1"
        >
          <input
            type="text"
            autoFocus
            value={searchParams.get("q") || ""}
            onChange={(e) => handleChange(e, "q")}
            placeholder={
              type == "multi"
                ? "Search for movies or series..."
                : type == "movie"
                ? "Search for movies..."
                : "Search for series..."
            }
            className="flex-1 px-4 pr-12 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <span
            onClick={handleSearch}
            className="material-symbols-outlined absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
          >
            search
          </span>
        </form>

        <div className="sm:px-2 bg-gray-800 rounded-lg overflow-hidden focus:outline-none hover:ring-2 hover:ring-teal-500">
          <select
            name="type"
            value={searchParams.get("t") || ""}
            onChange={(e) => handleChange(e, "t")}
            className="bg-gray-800 text-white py-[10px] text-sm border-none outline-none"
          >
            <option value="multi">All</option>
            <option value="movie">Movies</option>
            <option value="tv">TV</option>
          </select>
        </div>
      </div>

      {loading && <p className="text-center text-gray-400">Loading...</p>}

      {!loading && searchResult?.length === 0 && (
        <div className="relative w-full flex flex-col items-center justify-center gap-4">
          <DotLottieReact
            src="/lottie/no_result.lottie"
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
          <p className="text-center text-gray-600">No results</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8  gap-4 px-4 md:mx-5 pb-4">
        {searchResult
          ?.filter(
            (item) =>
              type !== "multi" ||
              item.media_type == "tv" ||
              item.media_type == "movie"
          )
          .map((item) => (
            <div
              key={item.id}
              onClick={() => handleClick(item.media_type, item.id)}
              className="relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow hover:shadow-teal-500/10 transition"
            >
              <img
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : "/placeholder.png"
                }
                alt={item.title || item.name}
                className="h-60 w-full object-cover object-top"
              />
              <div className="p-3">
                <h3 className="text-sm font-semibold truncate">
                  {item.title || item.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {item.release_date?.slice(0, 4) ||
                    item.first_air_date?.slice(0, 4) ||
                    "N/A"}
                </p>
                <p className="text-xs text-teal-400 mt-1">
                  Rating: {parseFloat(item.vote_average?.toFixed(1)) || "N/A"}
                </p>
              </div>
              <span className="absolute top-2 right-2 bg-teal-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase shadow-md">
                {item.media_type}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Search;
