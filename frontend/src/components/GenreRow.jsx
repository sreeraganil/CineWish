import { useRef } from "react";
import { Link } from "react-router-dom";
import GENRES from "../utilities/genres.json";

const GRADIENTS = [
  "from-red-600/80 to-black",
  "from-purple-600/80 to-black",
  "from-teal-600/80 to-black",
  "from-orange-600/80 to-black",
  "from-pink-600/80 to-black",
  "from-indigo-600/80 to-black",
  "from-emerald-600/80 to-black",
  "from-yellow-500/70 to-black",
];

const GenreRow = () => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({
      left: dir * (scrollRef.current.clientWidth - 200),
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-gray-950 py-2 sm:py-4 px-2 sm:px-4 text-white relative">
      <div className="max-w-8xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-teal-400">
          Browse by Genre
        </h2>

        <div className="relative group/button">
          {/* LEFT BUTTON */}
          <button
            onClick={() => scroll(-1)}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition-all duration-200 p-2 rounded-full items-center justify-center opacity-0 group-hover/button:opacity-100"
            aria-label="Scroll left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>

          {/* RIGHT BUTTON */}
          <button
            onClick={() => scroll(1)}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition-all duration-200 p-2 rounded-full items-center justify-center opacity-0 group-hover/button:opacity-100"
            aria-label="Scroll right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>

          {/* SCROLL CONTAINER */}
          <div
            ref={scrollRef}
            className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2 sm:px-3 md:px-5 py-1 -mx-2 sm:mx-0 pb-1"
          >
            {GENRES.map((genre, i) => {
              const gradient = GRADIENTS[i % GRADIENTS.length];

              return (
                <Link
                  key={genre.id}
                  to={`/genre/${genre.id}`}
                  className="group flex-none w-[160px] sm:w-[200px] md:w-[240px] lg:w-[260px] aspect-video rounded-lg sm:rounded-xl overflow-hidden relative hover:ring-2 hover:ring-teal-400/60 hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  {genre.image ? (
                    <img
                      src={genre.image}
                      alt={genre.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
                    />
                  )}

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />

                  {/* Genre name */}
                  <div className="relative h-full flex items-end p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold tracking-wide text-white drop-shadow-lg">
                      {genre.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenreRow;
