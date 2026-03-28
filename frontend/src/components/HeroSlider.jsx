import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import API from "../config/axios";

const HeroSlider = () => {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);

  // Touch tracking refs
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isDragging = useRef(false);

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
            sort_by: "popularity.desc",

            "primary_release_date.gte": getDateDaysAgo(45),
            "primary_release_date.lte": today(),

            "vote_average.gte": 6.0,
            "vote_count.gte": 20,
          },
        });

        const filtered = data.results
          .filter((item) => item.backdrop_path && item.overview)
          .slice(0, 10);

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

  const today = () => new Date().toISOString().split("T")[0];

  const getDateDaysAgo = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split("T")[0];
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    // Mark as horizontal drag only if X movement dominates
    if (dx > dy && dx > 5) {
      isDragging.current = true;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || !isDragging.current) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const SWIPE_THRESHOLD = 50;

    if (deltaX < -SWIPE_THRESHOLD) {
      // Swipe left → next
      setIndex((prev) => (prev + 1) % items.length);
    } else if (deltaX > SWIPE_THRESHOLD) {
      // Swipe right → prev
      setIndex((prev) => (prev - 1 + items.length) % items.length);
    }

    touchStartX.current = null;
    touchStartY.current = null;
    isDragging.current = false;
  };

  if (!items.length) return null;

  const currentItem = items[index];

  return (
    <div
      className="group/slider relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-gray-950"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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
            className="w-full h-full object-cover object-[center_10%]"
          />

          {/* overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-transparent to-transparent" />

          {/* ✅ Animated content */}
          <div
            className={`absolute inset-0 z-20 flex items-end transition-all duration-700 ${
              i === index
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <div className="max-w-7xl mx-auto w-full px-6 pb-16">
              <div className="max-w-2xl space-y-4">
                {/* 🎬 Title */}
                <h2
                  className={`text-3xl md:text-5xl font-bold text-white transition-all duration-700 ${
                    i === index
                      ? "opacity-100 translate-y-0 delay-100"
                      : "opacity-0 translate-y-6"
                  }`}
                >
                  {item.title || item.name}
                </h2>

                <div
                  className={`flex items-center gap-3 text-sm ${
                    i === index
                      ? "opacity-100 translate-y-0 delay-200"
                      : "opacity-0 translate-y-6"
                  }`}
                >
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

                {/* 📄 Overview */}
                <p
                  className={`text-gray-300 text-base leading-relaxed line-clamp-3 transition-all duration-700 ${
                    i === index
                      ? "opacity-100 translate-y-0 delay-300"
                      : "opacity-0 translate-y-6"
                  }`}
                >
                  {item.overview}
                </p>

                <div
                  className={`pt-2 transition-all duration-700 ${
                    i === index
                      ? "opacity-100 translate-y-0 delay-500"
                      : "opacity-0 translate-y-6"
                  }`}
                >
                  <Link
                    to={`/details/movie/${item.id}`}
                    className="bg-teal-500 hover:bg-teal-400 text-white px-3 py-2 rounded-lg text-sm font-semibold"
                  >
                    More Info
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows — hidden on mobile, visible on hover for desktop */}
      <button
        onClick={() =>
          setIndex((prev) => (prev - 1 + items.length) % items.length)
        }
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-gray-900/70 backdrop-blur-sm hover:bg-gray-800 border border-gray-700 w-12 h-12 rounded-full items-center justify-center transition-all duration-300 hover:scale-110 hidden md:flex opacity-0 group-hover/slider:opacity-90 text-teal-500"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      <button
        onClick={() => setIndex((prev) => (prev + 1) % items.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-gray-900/70 backdrop-blur-sm hover:bg-gray-800 border border-gray-700 w-12 h-12 rounded-full items-center justify-center transition-all duration-300 hover:scale-110 hidden md:flex opacity-0 group-hover/slider:opacity-90 text-teal-500"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
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
    </div>
  );
};

export default HeroSlider;
