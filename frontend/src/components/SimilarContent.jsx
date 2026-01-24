import { useEffect, useRef } from "react";
import SectionSkeleton from "./SectionSkeleton";
import CardSkeleton from "./CardSkeleton";
import userStore from "../store/userStore";
import TrendingCard from "./TrendingCard";

const SimilarContent = ({ media, id }) => {
  const scrollRef = useRef(null);
  const sentinelRef = useRef(null);

  const { similar, fetchSimilar } = userStore();

  useEffect(() => {
    if (!id || !media) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && similar.length === 0) {
          fetchSimilar(media, id, 'recommendations');
        }
      },
      { rootMargin: "400px" },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [id, media, similar.length, fetchSimilar]);

  const scroll = (direction) => {
    const { current } = scrollRef;

    if (!current) return;

    const scrollAmount = direction * current.offsetWidth - 250;

    current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  if (similar.length === 0) {
    return (
      <>
        <span ref={sentinelRef}></span>
        <SectionSkeleton
          title={`Similar ${media === "tv" ? "TV Shows" : "Movies"}`}
          CardSkeleton={CardSkeleton}
        />
      </>
    );
  }

  return (
    <>
      <section className="bg-gray-950 p-4 text-white relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-teal-400">
            {`Similar ${media === "tv" ? "TV Shows" : "Movies"}`}
          </h2>

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
              {similar.map((item) => (
                <TrendingCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SimilarContent;
