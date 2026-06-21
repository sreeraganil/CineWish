import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import SportsRow from '../../components/sports/SportsRow';
import { sportsApi } from '../../config/sportsApi';
import useSportsStore from '../../store/sportsStore';

const SportsHome = () => {
  const navigate = useNavigate();
  const { categories, fetchCategories, loading } = useSportsStore();
  const categoriesScrollRef = useRef(null);

  const scrollCategories = (direction) => {
    const el = categoriesScrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * 300,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    document.title = "Sports - CineWish";
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="min-h-screen text-white pb-20 md:pb-0 bg-black">
      <Header />

      {/* Simple Hero Section */}
      <section className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />

        {/* Placeholder background, usually would rotate through popular matches */}
        <img
          src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2500&auto=format&fit=crop"
          alt="Sports Hero"
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-[20%] left-[4%] md:left-[8%] z-20 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Live Sports
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6 drop-shadow-md">
            Stream your favorite matches live. Football, Basketball, Cricket,
            and more.
          </p>
          <div className="flex gap-4">
            <Link
              to="/sports/live"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold transition flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Watch Live
            </Link>
            <Link
              to="/sports/search"
              className="bg-gray-800/80 hover:bg-gray-700 text-white px-6 py-2 rounded font-semibold transition backdrop-blur-sm border border-gray-600"
            >
              Search Matches
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="px-2 md:px-4 py-2">
        <h2 className="text-lg font-bold mb-2 text-teal-400 px-0 sm:px-2">
          Categories
        </h2>
        <div className="relative group/cat">
          {/* LEFT BUTTON */}
          <button
            onClick={() => scrollCategories(-1)}
            className="hidden sm:flex absolute justify-center items-center left-0 top-1/2 -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-1.5 rounded-full opacity-0 group-hover/cat:opacity-100 shadow-md"
            aria-label="Scroll left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="currentColor"
            >
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>

          {/* RIGHT BUTTON */}
          <button
            onClick={() => scrollCategories(1)}
            className="hidden sm:flex absolute justify-center items-center right-0 top-1/2 -translate-y-1/2 z-10 bg-teal-500 bg-opacity-75 hover:bg-opacity-100 hover:scale-105 transition p-1.5 rounded-full opacity-0 group-hover/cat:opacity-100 shadow-md"
            aria-label="Scroll right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="currentColor"
            >
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>

          <div
            ref={categoriesScrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide py-1 px-2 md:px-4"
          >
            {categories
              ?.sort((a, b) => {
                const priority = {
                  Cricket: 0,
                  Football: 1,
                };

                const aPriority = priority[a.name] ?? 999;
                const bPriority = priority[b.name] ?? 999;

                if (aPriority !== bPriority) {
                  return aPriority - bPriority;
                }

                return a.name.localeCompare(b.name);
              })
              .map((cat) => (
                <Link
                  key={cat.id}
                  to={`/sports/${cat.id}`}
                  className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-teal-500 rounded-lg px-4 py-2 flex-none transition-all hover:scale-105"
                >
                  <h3 className="text-sm font-semibold capitalize text-gray-200">
                    {cat.name}
                  </h3>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-0">
        <SportsRow title="Live Now" fetchFunction={sportsApi.getLiveMatches} />
        <SportsRow
          title="Popular Today"
          fetchFunction={sportsApi.getTodayPopularMatches}
        />
        <SportsRow
          title="Football"
          fetchFunction={() => sportsApi.getMatchesBySport("football")}
        />
        <SportsRow
          title="Basketball"
          fetchFunction={() => sportsApi.getMatchesBySport("basketball")}
        />
        <SportsRow
          title="Cricket"
          fetchFunction={() => sportsApi.getMatchesBySport("cricket")}
        />
      </div>
    </div>
  );
};

export default SportsHome;
