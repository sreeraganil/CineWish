import React, { useRef, useEffect, useState } from 'react';
import SportsCard from './SportsCard';
import { RowSkeleton } from './SportsSkeleton';

const SportsRow = ({ title, fetchFunction, storeSelector, params = {} }) => {
  const scrollRef = useRef(null);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);
  
  // Data could be passed directly or we could trigger a fetch and read from store.
  // For simplicity, we'll accept a fetchFunction that returns a promise of data,
  // or we manage local state here if not using a specific store slice for every dynamic row.
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (hasFetched) return;

    observerRef.current = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;

        try {
          const result = await fetchFunction(params);
          setData(result || []);
        } catch (error) {
          console.error(`Error fetching row ${title}:`, error);
        } finally {
          setLoading(false);
          setHasFetched(true);
          observerRef.current?.disconnect();
        }
      },
      { rootMargin: "200px" } // Load a bit earlier
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [fetchFunction, params, hasFetched, title]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = direction * el.offsetWidth - 250;
    el.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading && !hasFetched) {
    return (
      <>
        <span ref={sentinelRef} className="block h-1" />
        <RowSkeleton title={title} />
      </>
    );
  }

  if (!data || data.length === 0) {
    return null; // Don't show empty rows
  }

  return (
    <>
      <span ref={sentinelRef} className="block h-[1px] w-full" />
      <section className="py-2 px-2 sm:px-4 text-white relative">
        <div className="max-w-8xl mx-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4 text-teal-400 capitalize px-0 sm:px-2">
            {title}
          </h2>

          <div className="relative group/button">
            {/* LEFT BUTTON */}
            <button
              onClick={() => scroll(-1)}
              className="hidden sm:flex absolute justify-center items-center left-0 top-1/2 -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-2 rounded-full opacity-0 group-hover/button:opacity-100"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>

            {/* RIGHT BUTTON */}
            <button
              onClick={() => scroll(1)}
              className="hidden sm:flex absolute justify-center items-center right-0 top-1/2 -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-2 rounded-full opacity-0 group-hover/button:opacity-100"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>

            {/* Horizontal scroller */}
            <div
              ref={scrollRef}
              className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2 sm:px-3 md:px-5 -mx-2 sm:mx-0 pb-4"
            >
              {data.map((match) => (
                <SportsCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SportsRow;
