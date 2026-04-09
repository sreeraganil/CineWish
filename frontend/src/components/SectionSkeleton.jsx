import { useRef } from "react";

const SectionSkeleton = ({ title = "Loading...", CardSkeleton }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount =
      direction === 1 ? scrollLeft + clientWidth : scrollLeft - clientWidth;
    scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="bg-gray-950 p-2 sm:p-4 text-white relative">
      <div className="max-w-8xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-teal-400">
          {title}
        </h2>

        <div className="relative group/button">
          {/* LEFT BUTTON */}
          <button
            onClick={() => scroll(-1)}
            className="hidden sm:flex absolute justify-center items-center left-0 top-1/2 -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition-all duration-200 p-2 rounded-full opacity-0 group-hover/button:opacity-100"
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
            className="hidden sm:flex absolute justify-center items-center right-0 top-1/2 -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition-all duration-200 p-2 rounded-full opacity-0 group-hover/button:opacity-100"
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

          {/* SKELETON SCROLLER */}
          <div
            ref={scrollRef}
            className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2 sm:px-3 md:px-5 -mx-2 sm:mx-0 pb-1"
          >
            {Array(10)
              .fill("")
              .map((_, i) => (
                <CardSkeleton key={i} />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionSkeleton;
