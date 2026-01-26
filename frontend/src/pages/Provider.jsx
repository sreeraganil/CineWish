import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import BackHeader from "../components/Backheader";
import TrendingCard from "../components/TrendingCard";
import CardSkeleton from "../components/CardSkeleton";

import providers from "../utilities/watchProviders.json";
import providerStore from "../store/providerStore";

const Provider = () => {
  const { id } = useParams();

  const provider = providers.find((p) => String(p.id) === id);

  const observerRef = useRef(null);

  const {
    items,
    page,
    totalPages,
    loading,
    fetchProvider,
    resetProvider,
    providerId,
    scrollPosition,
    setScrollPosition,
    media,
  } = providerStore();

  // ---- INIT / RESTORE ----
  useEffect(() => {
    if (providerId == id) {
      setTimeout(() => {
        window.scrollTo({ top: scrollPosition, behavior: "instant" });
      }, 0);
      return;
    }

    window.scrollTo({ top: 0, behavior: "instant" });
    resetProvider();
    fetchProvider({ providerId: id, page: 1, media: "movie" });
  }, [id]);

  // ---- Infinite Scroll ----
  useEffect(() => {
    if (!observerRef.current || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && page < totalPages) {
          fetchProvider({
            providerId: id,
            page: page + 1,
            media,
          });
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [page, totalPages, loading, media]);

  // ---- Title ----
  useEffect(() => {
    document.title = provider
      ? `Cinewish – ${provider.name}`
      : "Cinewish – Provider";
  }, [provider]);

  return (
    <div
      className="bg-gray-950 min-h-screen text-white"
      onClickCapture={() => setScrollPosition(window.scrollY)}
    >
      <BackHeader title="Provider" />

      <section className="relative overflow-hidden">
        {/* Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${
            provider?.gradient || "from-gray-900 to-black"
          } opacity-60`}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.08),transparent_55%)]" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
          {provider?.image && (
            <div className="mb-4 sm:mb-6 flex justify-center md:justify-start">
              <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/15">
                <img
                  src={provider.image}
                  alt={provider.name}
                  className="h-12 sm:h-14 md:h-16 w-auto object-contain drop-shadow-xl"
                />
              </div>
            </div>
          )}

          {/* Provider Info */}
          <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {provider?.name || "Provider"}
            </h1>

            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start text-[11px] sm:text-xs">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="material-symbols-outlined text-teal-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                  >
                    <path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12zm-5-6l-7 4V7z" />
                  </svg>
                </span>
                <span className="text-gray-300">Streaming Provider</span>
              </div>

              {provider?.origin_country && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="material-symbols-outlined text-teal-400">
                    globe
                  </span>
                  <span className="text-gray-300">
                    {provider.origin_country}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-t from-gray-950 to-transparent" />
      </section>

      {/* CONTENT SECTION */}
      <section className="max-w-7xl mx-auto px-3 sm:px-5 py-6 sm:py-8">
        {/* Header with Media Toggle */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          {/* Title & Count */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 truncate">
                {media === "movie" ? "Movies" : "TV Shows"}
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">
                {items.length > 0 &&
                  `${items.length} ${items.length === 1 ? "item" : "items"} loaded`}
              </p>
            </div>

            {/* Media Toggle - Mobile Compact */}
            <div className="relative inline-flex bg-gray-900/50 backdrop-blur-sm rounded-lg p-0.5 border border-gray-800">
              {["movie", "tv"].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    resetProvider();
                    fetchProvider({
                      providerId: id,
                      page: 1,
                      media: m,
                    });
                  }}
                  className={`px-3 md:px-5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    media === m
                      ? "bg-teal-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {m === "movie" ? "Movies" : "TV"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {items.map((item, i) => (
            <TrendingCard key={`${item.id}-${i}`} {...item} />
          ))}

          {loading &&
            Array.from({ length: 10 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>

        {/* EMPTY STATE */}
        {!loading && items.length === 0 && (
          <div className="text-center py-12 sm:py-20">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">📺</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-2 px-4">
              No {media === "movie" ? "movies" : "TV shows"} found
            </h3>
            <p className="text-sm sm:text-base text-gray-500 px-4">
              This provider doesn't have any{" "}
              {media === "movie" ? "movies" : "TV shows"} available yet.
            </p>
          </div>
        )}

        {/* SENTINEL */}
        <div
          ref={observerRef}
          className="h-16 sm:h-20 flex justify-center items-center mt-6 sm:mt-8"
        >
          {loading && page > 1 && (
            <div className="flex items-center gap-2 text-teal-400">
              <div
                className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Provider;
