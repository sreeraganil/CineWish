import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../config/axios";
import Header from "../components/Header";
import TrendingCard from "../components/TrendingCard";
import CardSkeleton from "../components/CardSkeleton";
import BackHeader from "../components/Backheader";

const Person = () => {
  const { id } = useParams();

  const [person, setPerson] = useState(null);

  const [media, setMedia] = useState("movie");
  const [items, setItems] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);

  const observerRef = useRef(null);

  /* ---------------- FETCH PERSON ---------------- */

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    const loadPerson = async () => {
      try {
        const { data } = await API.get(`/tmdb/person/${id}`);
        setPerson(data);
      } catch (err) {
        console.error("Person fetch failed:", err);
      }
    };

    loadPerson();
  }, [id]);

  /* ---------------- FETCH FILMOGRAPHY ---------------- */

  const fetchDiscover = async (p = 1, type = media) => {
    if (listLoading || p > totalPages) return;

    try {
      setListLoading(true);

      const { data } = await API.get("/tmdb/discover", {
        params: {
          media: type,
          with_cast: id,
          sort_by: "popularity.desc",
          page: p,
        },
      });

      setItems((prev) => (p === 1 ? data.results : [...prev, ...data.results]));

      setPage(data.page);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error("Discover failed:", err);
    } finally {
      setListLoading(false);
      setLoading(false);
    }
  };

  /* ---------------- INIT / MEDIA SWITCH ---------------- */

  useEffect(() => {
    setItems([]);
    setPage(1);
    setTotalPages(1);
    setLoading(true);

    fetchDiscover(1, media);
  }, [id, media]);

  /* ---------------- INTERSECTION ---------------- */

  useEffect(() => {
    if (!observerRef.current || listLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && page < totalPages) {
          fetchDiscover(page + 1);
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [page, totalPages, listLoading]);

  /* ---------------- LOADING HERO ---------------- */

  if (loading && !person) {
    return (
      <div className="bg-gray-950 min-h-screen text-white">
        <Header />

        <div className="max-w-7xl mx-auto p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <BackHeader title="People" />

      <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-10">
        <div className="relative group flex-shrink-0">
          <img
            src={
              person?.profile_path
                ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                : "/placeholder-person.png"
            }
            className="w-56 rounded-xl shadow-2xl border border-gray-800 group-hover:border-teal-500/50 transition-all duration-300 group-hover:shadow-teal-500/20"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        <div className="space-y-5">
          <div>
            <h1 className="text-4xl font-bold text-white">{person?.name}</h1>

            {person?.known_for_department && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-teal-500/20 backdrop-blur-sm rounded-lg border border-teal-400/30">
                <span className="text-teal-300 font-semibold text-sm">
                  {person.known_for_department}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            {person?.birthday && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-teal-500/40 transition-all duration-200">
                <span className="text-gray-400 text-sm font-medium">
                  Birthday:
                </span>
                <span className="text-gray-200 text-sm">{person.birthday}</span>
              </div>
            )}

            {person?.place_of_birth && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-teal-500/40 transition-all duration-200">
                <span className="text-gray-400 text-sm font-medium">
                  Birthplace:
                </span>
                <span className="text-gray-200 text-sm">
                  {person.place_of_birth}
                </span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <h2 className="text-lg font-semibold text-white mb-3">Biography</h2>

            <p className="max-w-4xl leading-relaxed text-gray-300">
              {person?.biography || "No biography available."}
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- FILTER ---------------- */}

      <section className="max-w-7xl mx-auto px-6 pb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-teal-400">Filmography</h2>

          <div className="inline-flex bg-gray-900/60 rounded-lg p-1 border border-gray-800">
            <button
            //   onClick={() => setMedia("movie")}
              className={`px-4 py-1.5 rounded-md text-sm ${
                media === "movie"
                  ? "bg-teal-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Movies
            </button>

            {/* <button
              onClick={() => setMedia("tv")}
              className={`px-4 py-1.5 rounded-md text-sm ${
                media === "tv"
                  ? "bg-teal-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              TV
            </button> */}
          </div>
        </div>
      </section>

      {/* ---------------- GRID ---------------- */}

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {items.map((item) => (
            <TrendingCard key={`${item.id}-${item.media_type}`} {...item} />
          ))}

          {listLoading &&
            Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>

        {/* SENTINEL */}
        <div
          ref={observerRef}
          className="h-20 flex justify-center items-center"
        >
          {listLoading && page > 1 && (
            <p className="text-gray-400">Loading more…</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Person;
