import { useEffect } from "react";
import userStore from "../store/userStore";

const StatsSection = () => {

  const { stats, fetchStats, user } = userStore();

  useEffect(()=>{
    user && fetchStats();
  },[])

  if(!user) return null

  return (
    <section className="bg-gray-950 text-white p-2 sm:p-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 text-center px-2 sm:px-0">
        <div className="bg-gray-900 border border-gray-800 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl shadow hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 hover:scale-105 hover:border-teal-500/30">
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-teal-400">
            {stats?.moviesWatched || 0}
          </p>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-400">
            Movies Watched
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl shadow hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 hover:scale-105 hover:border-teal-500/30">
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-teal-400">
            {stats?.seriesWatched || 0}
          </p>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-400">
            Series Watched
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl shadow hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 hover:scale-105 hover:border-teal-500/30">
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-teal-400">
            {stats?.averageRating || "N/A"}
          </p>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-400">
            Average Rating
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
