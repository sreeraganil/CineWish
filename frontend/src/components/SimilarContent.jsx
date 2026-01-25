import { useEffect, useRef, useState } from "react";
import SectionSkeleton from "./SectionSkeleton";
import CardSkeleton from "./CardSkeleton";
import userStore from "../store/userStore";
import TrendingCard from "./TrendingCard";

const SimilarContent = ({ media, id }) => {
  const scrollRef = useRef(null);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const { similar, fetchSimilar, resetSimilar } = userStore();

  useEffect(() => {
    if (!id || !media) return;

    resetSimilar();
  }, [id, media]);

  useEffect(() => {
    if (!id || !media) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          await fetchSimilar(media, id, "recommendations");
          setLoading(false);
        }
      },
      { rootMargin: "400px" },
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [id, media, fetchSimilar]);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (!current) return;

    const scrollAmount = direction * current.offsetWidth - 250;

    current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <>
        <span ref={sentinelRef} className="block h-1" />

        <SectionSkeleton
          title={`Similar ${media === "tv" ? "TV Shows" : "Movies"}`}
          CardSkeleton={CardSkeleton}
        />
      </>
    );
  }

  return (
    <>
      {similar.length && (
        <div className="st">
          <span ref={sentinelRef} className="block h-1" />
          <section className="bg-gray-950 p-4 text-white relative">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-teal-400">
                {`Similar ${media === "tv" ? "TV Shows" : "Movies"}`}
              </h2>

              <div className="relative group/button">
                <button
                  onClick={() => scroll(-1)}
                  className="hidden absolute sm:flex justify-center items-center left-0 top-1/2 -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-2 rounded-full opacity-0 group-hover/button:opacity-100"
                >
                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>
                </button>

                <button
                  onClick={() => scroll(1)}
                  className="hidden absolute sm:flex justify-center items-center right-0 top-1/2 -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-2 rounded-full opacity-0 group-hover/button:opacity-100"
                >
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </button>

                <div
                  ref={scrollRef}
                  className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2 md:px-5"
                >
                  {similar.map((item) => (
                    <TrendingCard key={`${item.id}-${media}`} {...item} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default SimilarContent;
