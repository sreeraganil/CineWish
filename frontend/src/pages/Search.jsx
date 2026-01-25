import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import API from "../config/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import userStore from "../store/userStore";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import CardSkeleton from "../components/CardSkeleton";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { searchResult, setSearchResult } = userStore();
  const inputRef = useRef(null);

  // Suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);

  // Infinite scroll
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [activeIndex, setActiveIndex] = useState(-1);

  const searchContainerRef = useRef(null);
  const suggestionsContainerRef = useRef(null);
  const suggestionItemRefs = useRef([]);

  const observerRef = useRef(null);

  const query = searchParams.get("q") || "";
  const type = searchParams.get("t") || "";

  useEffect(() => {
    if (!query) {
      setSearchResult([]);
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (query.trim()) {
      handleSearch(); // Re-search for page 1
    }
  }, [type]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setActiveIndex(-1);
    suggestionItemRefs.current = [];

    const timer = setTimeout(() => {
      if (focused) fetchSuggestions(query);
    }, 600);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeIndex < 0 || !suggestionsContainerRef.current) return;
    const itemEl = suggestionItemRefs.current[activeIndex];
    if (itemEl) {
      itemEl.scrollIntoView({ behavior: "auto", block: "nearest" });
    }
  }, [activeIndex]);

  useEffect(() => {
    if (page > 1) {
      fetchMoreData();
    }
  }, [page]);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        setPage((prev) => prev + 1);
      }
    });

    const elem = observerRef.current;
    if (elem) observer.observe(elem);

    return () => elem && observer.unobserve(elem);
  }, [hasMore, loading]);

  const fetchSuggestions = async (currentQuery) => {
    setIsSuggestionsLoading(true);
    try {
      const { data } = await API.get(`/tmdb/search`, {
        params: { query: currentQuery, type: "multi" },
      });

      const items = Array.isArray(data.data) ? data.data : [];

      const topResults = items
        .filter(
          (item) => item.media_type === "tv" || item.media_type === "movie",
        )
        .slice(0, 7);

      setSuggestions(topResults);
      setShowSuggestions(topResults.length > 0);
    } catch (err) {
      console.error("Suggestion error:", err);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsSuggestionsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    setShowSuggestions(false);
    inputRef.current?.blur();
    setActiveIndex(-1);

    const currentQuery = searchParams.get("q") || "";
    const currentType = searchParams.get("t") || "multi";

    if (!currentQuery.trim()) return;

    setLoading(true);
    setPage(1);
    setSearchResult([]);
    setHasMore(false);

    try {
      const { data } = await API.get(`/tmdb/search`, {
        params: { query: currentQuery, type: currentType, page: 1 },
      });

      const items = Array.isArray(data.data) ? data.data : [];

      setSearchResult(items);
      setHasMore((data.total_pages || 0) > 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreData = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/tmdb/search`, {
        params: { query, type: type || "multi", page },
      });

      const items = Array.isArray(data.data) ? data.data : [];

      setSearchResult([...searchResult, ...items]);
      setHasMore((data.total_pages || 0) > page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (media_type, id) => {
    if (!media_type || !id) return;
    navigate(`/details/${media_type}/${id}`);
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const handleChange = (e, param) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams(
      { ...currentParams, [param]: e.target.value },
      { replace: true },
    );
    setFocused(true);
  };

  const handleFocus = () => {
    if (query.trim().length > 1 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev === suggestions.length - 1 ? 0 : prev + 1,
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev <= 0 ? suggestions.length - 1 : prev - 1,
        );
        break;

      case "Enter":
        if (activeIndex > -1) {
          e.preventDefault();
          const item = suggestions[activeIndex];
          handleClick(item.media_type, item.id);
        }
        break;

      case "Escape":
        setShowSuggestions(false);
        setActiveIndex(-1);
        break;

      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white pb-20 md:pb-0">
      <Header />

      <div
        ref={searchContainerRef}
        className="relative max-w-xl mx-1 sm:mx-auto my-6 flex gap-1 sm:gap-2 items-center"
      >
        <form
          onSubmit={handleSearch}
          className="relative flex items-center flex-1"
        >
          <input
            type="text"
            ref={inputRef}
            value={query}
            onChange={(e) => handleChange(e, "q")}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder={
              type === "movie"
                ? "Search for movies..."
                : type === "tv"
                  ? "Search for series..."
                  : "Search for movies or series..."
            }
            className="flex-1 px-4 pr-12 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            autoComplete="off"
          />

          <span
            onClick={handleSearch}
            className="material-symbols-outlined absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
          >
            search
          </span>

          {showSuggestions && (
            <div
              ref={suggestionsContainerRef}
              className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto"
            >
              {isSuggestionsLoading ? (
                <p className="text-gray-400 text-sm p-3 text-center">
                  Loading...
                </p>
              ) : (
                <ul className="divide-y divide-gray-700">
                  {(suggestionItemRefs.current = []) && null}
                  {suggestions.length > 0 ? (
                    suggestions.map((item, index) => (
                      <li
                        ref={(el) => (suggestionItemRefs.current[index] = el)}
                        key={item.id}
                        onClick={() => handleClick(item.media_type, item.id)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`flex items-center p-2 cursor-pointer transition-colors ${
                          activeIndex === index
                            ? "bg-gray-700"
                            : "hover:bg-gray-700"
                        }`}
                      >
                        <img
                          src={
                            item.poster_path
                              ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                              : "/placeholder.png"
                          }
                          alt={item.title || item.name}
                          className="w-10 h-14 object-cover rounded flex-shrink-0"
                        />
                        <div className="ml-3 overflow-hidden">
                          <h4 className="text-sm font-semibold truncate">
                            {item.title || item.name}
                          </h4>
                          <p className="text-xs text-gray-400 capitalize">
                            {item.media_type === "movie" ? "Movie" : "TV Show"}
                            {(item.release_date || item.first_air_date) &&
                              ` (${(
                                item.release_date || item.first_air_date
                              ).slice(0, 4)})`}
                          </p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm p-3 text-center">
                      No suggestions found
                    </p>
                  )}
                </ul>
              )}
            </div>
          )}
        </form>

        <div className="sm:px-2 bg-gray-800 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-500">
          <select
            name="type"
            value={type}
            onChange={(e) => handleChange(e, "t")}
            className="bg-gray-800 text-white py-[10px] text-sm border-none outline-none"
          >
            <option value="">All</option>
            <option value="movie">Movies</option>
            <option value="tv">TV</option>
          </select>
        </div>
      </div>

      {loading && page === 1 && (
        <p className="text-center text-gray-400">Loading...</p>
      )}

      {!loading && page === 1 && searchResult?.length === 0 && (
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8 gap-4 px-4 md:mx-5 pb-4">
        {searchResult?.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            onClick={() => handleClick(item.media_type || type, item.id)}
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
              {!!(item.vote_average && parseFloat(item.vote_average) > 0) && (
                <div className="absolute top-2 left-2">
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                    <svg
                      className="w-3 h-3 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white text-xs font-semibold">
                      {item.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <span className="absolute top-2 right-2 bg-teal-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase shadow-md">
              {item.media_type || type}
            </span>
          </div>
        ))}

        {loading &&
          Array.from({ length: 12 }).map((_, i) => (
            <CardSkeleton key={`skeleton-${i}`} />
          ))}
      </div>

      <div ref={observerRef} className="h-20 flex justify-center items-center">
        {loading && page > 1 && hasMore && (
          <p className="text-gray-400">Loading more...</p>
        )}
      </div>
    </div>
  );
};

export default Search;
