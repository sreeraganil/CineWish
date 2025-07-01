import { useEffect, useState } from "react";
import Header from "../components/Header";
import API from "../config/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import userStore from "../store/userStore";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { searchResult, setSearchResult } = userStore();

  useEffect(()=>{
    const query = searchParams.get("q") || "";
    !query && setSearchResult([])
  },[])

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = searchParams.get("q") || "";
    if (!query.trim()) return;

    setLoading(true);
    setSearchResult([]);
    try {
      const { data } = await API.get(`/tmdb/search`, {
        params: { query },
      });
      setSearchResult(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (media, id) => {
    navigate(`/details/${media}/${id}`)
  }

  const handleChange = (e) => {
    setSearchParams({ q: e.target.value })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white pb-20 md:pb-0">
      <Header />
      <form
        onSubmit={handleSearch}
        className="relative max-w-xl mx-2 sm:mx-auto my-6"
      >
        <input
          type="text"
          autoFocus
          value={searchParams.get("q") || ""}
          onChange={handleChange}
          placeholder="Search for movies or series..."
          className="w-full px-4 pr-12 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <span onClick={handleSearch} className="material-symbols-outlined absolute top-1/2 right-4 transform translate-y-[-50%] cursor-pointer">
          search
        </span>
      </form>

      {loading && <p className="text-center text-gray-400">Loading...</p>}

      {!loading && searchResult?.length === 0 && (
        <p className="text-center text-gray-600">No results</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 px-4 pb-4">
        {searchResult?.filter(
            (item) => item.media_type == "tv" || item.media_type == "movie"
          )
          .map((item) => (
            <div
              key={item.id}
              onClick={()=>handleClick(item.media_type, item.id)}
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
                <p className="text-xs text-teal-400 mt-1">Rating: {parseFloat(item.vote_average.toFixed(1)) || "N/A"}</p>
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
