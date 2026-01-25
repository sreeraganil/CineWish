import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import TrendingCard from "../components/TrendingCard";
import CardSkeleton from "../components/CardSkeleton";
import BackHeader from "../components/Backheader";
import networkStore from "../store/networkStore";
import networks from "../utilities/networks.json";

const Network = () => {
  const { id } = useParams();
  const [media, setMedia] = useState("tv");

  const network = networks.find((n) => String(n.id) === id);

  const observerRef = useRef(null);

  const {
    items,
    page,
    totalPages,
    loading,
    fetchNetwork,
    resetNetwork,
    networkId,
    scrollPosition,
    setScrollPosition,
  } = networkStore();

  // ---- INIT / RESTORE ----
  useEffect(() => {
    if (networkId == id) {
      setTimeout(() => {
        window.scrollTo({ top: scrollPosition, behavior: "instant" });
      }, 0);
      return;
    }

    window.scrollTo({ top: 0, behavior: "instant" });
    resetNetwork();
    fetchNetwork({ networkId: id, page: 1, media });
  }, [id, media]);

  // ---- Intersection Observer ----
  useEffect(() => {
    if (!observerRef.current || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && page < totalPages) {
          fetchNetwork({
            networkId: id,
            page: page + 1,
            media,
          });
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [page, totalPages, loading]);

  // ---- Title ----
  useEffect(() => {
    document.title = network
      ? `Cinewish – ${network.name}`
      : "Cinewish – Network";
  }, [network]);

  return (
    <div
      className="bg-gray-950 min-h-screen text-white"
      onClickCapture={() => setScrollPosition(window.scrollY)}
    >
      <BackHeader title="Network" />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${
            network?.gradient || "from-gray-900 to-black"
          } opacity-60`}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          {network?.image && (
            <img
              src={network.image}
              alt={network.name}
              className="h-20 mb-6"
            />
          )}

          <h1 className="text-4xl font-bold">{network?.name}</h1>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-950 to-transparent" />
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-3 sm:px-5 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">
            {media === "movie" ? "Movies" : "TV Shows"}
          </h2>

          {/* Toggle */}
          <div className="flex bg-gray-900 rounded-lg p-1">
            {["tv"].map((m) => (
              <button
                key={m}
                // onClick={() => {
                //   setMedia(m);
                //   resetNetwork();
                //   fetchNetwork({ networkId: id, page: 1, media: m });
                // }}
                className={`px-3 md:px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
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

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {items.map((item) => (
            <TrendingCard key={item.id} {...item} />
          ))}

          {loading &&
            Array.from({ length: 10 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
        </div>

        {/* SENTINEL */}
        <div
          ref={observerRef}
          className="h-20 flex justify-center items-center mt-8"
        />
      </section>
    </div>
  );
};

export default Network;
