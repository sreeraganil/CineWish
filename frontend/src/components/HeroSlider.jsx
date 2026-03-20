import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../config/axios";

const HeroSlider = () => {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const cached = sessionStorage.getItem("heroSlider");

      if (cached) {
        setItems(JSON.parse(cached));
        return;
      }

      try {
        const { data } = await API.get("/tmdb/discover", {
          params: {
            media: "movie",
            sort_by: "primary_release_date.desc",
            "primary_release_date.lte": new Date().toISOString().split("T")[0],
            "vote_average.gte": 6.5,
            "vote_count.gte": 100,
          },
        });

        const filtered = data.results
          .filter((item) => item.backdrop_path && item.overview)
          .slice(0, 8);

        sessionStorage.setItem("heroSlider", JSON.stringify(filtered));
        setItems(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!items.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items]);

  if (!items.length) return null;

  const currentItem = items[index];

  return (
    <div className="relative w-full h-[70vh] overflow-hidden bg-gray-950">
      {/* Slides */}
      {items.map((item, i) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === index ? "opacity-100 z-10" : "opacity-0"
          }`}
        >
          <img
            src={`https://image.tmdb.org/t/p/original/${item.backdrop_path}`}
            alt={item.title || item.name}
            className="w-full h-full object-cover"
          />

          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-end">
        <div className="max-w-7xl mx-auto w-full px-6 pb-16">
          <div className="max-w-2xl space-y-4">
            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-2xl">
              {currentItem.title || currentItem.name}
            </h2>

            {/* Meta info */}
            <div className="flex items-center gap-3 text-sm">
              {currentItem.vote_average && (
                <div className="flex items-center gap-1.5 bg-teal-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-teal-400/30">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-teal-400"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span className="text-teal-300 font-semibold">
                    {currentItem.vote_average.toFixed(1)}
                  </span>
                </div>
              )}
              {currentItem.release_date && (
                <span className="text-gray-300 font-medium">
                  {new Date(currentItem.release_date).getFullYear()}
                </span>
              )}
            </div>

            {/* Overview */}
            <p className="text-gray-300 text-base leading-relaxed line-clamp-3">
              {currentItem.overview}
            </p>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Link
                to={`/details/movie/${currentItem.id}`}
                className="bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg shadow-teal-500/30 hover:shadow-teal-400/50 hover:-translate-y-0.5 flex items-center gap-2"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() =>
          setIndex((prev) => (prev - 1 + items.length) % items.length)
        }
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-gray-900/70 backdrop-blur-sm hover:bg-gray-800 border border-gray-700 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 opacity-0 hover:opacity-100 group-hover/slider:opacity-100"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      <button
        onClick={() => setIndex((prev) => (prev + 1) % items.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-gray-900/70 backdrop-blur-sm hover:bg-gray-800 border border-gray-700 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 opacity-0 hover:opacity-100 group-hover/slider:opacity-100"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === index
                ? "w-8 bg-teal-400"
                : "w-1.5 bg-gray-500 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Add group class for arrow visibility */}
      <div className="group/slider absolute inset-0 pointer-events-none" />
    </div>
  );
};

export default HeroSlider;
