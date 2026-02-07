import { useEffect, useRef, useState } from "react";
import SectionSkeleton from "./SectionSkeleton";
import CardSkeleton from "./CardSkeleton";
import useHomeRowStore from "../store/homeRowStore";
import TrendingCard from "./TrendingCard";

/**
 * Props:
 *  title
 *  rowKey
 *  media
 *  params
 */

const DiscoverRow = ({ title, rowKey, media = "movie", params = {} }) => {
  const scrollRef = useRef(null);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  // NEW: wrapper ref for vertical position
  const rowWrapperRef = useRef(null);

  const row = useHomeRowStore((s) => s.rows[rowKey]);
  const fetchRow = useHomeRowStore((s) => s.fetchRow);
  const setLastRowScroll = useHomeRowStore((s) => s.setLastRowScroll);

  const [loading, setLoading] = useState(!row);

  /* ---------- OBSERVER LOAD (ONLY IF NOT FETCHED) ---------- */

  useEffect(() => {
    if (row?.items?.length) {
      setLoading(false);
      return;
    }

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;

        await fetchRow({
          key: rowKey,
          media,
          params,
          page: 1,
        });

        setLoading(false);
        observerRef.current?.disconnect();
      },
      { rootMargin: "0px" },
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [rowKey, media, row]);

  /* ---------- SAVE ROW POSITION BEFORE NAV ---------- */

  const saveRowPosition = () => {
    if (!rowWrapperRef.current) return;

    const rect = rowWrapperRef.current.getBoundingClientRect();

    setLastRowScroll({
      key: rowKey,
      top: rect.top + window.scrollY,
    });
  };

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = direction * el.offsetWidth - 250;

    el.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  /* ---------- LOADING ---------- */

  if (loading) {
    return (
      <>
        <span ref={sentinelRef} className="block h-1" />
      </>
    );
  }

  if (!row?.items?.length)
    return <SectionSkeleton title={title} CardSkeleton={CardSkeleton} />;

  return (
    <>
      <span ref={sentinelRef} className="block h-1 w-full bg-gray-950" />

      <section
        ref={rowWrapperRef}
        className="bg-gray-950 p-2 sm:p-4 text-white relative"
        onClickCapture={saveRowPosition}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-teal-400 sm:px-0">
            {title}
          </h2>

          <div className="relative group/button">
            {/* LEFT */}
            <button
              onClick={() => scroll(-1)}
              className="hidden sm:flex absolute justify-center items-center left-0 top-1/2 -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-2 rounded-full opacity-0 group-hover/button:opacity-100"
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

            {/* RIGHT */}
            <button
              onClick={() => scroll(1)}
              className="hidden sm:flex absolute justify-center items-center right-0 top-1/2 -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-2 rounded-full opacity-0 group-hover/button:opacity-100"
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

            {/* Horizontal scroller */}
            <div
              ref={scrollRef}
              className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2 sm:px-3 md:px-5 -mx-2 sm:mx-0"
            >
              {row.items.map((item) => (
                <TrendingCard key={`${item.id}-${rowKey}`} {...item} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DiscoverRow;
