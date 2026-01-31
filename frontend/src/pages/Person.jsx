import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../config/axios";
import TrendingCard from "../components/TrendingCard";
import CardSkeleton from "../components/CardSkeleton";
import BackHeader from "../components/Backheader";

const BIO_LIMIT = 280;

const Person = () => {
  const { id } = useParams();

  const [person, setPerson] = useState(null);

  const [media, setMedia] = useState("movie");
  const [role, setRole] = useState("both"); // actor | crew | both

  const [items, setItems] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);

  const [showFullBio, setShowFullBio] = useState(false);

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

  /* ---------------- DISCOVER ---------------- */

  const getRoleQuery = () => {
    if (role === "actor") return { with_cast: id };
    if (role === "crew") return { with_crew: id };

    return { with_people: id };
  };

  const fetchDiscover = async (p = 1, type = media) => {
    if (listLoading || p > totalPages) return;

    try {
      setListLoading(true);

      const { data } = await API.get("/tmdb/discover", {
        params: {
          media: type,
          sort_by: "popularity.desc",
          page: p,
          ...getRoleQuery(),
        },
      });

      setItems((prev) =>
        p === 1 ? data.results : [...prev, ...data.results],
      );

      setPage(data.page);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error("Discover failed:", err);
    } finally {
      setListLoading(false);
      setLoading(false);
    }
  };

  /* ---------------- INIT / FILTER CHANGE ---------------- */

  useEffect(() => {
    setItems([]);
    setPage(1);
    setTotalPages(1);
    setLoading(true);

    fetchDiscover(1, media);
  }, [id, media, role]);

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

  /* ---------------- BIO HELPERS ---------------- */

  const biography = person?.biography || "No biography available.";

  const shortBio =
    biography.length > BIO_LIMIT
      ? biography.slice(0, BIO_LIMIT) + "…"
      : biography;

  /* ---------------- LOADING HERO ---------------- */

  if (loading && !person) {
    return (
      <div className="bg-gray-950 min-h-screen text-white">
        <BackHeader title="People" />

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

      {/* ---------------- HERO ---------------- */}

      <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-10">
        <div className="relative group flex-shrink-0">
          <img
            src={
              person?.profile_path
                ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                : "/placeholder-person.png"
            }
            alt={person?.name}
            className="w-56 mx-auto rounded-xl shadow-2xl border border-gray-800 group-hover:border-teal-500/50 transition-all duration-300 group-hover:shadow-teal-500/20"
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

          {/* META */}
          <div className="flex flex-wrap gap-3 pt-1">
            {person?.birthday && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-teal-500/40 transition-all duration-200">
                <span className="text-gray-400 text-sm font-medium">Birthday:</span>
                <span className="text-gray-200 text-sm">{person.birthday}</span>
              </div>
            )}

            {person?.place_of_birth && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-teal-500/40 transition-all duration-200">
                <span className="text-gray-400 text-sm font-medium">Birthplace:</span>
                <span className="text-gray-200 text-sm">{person.place_of_birth}</span>
              </div>
            )}
          </div>

          {/* BIO */}
          <div className="pt-2">
            <h2 className="text-lg font-semibold text-white mb-3">Biography</h2>

            <p className="max-w-2xl leading-relaxed text-gray-300">
              {showFullBio ? biography : shortBio}
            </p>

            {biography.length > BIO_LIMIT && (
              <button
                onClick={() => setShowFullBio((p) => !p)}
                className="mt-3 text-teal-400 text-sm font-medium hover:text-teal-300 transition-colors duration-200"
              >
                {showFullBio ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ---------------- FILTER BAR ---------------- */}

      <section className="max-w-7xl mx-auto px-6 pb-6">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-teal-400">
              Filmography
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full" />
          </div>

          <div className="flex gap-3 w-full justify-between md:w-auto">
            {/* ROLE */}
            <div className="inline-flex bg-gray-900 rounded-lg p-1 border border-gray-800">
              {["both", "actor", "crew"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-3 py-1 rounded-md text-xs md:text-sm font-medium transition-all duration-200 ${
                    role === r
                      ? "bg-teal-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {r === "both"
                    ? "All"
                    : r === "actor"
                    ? "Acting"
                    : "Crew"}
                </button>
              ))}
            </div>

            {/* MEDIA */}
            <div className="inline-flex bg-gray-900 rounded-lg p-1 border border-gray-800">
              {["movie"].map((m) => (
                <button
                  key={m}
                //   onClick={() => setMedia(m)}
                  className={`px-3 py-1 rounded-md text-xs md:text-sm font-medium transition-all duration-200 ${
                    media === m
                      ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  {m === "movie" ? "Movies" : "TV"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- GRID ---------------- */}

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item) => (
            <TrendingCard
              key={`${item.id}-${item.media_type}`}
              {...item}
            />
          ))}

          {listLoading &&
            Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
        </div>

        {/* SENTINEL */}
        <div
          ref={observerRef}
          className="h-20 flex justify-center items-center"
        >
          {listLoading && page > 1 && (
            <p className="text-gray-400 text-sm">Loading more…</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Person;