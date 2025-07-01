const StatsSection = () => {
  const { moviesWatched, seriesWatched, averageRating } = {
    moviesWatched: 20,
    seriesWatched: 10,
    averageRating: 7.7,
  };

  return (
    <section className="bg-gray-950 text-white py-8 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow hover:shadow-teal-500/10 transition">
          <p className="text-4xl font-bold text-teal-400">{moviesWatched}</p>
          <p className="mt-2 text-gray-400">Movies Watched</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow hover:shadow-teal-500/10 transition">
          <p className="text-4xl font-bold text-teal-400">{seriesWatched}</p>
          <p className="mt-2 text-gray-400">Series Watched</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow hover:shadow-teal-500/10 transition">
          <p className="text-4xl font-bold text-teal-400">{averageRating}</p>
          <p className="mt-2 text-gray-400">Average Rating</p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
