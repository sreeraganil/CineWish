import { useRef } from "react";

const SectionSkeleton = ({ title = "Loading..." , CardSkeleton }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = direction === 1 ? scrollLeft + clientWidth : scrollLeft - clientWidth;
    scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="bg-gray-950 p-4 text-white relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-teal-400">{title}</h2>

        <div className="relative">
          <button
            onClick={() => scroll(-1)}
            className="hidden absolute sm:flex justify-center items-center left-0 top-1/2 transform -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-2 rounded-full"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          <button
            onClick={() => scroll(1)}
            className="hidden absolute sm:flex justify-center items-center right-0 top-1/2 transform -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-2 rounded-full"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2 md:px-5"
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
